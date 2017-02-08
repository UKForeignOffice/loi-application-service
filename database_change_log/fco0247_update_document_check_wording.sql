-- update document eligibility checker wording

update "AvailableDocuments"
set eligible_check_option_2 = 'Your original *replaceme* <span>certification required</span>'
where html_id = 'affidavit';

update "AvailableDocuments"
set eligible_check_option_1 = 'Your original *replaceme* <span>certification required</span>'
where html_id = 'school-document';

update "AvailableDocuments"
set eligible_check_option_1 = 'Your original *replaceme* <span>certification required</span>'
where html_id = 'power-of-attorney';

update "AvailableDocuments"
set eligible_check_option_2 = 'Your original *replaceme* <span>certification required</span>'
where html_id = 'change-of-name-deed';

update "AvailableDocuments"
set eligible_check_option_1 = 'Your original *replaceme* <span>certification required</span>'
where html_id = 'statutory-declaration';

update "AvailableDocuments"
set eligible_check_option_1 = 'Your original *replaceme* <span>certification required</span>'
where html_id = 'translation';

update "AvailableDocuments"
set eligible_check_option_1 = 'A copy of your *replaceme* certified, signed and dated by a UK solicitor or notary <span>certification required</span>'
where html_id = 'passport';


