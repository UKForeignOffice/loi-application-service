--Change of Name Deed changes
--change synonymns for Change of name deed
UPDATE "AvailableDocuments" SET synonymns = 'change of name, change of name deed, personal, identity, ID, identification' WHERE doc_id = '207';

--add new 5th eligibility checker option
ALTER TABLE "AvailableDocuments"
ADD COLUMN eligible_check_option_5 text;

--add new 6th eligibility checker option
ALTER TABLE "AvailableDocuments"
ADD COLUMN eligible_check_option_6 text;


--update first point
UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'Original *replaceme* signed, certified and dated by a UK solicitor or notary public' WHERE doc_id = '207';

--update 2nd point
UPDATE "AvailableDocuments" SET eligible_check_option_2 = 'Original *replaceme* produced by a council or court, signed with an original wet ink signature by a council or court official.' WHERE doc_id = '207';

--update 3rd point
UPDATE "AvailableDocuments" SET eligible_check_option_3 = 'Original *replaceme* not signed, certified and dated by a UK solicitor or notary public' WHERE doc_id = '207';

--update 4th point
UPDATE "AvailableDocuments" SET eligible_check_option_4 = 'Original *replaceme* produced by a council or court not signed by a council or court official' WHERE doc_id = '207';

--update 5th point
UPDATE "AvailableDocuments" SET eligible_check_option_5 = 'Photocopy of your *replaceme*' WHERE doc_id = '207';

--update 6th point
UPDATE "AvailableDocuments" SET eligible_check_option_6 = 'A print out of your *replaceme* which has been produced as a PDF/electronic document. The document may contain an electronic/digital signature or seal.' WHERE doc_id = '207';




--update Change of No Impediment
UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'An original *replaceme* signed by the named registrar or duplicate produced by the register office signed by the named registrar' where doc_id = '206'
