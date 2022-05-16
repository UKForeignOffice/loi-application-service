-- Home office doc
UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>'
WHERE html_id = 'home-office-document';

-- HM Revenue doc
UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>'
WHERE html_id = 'hm-revenue-and-customs-document';
