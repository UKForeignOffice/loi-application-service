/**
 * Created by preciousr on 06/01/2016.
 */
//User Details
function empty(input){
    if(typeof(input) =='undefined' || input.length===0){
        return true;
    }
    return false;
}

function validateEmail(email)
{
    //regexp anyString@anyString.anyString
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
/*
$('#yourDetailsForm').submit(function() {

    var errorMessages = '';
    var errorLinks = '<ul class="error-summary-list nopadding">';
    var error = false;
    var values= getFormValues('#yourDetailsForm');

    if(empty(values['first_name'])){
        $('#legend_first_name').removeClass('hide').addClass('show');
        errorMessages+='<p>You have not provided your first name.</p>';
        errorLinks+='<li><a href="#legend_first_name">Please enter your first name.</a></li>';
        $('#legend_first_name').closest(".form-group").addClass('error');
        var legendError = '<p>You have not provided your first name.</p>';
        $('#legend_first_name span.error-message').append(legendError);
        error = true;
    } else {
        $('#legend_first_name').removeClass('show').addClass('hide');
        $('#legend_first_name').closest(".form-group").removeClass('error');
        error = false;
    }

    if(empty(values['last_name'])){
        $('#legend_last_name').removeClass('hide').addClass('show');
        errorMessages+='<p>You have not provided your last name.</p>';
        errorLinks+='<li><a href="#legend_last_name">Please enter your last name.</a></li>';
        $('#legend_last_name').closest(".form-group").addClass('error');
        var legendError = '<p>You have not provided your last name.</p>';
        $('#legend_last_name span.error-message').append(legendError);
        error = true;
    } else {
        $('#legend_last_name').removeClass('show').addClass('hide');
        $('#legend_last_name').closest(".form-group").removeClass('error');
        error = false;
    }
    if(empty(values['telephone'])){
        $('#legend_telephone').removeClass('hide').addClass('show');
        errorMessages+='<p>You have not provided a valid phone number</p>';
        errorLinks+='<li><a href="#legend_telephone">Please enter a valid phone number.</a></li>';
        $('#legend_telephone').closest(".form-group").addClass('error');
        var legendError = '<p>You have not provided a valid phone number</p>';
        $('#legend_telephone span.error-message').append(legendError);
        error = true;
    } else {
        $('#legend_telephone').removeClass('show').addClass('hide');
        $('#legend_telephone').closest(".form-group").removeClass('error');
        error = false;
    }
    if(empty(values['email'].trim())|| !validateEmail(values['email'].trim())){
        $('#legend_email').removeClass('hide').addClass('show');
        errorMessages+='<p>The email address you have entered is invalid.</p>';
        errorLinks+='<li><a href="#legend_email">Please enter a valid email address.</a></li>';
        $('#legend_email').closest(".form-group").addClass('error');
        var legendError = '<p>The email address you have entered is invalid.</p>';
        $('#legend_email span.error-message').append(legendError);
        error = true;
    } else {
        $('#legend_email').removeClass('show').addClass('hide');
        $('#legend_email').closest(".form-group").removeClass('error');
        error = false;
    }

    if  (
        (!values['confirm_email'].trim() || values['confirm_email'].trim()==='') ||
        (values['email'].trim()!==values['confirm_email'].trim())
        )
        {

        $('#legend_confirm_email').removeClass('hide').addClass('show');
        errorMessages+='<p>Your emails do not match.</p>';
        errorLinks+='<li><a href="#legend_confirm_email">Please confirm your email address.</a></li>';
        $('#legend_confirm_email').closest(".form-group").addClass('error');
            var legendError = '<p>Your emails do not match.</p>';
            $('#legend_confirm_email span.error-message').append(legendError);
        error = true;
    } else {
        $('#legend_confirm_email').removeClass('show').addClass('hide');
        $('#legend_confirm_email').closest(".form-group").removeClass('error');
        error = false;
    }

    if(error){
        $('.error-summary').removeClass('hide').addClass('show');
        $('#all-errors').html(errorMessages+errorLinks+'</ul>');
        return false;
    }

});

function getFormValues(formID){
    // get all the inputs into an array.
    var $inputs = $(formID+' :input');

    // not sure if you wanted this, but I thought I'd add it.
    // get an associative array of just the values.
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    });
    return values
}
    */