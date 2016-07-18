/**
 * Created by preciousr on 19/01/2016.
 */
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

//////////////////////////////////////
// ---- Personal Details        ---- //
//////////////////////////////////////
    //MAIL CHECK
$(document).ready(function() {

    var $email = $('#email');
    var $email_hint = $("#email_hint");
    var $confirm_email = $('#email-confirm');
    var $confirm_email_hint = $("#confirm_email_hint");


    $email.on('blur', function () {
        $email_hint.css('display', 'none').empty();
        $(this).mailcheck({
            domains: customDomains,                       // optional
            secondLevelDomains: customSecondLevelDomains, // optional
            suggested: function (element, suggestion) {
                if (!$email_hint.html()) {
                    // First error - fill in/show entire hint element
                    suggestion = "Did you mean <span class='suggestion'>" +
                    "<a href='#' class='domain'>" +
                    "<span class='address'>" + suggestion.address + "</span>" +
                    "@" + suggestion.domain +
                    "</a></span>?";

                    $email_hint.html(suggestion).fadeIn(150);
                } else {
                    // Subsequent errors
                    $(".address").html(suggestion.address);
                    $(".domain").html(suggestion.domain);
                }
            }
        });
    });


    $email_hint.on('click', '.domain', function () {
        // On click, fill in the field with the suggestion and remove the hint
        $email.val($(".suggestion").text());
        $email_hint.fadeOut(200, function () {
            $(this).empty();
        });
        return false;
    });



});
//////////////////////////////////////
// ---- Address Details        ---- //
//////////////////////////////////////

// Manually enter the primary address fields
$("#address-manual").click(function() {
    $("#manual-address-field").addClass("show").removeClass('hide');
});
// Manually enter the alternative address fields
$("#address-manual-alt").click(function() {
    $("#address-details-group-alt").addClass("show").removeClass('hide').removeClass('js-hidden');
});

$('#find-address').click(function(event){
    if (browser.isIe() && browser.getVersion() <= 9) {
       return true;
    }
    event.preventDefault();
    $.post("/ajax-find-your-address",
        {address_type: $('input[name="address_type"]').val(), "find-postcode": $('#find-postcode').val()},
        function (data, status) {
            if(data.error || data.addresses===false){
                $("#sr-notification-container").empty().text("The postcode entered was invalid. Enter a valid postcode.");
                showPostCodeError(data.error);
                clearResultAddresses();
            }else{
                $('#postcode-error').addClass('hide');
                $("#sr-notification-container").empty().text("The postcode search was successful results are shown below.");
                showResultAddresses(data.addresses);
            }
        });

});


function showPostCodeError(error){
    var html = '<h2 class="heading-medium error-summary-heading" id="error-summary-heading">Please check the form</h2>' +
        '<ul class="error-summary-list nopadding"><li><a>'+error+'</a></li></ul>';
    $('#postcode-error').removeClass('hide').html(html);
}

function clearResultAddresses(){
    $('#address-list-group').addClass('hide');
    $('#address-list-box')
        .empty();
}

function showResultAddresses(addresses){
    $('#address-list-group').removeClass('hide');
    $('#address-list-box')
        .empty()
        .append($("<option></option>")
            .text('Pick an address')
            .attr('disabled','true')
            .attr('selected','true')
    );
    for(var i=0;i<addresses.length;i++){
        $('#address-list-box')
            .append($("<option></option>")
                .attr("value",i)
                .text(addresses[i].option)
        );
    }
}


$('#address-list-box').change(function(e){
    if (browser.isIe() && browser.getVersion() <= 9) {
        $('#select-address-button-div').removeClass('hide').removeClass('js-hidden');
        return true;
    }
    $.post("/ajax-select-your-address",
        {address_type: $('input[name="address_type"]').val(),chosen:$('#address-list-box').val()},
        function (data, status) {
            $("#sr-notification-container").empty().text("The address you've selected has been added to the form. Submit to continue.");
            $('#uk-address-form').removeClass('hide');
            $('input[name="full_name"]').val(data.full_name);
            $('input[name="organisation"]').val(data.address.organisation || '');
            $('input[name="house_name"]').val(data.address.house_name || '');
            $('input[name="street"]').val(data.address.street);
            $('input[name="town"]').val(data.address.town);
            $('input[name="county"]').val(data.address.county);
            $('input[name="postcode"]').val(data.address.postcode);
            $('#disabled-button').addClass('hide');

        });
});

//////////////////////////////////////
// ---- Document Quantity      ---- //
//////////////////////////////////////
$('#total-row').removeClass('hide');
$(document).ready(function(){
    var sum = 0;
    var totalCost = 0;
    $('body').find('.number').each(function () {
        sum += Number($(this).val());
        totalCost = sum * documentCost;
    });
    $('#total').text(sum);
    $('#cost').text('£'+totalCost);
});
$(document).on('change blur keydown paste input', '.number', function () {
    var sum = 0;
    var totalCost = 0;
    $('body').find('.number').each(function () {
        sum += Number($(this).val());
        totalCost = sum * documentCost;
    });
    $('#total').text(sum);
    var cost = totalCost <0 || sum % 1 !== 0|| sum >999 ? 'Invalid number of documents': '£'+totalCost.toString();
    $('#cost').text(cost);
    $("#sr-notification-container").empty().text("Cost total updated, new total is "+cost);

});

