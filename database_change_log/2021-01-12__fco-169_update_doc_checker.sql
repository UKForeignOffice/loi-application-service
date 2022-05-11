--Change of Name Deed changes
--change synonymns for Change of name deed
UPDATE "AvailableDocuments" SET synonyms = 'change of name, change of name deed, personal, identity, ID, identification' WHERE doc_id = '207';

--add new 5th eligibility checker option
ALTER TABLE "AvailableDocuments"
ADD COLUMN eligible_check_option_5 text;

--add new 6th eligibility checker option
ALTER TABLE "AvailableDocuments"
ADD COLUMN eligible_check_option_6 text;


--update first point
UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'An original *replaceme* signed, certified and dated by a UK solicitor or notary public' WHERE doc_id = '207';

--update 2nd point
UPDATE "AvailableDocuments" SET eligible_check_option_2 = 'An original *replaceme* produced by a council or court, signed with an original wet ink signature by a council or court official' WHERE doc_id = '207';

--update 3rd point
UPDATE "AvailableDocuments" SET eligible_check_option_3 = 'An original *replaceme* not signed, certified and dated by a UK solicitor or notary public  <span>certification required</span>' WHERE doc_id = '207';

--update 4th point
UPDATE "AvailableDocuments" SET eligible_check_option_4 = 'An original *replaceme* produced by a council or court not signed by a council or court official  <span>certification required</span>' WHERE doc_id = '207';

--update 5th point
UPDATE "AvailableDocuments" SET eligible_check_option_5 = 'A photocopy of your *replaceme*  <span>certification required</span>' WHERE doc_id = '207';

--update 6th point
UPDATE "AvailableDocuments" SET eligible_check_option_6 = 'A print out of your *replaceme* which has been produced as a PDF/electronic document. The document may contain an electronic/digital signature or seal  <span>certification required</span>' WHERE doc_id = '207';




--update Change of No Impediment
UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'An original *replaceme* signed by the named registrar or duplicate produced by the register office signed by the named registrar or duplicate produced by the Register Office signed with an original ink signature of the named registrar' where doc_id = '206';

--insert a new doc - adoption_document
INSERT INTO "AvailableDocuments" (
doc_id,
"updatedAt",
"createdAt",
html_id,
certification_notes,
delete_additional_notes,
legislation_allowed,
photocopy_allowed,
certification_required,
doc_type_id,
doc_title,
doc_title_start,
doc_title_mid,
additional_detail,
eligible_check_option_1,
eligible_check_option_2,
eligible_check_option_3,
legalisation_clause,
kind_of_document,
extra_title_text,
synonyms,
accept_text,
eligible_check_option_4,
eligible_check_option_5,
eligible_check_option_6
)
VALUES (
    '261',
null,
null,
'adoption_document',
null,
null,
'true',
'true',
'true',
'3',
'Adoption Document',
'Adoption document',
'UK adoption document',
null,
'Your original document stamped or sealed in wet ink by the court, or signed by an official of the court or a judge',
'Your original document not stamped or sealed or signed by a court or an official of the court  <span>certification required</span>',
'A photocopy <span>certification required</span> of your *replaceme*  <span>certification required</span>',
'can be legalised',
'Document',
null,
'personal, identity, identification, ID, adoption, court, adopt',
'We accept the document in the following formats. Please confirm which one you will send:',
'A print out of your *replaceme* which has been produced as a PDF/electronic document. The document may contain an electronic/digital signature or seal <span>certification required</span>',
null,
null
);
