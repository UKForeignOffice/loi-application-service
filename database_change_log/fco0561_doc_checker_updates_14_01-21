-- Combine baptism certificate into religious document
DELETE FROM "AvailableDocuments" where doc_id = '200';

UPDATE "AvailableDocuments" SET doc_title_mid = 'UK religious document' WHERE doc_id = '253';

UPDATE "AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please confirm which one you will send:' WHERE doc_id = '253';

UPDATE "AvailableDocuments" SET eligible_check_option_3 = 'A printout of your electronic religious certificate produced from the original PDF or other electronic document <span>certification required</span>' WHERE doc_id = '253';

UPDATE "AvailableDocuments" SET synonyms = 'Personal, identity, ID, religious, birth, identification, baptism, Islamic divorce' WHERE doc_id = '253';

------- Birth Certificate
UPDATE "AvailableDocuments" SET doc_title_start = 'Birth Certificate (UK)' WHERE doc_id = '201';

UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'Your original UK birth certificate or a certified copy from either the General Register Office (GRO) or local register office' WHERE doc_id = '201';

UPDATE "AvailableDocuments" SET synonyms = 'birth, birth certificate, born, personal, identity, id, identification' WHERE doc_id = '201';

UPDATE "AvailableDocuments" SET accept_text = 'We can only accept the document in the following format. Please confirm that you will send us:' WHERE doc_Id = '201';

------- Update Disclosure & Barring Service
UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'Your original Disclosure and Barring Service (DBS) document without a signature from an official of the issuing authority <span>certification required</span>' WHERE doc_id = '216';
UPDATE "AvailableDocuments" SET eligible_check_option_2 = NULL WHERE doc_id = '216';
UPDATE "AvailableDocuments" SET eligible_check_option_3 = NULL WHERE doc_id = '216';
UPDATE "AvailableDocuments" SET legalisation_clause = 'must be certified by a solicitor or notary public in the UK'
UPDATE "AvailableDocuments" SET accept_text = 'We can only accept the *replaceme* in the following format. Please confirm that you will send us:' WHERE doc_Id = '216';

------- Death Certificate
UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'An original *replaceme* signed by a registrar, or a certified copy issued by the General Register Office (GRO) or local register office' WHERE doc_id = '218';

------- Coroner's Report
UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'Your original coroner’s report signed with a wet ink signature of the named coroner' WHERE doc_id = '211';
UPDATE "AvailableDocuments" SET eligible_check_option_2 = 'Your original coroner’s report signed with a printed or electronic signature of the named coroner <span>certification required</span>' WHERE doc_id = '211';
UPDATE "AvailableDocuments" SET eligible_check_option_3 = 'A photocopy of your coroner’s report <span>certification required</span>' WHERE doc_id = '211';
UPDATE "AvailableDocuments" SET eligible_check_option_4 = 'A printout of your electronic coroner’s report produced from the original PDF or other electronic document <span>certification required</span>' WHERE doc_id = '211';

UPDATE "AvailableDocuments" SET synonyms = 'medical, death, coroner, coroners report, coroners certificate' WHERE doc_id = '211';

------- Certificate of Naturalisation
UPDATE "AvailableDocuments" SET synonyms = 'identity, personal, naturalisation, home office, certificate of naturalisation' WHERE doc_id = '205';

------- Letter of No Trace
UPDATE "AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please confirm which one you will send:' WHERE doc_id = '242';

UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'Original letter of no trace signed by an official of the GRO' WHERE doc_id = '242';
UPDATE "AvailableDocuments" SET eligible_check_option_2 = NULL WHERE doc_id = '242';

UPDATE "AvailableDocuments" SET synonyms = 'marriage, legal, letter of no trace,' WHERE doc_id = '242';

UPDATE "AvailableDocuments" SET accept_text = 'We can only accept the document in the following format. Please confirm that you will send us:' WHERE doc_Id = '242';

------- Cremation
UPDATE "AvailableDocuments" SET eligible_check_option_3 = 'A photocopy of your cremation certificate <span>certification required</span>' WHERE doc_id = '215';
UPDATE "AvailableDocuments" SET eligible_check_option_4 = 'A printout of your electronic cremation certificate produced from the original PDF or other electronic document <span>certification required</span>' WHERE doc_id = '215';

UPDATE "AvailableDocuments" SET synonyms = 'death, personal, cremation, crematorium, cremation certificate' WHERE doc_id = '215';

------- Marriage Certificate, UK, not issued by the GRO
UPDATE "AvailableDocuments" SET doc_title = 'UK Marriage Certificate Issued By A Place Of Worship' WHERE doc_id = '244';
UPDATE "AvailableDocuments" SET doc_title_start = 'UK Marriage Certificate Issued By A Place Of Worship' WHERE doc_id = '244';

UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'Your original certificate issued on official watermarked paper, signed with an original wet ink signature of the Rector, Vicar, Curate, Authorised Person for Marriages, Secretary for Marriages, Registering officer for the Society of Friends etc.' WHERE doc_id = '244';
UPDATE "AvailableDocuments" SET eligible_check_option_2 = 'Your original Islamic marriage certificate <span>certification required</span>' WHERE doc_id = '244';
UPDATE "AvailableDocuments" SET eligible_check_option_3 = 'A photocopy of your Islamic marriage certificate <span>certification required</span>' WHERE doc_id = '244';
UPDATE "AvailableDocuments" SET eligible_check_option_4 = 'Your original Greek Orthodox marriage certificate <span>certification required</span>' WHERE doc_id = '244';
UPDATE "AvailableDocuments" SET eligible_check_option_5 = 'A photocopy of your Greek Orthodox marriage certificate <span>certification required</span>' WHERE doc_id = '244';

UPDATE "AvailableDocuments" SET synonyms = 'marriage, personal, identity, Id, identification, marriage certificate, GRO, general register office, church, Islamic marriage, Islamic, Greek orthodox' WHERE doc_id = '244';

------- UK Marriage Certificate
UPDATE "AvailableDocuments" SET doc_title = 'UK Marriage Certificate' WHERE doc_id = '243';
UPDATE "AvailableDocuments" SET doc_title_start = 'UK Marriage Certificate' WHERE doc_id = '243';

UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'Original General Register Office (GRO) marriage certificate issued by a registrar or a certified copy issued by the GRO or register office' WHERE doc_id = '243';
UPDATE "AvailableDocuments" SET eligible_check_option_2 = NULL WHERE doc_id = '243';
UPDATE "AvailableDocuments" SET eligible_check_option_3 = NULL WHERE doc_id = '243';

UPDATE "AvailableDocuments" SET synonyms = 'marriage, personal, identity, Id, identification, marriage certificate, GRO, general register office' WHERE doc_id = '243';

UPDATE "AvailableDocuments" SET accept_text = 'We can only accept the document in the following format. Please confirm that you will send us:' WHERE doc_Id = '243';

------- Combine Civil Partnership and Conversion of Civil Partnership
DELETE FROM "AvailableDocuments" where doc_id = '210';

UPDATE "AvailableDocuments" SET doc_title = 'Civil Partnership and Conversion of Civil Partnership Certificate' WHERE doc_Id = '208';
UPDATE "AvailableDocuments" SET doc_title_start = 'Civil Partnership and Conversion of Civil Partnership Certificate' WHERE doc_Id = '208';
UPDATE "AvailableDocuments" SET doc_title_mid = 'civil partnership or conversion of civil partnership certificate' WHERE doc_Id = '208';

UPDATE "AvailableDocuments" SET accept_text = 'We can only accept the document in the following formats. Please confirm that you will send us:' WHERE doc_Id = '208';

UPDATE "AvailableDocuments" SET eligible_check_option_1 = 'An original conversion of Civil Partnership to marriage certificate signed by a registrar or a certified copy issued by the General Register Office (GRO) or register office' WHERE doc_Id = '208';
UPDATE "AvailableDocuments" SET eligible_check_option_2 = 'An original civil partnership certificate signed by a registrar or a certified copy issued by the General Register Office (GRO) or register office' WHERE doc_Id = '208';

UPDATE "AvailableDocuments" SET synonyms = 'marriage, personal, civil partnership, wedding, conversion of civil partnership' WHERE doc_Id = '208';
