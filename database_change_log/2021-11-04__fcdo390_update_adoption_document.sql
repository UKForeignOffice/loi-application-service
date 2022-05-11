update "AvailableDocuments" set "eligible_check_option_5" = 'A print out of your *replaceme* which has been produced as a PDF/electronic document. The document may contain an electronic/digital signature or seal <span>certification required</span>' 
where "doc_title" = 'Adoption Document';

update "AvailableDocuments" set "eligible_check_option_4" = 'A photocopy <span>certification required</span> of your *replaceme*  <span>certification required</span>'
where "doc_title" = 'Adoption Document';

update "AvailableDocuments" set "eligible_check_option_3" = 'Your original document not stamped or sealed or signed by a court or an official of the court  <span>certification required</span>'
where "doc_title" = 'Adoption Document';

update "AvailableDocuments" set "eligible_check_option_2" = 'Your original document stamped or sealed in wet ink by the court, or signed by an official of the court or a judge'
where "doc_title" = 'Adoption Document';

update "AvailableDocuments" set "eligible_check_option_1" = 'Your original UK adoption certificate or certified copy from either the General Register Office (GRO) or local register office'
where "doc_title" = 'Adoption Document';

