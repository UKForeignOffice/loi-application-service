var browser = {
    isIe: function () {
        return navigator.appVersion.indexOf("MSIE") != -1;
    },
    navigator: navigator.appVersion,
    getVersion: function() {
        var version = 999; // we assume a sane browser
        if (navigator.appVersion.indexOf("MSIE") != -1)
        // bah, IE again, lets downgrade version number
            version = parseFloat(navigator.appVersion.split("MSIE")[1]);
        return version;
    }
};

$(document).ready(function() {

    $('input.typeahead.tt-hint').attr('aria-hidden',true);

    if (browser.isIe() && browser.getVersion() <= 9) {
        console.log('IE9');
    }else{
        console.log('NOT IE9 or lower');
        $('.no-js-show').removeClass('no-js-show');
    }
    /*
     Variables
     */
    /**
     * Remove class of 'noJs' as you are here, so js is clearly enabled
     */
    if ($('.no-js-basket')) {
        $('.no-js-basket').removeClass('no-js-basket');
    }
    if ($('.noJs')) {
        $('.noJs').removeClass('noJs');

    }
    if ($('.selectDocNoJs')) {
        $('.selectDocNoJs').addClass('noJs');
    }
    //uncomment to have the shopping basket scroll
    //var element = $('.follow-scroll'),
    //  originalY = element.offset().top;
    //
    //// Space between element and top of screen (when scrolling)
    //var topMargin = 20;
    //
    //// Should probably be set in CSS; but here just for emphasis
    //element.css('position', 'relative');
    //
    //$(window).on('scroll', function(event) {
    //  var scrollTop = $(window).scrollTop();
    //
    //  element.stop(false, false).animate({
    //    top: scrollTop < originalY
    //      ? 0
    //      : scrollTop - originalY + topMargin
    //  }, 300);
    //});
    $('#basket-container').on('change keyup blur', '.basket_doc_count', function(event){
        if (browser.isIe() && browser.getVersion() <= 9) {
            return false;
        }
        updateDocumentCount(event.type=='blur' || event.type=='focusout');
    });

    $('body').on('click', '.help-content-link',function(e) {
        e.preventDefault();
        $(this).next(".help-content-body").toggle();
        $(this).toggleClass("icon-toggle-right icon-toggle-down");
    })
        .on('click','.collapsible', function(){
            $('.collapsible span').html('click to expand');
            $("#sr-notification-container").empty().text('Help collapsed');
            $(this).removeClass('collapsible').addClass('expandable');
        })
        .on('click','.expandable', function(){
            $('.expandable span').html('click to collapse');
            $("#sr-notification-container").empty().text('Help expanded, content can be found below');
            $(this).removeClass('expandable').addClass('collapsible');
        })
        .on('click', '.top-searches a',function(e) {
            var currentDateTime = new Date().toUTCString();
            //Session timed out, so exit the application via a post to another page
            if (sessionExpiry < currentDateTime) {
                window.location = '/select-documents';
                return;
            }
            e.preventDefault();
            $("#sr-notification-container").empty().text('Your search for '+this.href.substr(this.href.indexOf("=")+1,this.href.length).replace(/%20/g,' ')+' has been completed, you can find results below');
            $('#doc_search_field').val(decodeURI(this.href.substr(this.href.indexOf("=")+1,this.href.length)));
            ajaxSearch(this.href.substr(this.href.indexOf("=")+1,this.href.length));
        })
        .on('click', '#dashboard-clear-results',function(e) {
            e.preventDefault();
            $.get("/dashboard?ajax=true", function(html) {
                $('#dashboard-results').html(html);
                $("#sr-notification-container").empty().text("You have cleared the search filters");
            });
        })
        .on('click', '.sortableHeader',function(e) {
            e.preventDefault();
            var raw = this.href.substr(this.href.length-2,this.href.length);
            var coloumns = ['date','application reference', 'service','number of documents','payment', 'your reference'];
            $.get(this.href+'&ajax=true', function(html) {
                var order = raw[0]== '='? 'ascending' :'descending';
                var column = coloumns[raw[1]-1];
                $('#dashboard-results').html(html);
                $("#sr-notification-container").empty().text("You have sorted "+column+" in "+order+" order");
            });
        })
        .on('click', 'div.pager-controls > a, #dashboard-results > div.pager > div.pager-controls > ul > li > a',function(e) {
            e.preventDefault();
            var page = this.href.substr(this.href.length-1,this.href.length);
            $.get(this.href+'&ajax=true', function(html) {
                $('#dashboard-results').html(html);
                $("#sr-notification-container").empty().text("Results page has been changed to page "+page);
            });
        });
    $('#dashboard-search-table-form input[type=submit]').click(function(e){
        e.preventDefault();
        $.get("/dashboard?searchText="+$('#dashboard-search-filter').val()+"&ajax=true", function(html) {

            $('#dashboard-results').html(html);
            $("#sr-notification-container").empty().text("Your search has been completed the results can be found below");
        });
    });


    $('#doc_search_button').click(function(e){
        var currentDateTime = new Date().toUTCString();
        //Session timed out, so exit the application via a post to another page
        if (sessionExpiry < currentDateTime) {
            window.location = '/select-documents';
            return;
        }
        e.preventDefault();
        $("#sr-notification-container").empty().text('Your search for '+$('#doc_search_field').val()+'has been completed, you can find results below');
        ajaxSearch($('#doc_search_field').val());
    });





});
function updateDocumentCount(blur){

    var total = 0;
    var remove = false;
    if(blur) {
        var body = '{';
        $('#manual-remove-doc input[type="number"]').each(function () {
            if (($.isNumeric(this.value) && parseInt(this.value) <= 0) || this.value.length === 0) {
                $("#remove_link" + '_' + this.id).trigger("click");
                remove = true;
            } else {
                total += this.value.length > 0 && $.isNumeric(this.value) ? parseInt(this.value) : 0;
                if ($.isNumeric(this.value)) {
                    body += '"' + this.name + '":' + this.value.toString() + ',';
                }
            }
        });
        if (!remove) {
            body = body.length > 1 ? body.substring(0, body.length - 1) + '}' : '{}';
            $.post("/ajax-update-doc-count",
                JSON.parse(body),
                function (data, status) {

                });
        }
    }else{
        //Only update the count superficially
        $('#manual-remove-doc input[type="number"]').each(function () {
            total += this.value.length > 0 && $.isNumeric(this.value) ? parseInt(this.value) : 0;
        });
        $('#selected-count-table1').html('('+total+')');
    }
}

/* Dashboard */


/* Application filter by free text - filters on reference */
$('.app-search-block').keyup(function() {
    var valThis = $('#search-filter').val().toLowerCase();
    $('#previousApplications>tbody>tr>td.appRef').each(function() {
        var item = $(this).text().toLowerCase();
        if (item.indexOf(valThis) > -1) {
            $(this).parent().show();
        }else{
            $(this).parent().hide();
        }
    });
});

/* Application filter by service */
$('.app-filter-block input').click(function() {
    var checkedItems = $("input[name='search-filter']:checked");
    var checkedItemsCount = checkedItems.length;
    checkedItems.each(function() {
        var serviceCheck = $(this).attr('title').toLowerCase();
        $('#previousApplications>tbody>tr>td.appService').each(function() {
            if (this.innerText.toLowerCase().indexOf(serviceCheck) > -1) {
                $(this).parent().show();
            }else{
                $(this).parent().hide();
            }
        });
    });

    if (checkedItemsCount < 1) { $('#previousApplications>tbody>tr').show(); }
});

$('.clear-app-search').click(function() {
    $('#previousApplications>tbody>tr').show();
    $('#search-filter').val('');
    return false;
});

$('.clear-app-filter').click(function() {
    $('#previousApplications>tbody>tr').show();
    $('input[name="search-filter"]').removeAttr('checked');
    return false;
});


var currentQuery = "";

/*
 * Cursor moved down the list of suggestions.  Keep track
 * of the current suggestion in currentQuery
 */
function logCursorChange(ev, suggestion) {
    if (typeof suggestion == 'undefined') {
        currentQuery = "";
    } else {
        currentQuery = suggestion;
    }
}

/*
 * User triggered a submit, either via the typeahead:submit
 * or autocomplete event
 */
function submitSuggestion(ev, suggestion) {
    ajaxSearch(suggestion);
    // $('#doc-seach-typeahead').val(suggestion);
    //$('#documentFilter').submit();    // submit the form
}


function addLink(event, docId, source, searchTerm, sessionExpiry,doc_name) {
    var currentDateTime = new Date().toUTCString();

    //Session timed out, so exit the application via a post to another page
    if (sessionExpiry < currentDateTime) {
        window.location = '/select-documents';
        return;
    }

    //stop the href from being followed
    event.preventDefault();

    $.get('/add-document-ajax/' + docId + '?searchTerm=' + searchTerm + '&source=' + source, function(html) {
        $('#shopping_basket_container').html(html);
        $('#add_' + docId).addClass('hidden');
        $('#remove_' + docId).removeClass('hidden');
        if ($('#shopping_basket').hasClass('show')) {
            $('#NextBtn').removeClass('hide');
            $('.basket_doc_count').on('change keyup blur', function(event){
                if (browser.isIe() && browser.getVersion() <= 9) {
                    return false;
                }
                updateDocumentCount(event.type=='blur' || event.type=='focusout');
            });

        }
        else {
            $('#NextBtn').addClass('hide');
        }
        $("#sr-notification-container").text(doc_name+" has been selected. It has appeared further down the screen.");
        return false;
    });
}

function removeLink(event, docId, source, searchTerm, sessionExpiry,doc_name) {
    var currentDateTime = new Date().toUTCString();
    //Session timed out, so exit the application via a post to another page
    if (sessionExpiry < currentDateTime) {
        window.location = '/select-documents';
        return;
    }
    //stop the href from being followed
    event.preventDefault();

    $.get('/remove-document-ajax/' + docId + '?searchTerm=' + searchTerm + '&source=' + source, function(html) {
        $("#sr-notification-container").empty().text(doc_name+' has been removed');
        $('#shopping_basket_container').html(html);
        //find the Remove link and toggle to add
        $('#remove_' + docId).addClass('hidden');
        $('#add_' + docId).removeClass('hidden');
        if ($('#shopping_basket').hasClass('show')) {
            $('#NextBtn').removeClass('hide');
            $('.basket_doc_count').on('change keyup blur', function(event){
                if (browser.isIe() && browser.getVersion() <= 9) {
                    return false;
                }
                updateDocumentCount(event.type=='blur' || event.type=='focusout');
            });
        }
        else {
            $('#NextBtn').addClass('hide');
        }
        return false;
    });
}


$('#doc-seach-typeahead .typeahead').typeahead({
        highlight: true,
        minLength: 2
    },
    {
        name: 'titles',
        limit: Infinity ,
        source: function(query, syncResults, asyncResults) {
            // console.log(query);
            currentQuery = query;

            $.get('/query-documents/' + encodeURI(query.trim()), function(data) {
                asyncResults(data);
            });
        }
    })// Submit the form if the user hits "enter"
    .on('typeahead:select', submitSuggestion)
    .on('typeahead:autocomplete', submitSuggestion)
    .on('typeahead:cursorchange', logCursorChange);

// TODO:: add or remove the below to allow a search-then-hit-enter to search for the first item in the suggestion list
// this means the saerch term is always a proper term, and not part of a word, such as if the search is done when only half a term is entered.
// .on('keydown', function(event) {
//     if (event.which === 13) {

//         // If enter key used, set the first child to be the visibley selected item and copy its inner text into the search textfield
//         $('#doc-seach-typeahead .typeahead').parent().find('.tt-selectable:first').addClass('tt-cursor');
//         $('#doc-seach-typeahead .tt-input').val($('.tt-suggestion.tt-selectable:first').text())

//         if (currentQuery === '') {
//             // Trigger the default (first) suggestion
//             $('.tt-suggestion:first-child').trigger('click');
//         } else {
//             // The suggestion they chose with arrow keys
//             $('#doc-seach-typeahead').val(currentQuery);
//             // removed auto submit as this was affecting move by arrow selection
//             //$('#documentFilter').submit();    // submit the form
//         }
//     } else if (event.which === 40) {
//         // If an arrow used first, allow moving to a different option, then detect the enter button being hit

//         if (event.which === 13) {
//             if (currentQuery === '') {
//                 // Trigger the default (first) suggestion
//                 $('.tt-suggestion:first-child').trigger('click');
//             } else {
//                 // The suggestion they chose with arrow keys
//                 $('#doc-seach-typeahead').val(currentQuery);
//                 // removed auto submit as this was affecting move by arrow selection
//                 //$('#documentFilter').submit();    // submit the form
//             }
//         }
//     }
// })

function ajaxSearch(search_term){
    search_term = search_term.replace('#','%23');

    _paq.push(['trackSiteSearch',search_term,false,false]);

    $.get("?searchTerm="+search_term+"&ajax=true", function(html) {
        $('.filtering').html(html);
    });
}



