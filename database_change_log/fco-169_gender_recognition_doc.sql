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
    '262',
null,
null,
'gender_recognition_certificate',
null,
null,
'true',
'true',
'true',
'2,3,4',
'Gender Recognition Certificate',
'Gender recognition certificate',
'gender recognition certificate',
null,
'Your original certificate which has been signed with the original wet ink signature of an official from the Gender Recognition Panel',
'Your original certificate which bears the original wet ink or embossed seal of the Gender Recognition Panel',
'Your original certificate which has been signed, certified and dated in the UK by either a UK practising solicitor or notary public',
'can be legalised',
'Document',
null,
'Gender, identity, ID, personal, Gender Recognition, Gender Panel, Recognition Panel, Gender Recognition Panel',
'We accept the document in the following format. Please confirm which one you will send:',
'A print out of your *replaceme* which has been produced as a PDF/electronic document. The document may contain an electronic/digital signature or seal',
null,
null
);
