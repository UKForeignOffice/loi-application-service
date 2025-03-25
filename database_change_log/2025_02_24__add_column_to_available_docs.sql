-- ADDING SYNONYMS FOR TOP SEARCHES FUNCTIONALITY
-- CIVIL RECORD
UPDATE public."AvailableDocuments" SET synonyms = 'personal, identity, identification, ID, adoption, court, adopt, civil record' WHERE html_id = 'adoption_document';
UPDATE public."AvailableDocuments" SET synonyms = 'birth, birth certificate, born, personal, identity, id, identification, civil record' WHERE html_id = 'birth-certificate';
UPDATE public."AvailableDocuments" SET synonyms = 'marriage,divorce,personal,certificate of no impediment,divorce document,civil record' WHERE html_id = 'certificate-of-no-impediment';
UPDATE public."AvailableDocuments" SET synonyms = 'marriage, personal, civil partnership, wedding, conversion of civil partnership, civil record' WHERE html_id = 'civil-partnership-certificate';
UPDATE public."AvailableDocuments" SET synonyms = 'death,death certificate,civil record' WHERE html_id = 'death-certificate';
UPDATE public."AvailableDocuments" SET synonyms = 'marriage, personal, identity, Id, identification, marriage certificate, GRO, general register office,civil record' WHERE html_id = 'marriage-certificate-gro';
UPDATE public."AvailableDocuments" SET synonyms = 'marriage, personal, identity, Id, identification, marriage certificate, GRO, general register office, church, Islamic marriage, Islamic, Greek orthodox, civil record' WHERE html_id = 'marriage-certificate-other';
-- COMPANIES HOUSE
UPDATE public."AvailableDocuments" SET synonyms = 'business,articles of association,companies house' WHERE html_id = 'articles-of-association';
UPDATE public."AvailableDocuments" SET synonyms = 'business,company,legal,certificate of incorporation,companies house' WHERE html_id = 'certificate-of-incorporation';
UPDATE public."AvailableDocuments" SET synonyms = 'business,company,legal,certificate of memorandum,companies house' WHERE html_id = 'certificate-of-memorandum';
UPDATE public."AvailableDocuments" SET synonyms = 'business,company,companies house' WHERE html_id = 'companies-house-document';
-- CRIMINAL RECORD
UPDATE public."AvailableDocuments" SET synonyms = 'Personal,Legal,Criminal,acro police certificate,criminal record' WHERE html_id = 'acro-police-certificate';
UPDATE public."AvailableDocuments" SET synonyms = 'legal,police,criminal records check,criminal record' WHERE html_id = 'criminal-records-check';
UPDATE public."AvailableDocuments" SET synonyms = 'legal,police,criminal records bureau document,criminal record' WHERE html_id = 'disclosure-and-barring-service-dbs-document';
UPDATE public."AvailableDocuments" SET synonyms = 'criminal,legal,disclosure scotland document,criminal record' WHERE html_id = 'disclosure-scotland-document';
-- COURT DOCUMENTS
UPDATE public."AvailableDocuments" SET synonyms = 'change of name, change of name deed, personal, identity, ID, identification,court documents' WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET synonyms = 'legal,county court documents' WHERE html_id = 'county-court-document';
UPDATE public."AvailableDocuments" SET synonyms = 'legal,court documents' WHERE html_id = 'court-document';
UPDATE public."AvailableDocuments" SET synonyms = 'legal,financial,business,finance,finances,court of bankruptcy document,court documents' WHERE html_id = 'court-of-bancruptcy-document';
UPDATE public."AvailableDocuments" SET synonyms = 'marriage,legal,decree absolute,divorce,court documents' WHERE html_id = 'decree-absolute';
UPDATE public."AvailableDocuments" SET synonyms = 'marriage,legal,decree nisi,divorce,court documents' WHERE html_id = 'decree-nisi';
UPDATE public."AvailableDocuments" SET synonyms = 'legal,family division of the high court of justice document,court documents' WHERE html_id = 'family-division-of-the-high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET synonyms = 'legal,death,personal,grant of probate,court documents' WHERE html_id = 'grant-of-probate';
UPDATE public."AvailableDocuments" SET synonyms = 'legal,high court of justice document,court documents' WHERE html_id = 'high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET synonyms = 'legal,sheriff court documents' WHERE html_id = 'sheriff-court-document';
-- MEDICAL DOCUMENTS
UPDATE public."AvailableDocuments" SET synonyms = 'medical,health,doctor''s letter,medical documents' WHERE html_id = 'doctors-medical';
UPDATE public."AvailableDocuments" SET synonyms = 'medical,health,fit note,medical documents' WHERE html_id = 'fit-note';
UPDATE public."AvailableDocuments" SET synonyms = 'medical,health,medical report,medical documents' WHERE html_id = 'medical-report';
UPDATE public."AvailableDocuments" SET synonyms = 'medical,health,medical test results,medical documents' WHERE html_id = 'medical-test-results';
UPDATE public."AvailableDocuments" SET synonyms = 'medical,health,sick note,medical documents' WHERE html_id = 'sick-note';
-- IDENTIFICATION DOCUMENTS
UPDATE public."AvailableDocuments" SET synonyms = 'personal,identification,id,identity,driving licence,identification documents' WHERE html_id = 'driving-license';
UPDATE public."AvailableDocuments" SET synonyms = 'personal,identity,id,identification,passport,identification documents' WHERE html_id = 'passport';
-- EDUCATIONAL
UPDATE public."AvailableDocuments" SET synonyms = 'education,qualifications,degree certificate or transcript,educational' WHERE html_id = 'degree-certificate-uk';
UPDATE public."AvailableDocuments" SET synonyms = 'education,qualifications,diploma,educational' WHERE html_id = 'diploma';
UPDATE public."AvailableDocuments" SET synonyms = 'education,qualifications,educational certificate,educational' WHERE html_id = 'educational-certificate-uk';
UPDATE public."AvailableDocuments" SET synonyms = 'education,qualifications,professional certificate,educational' WHERE html_id = 'professional-qualification';
UPDATE public."AvailableDocuments" SET synonyms = 'education,school document' WHERE html_id = 'school-document';

ALTER TABLE public."AvailableDocuments" ADD COLUMN "issuing_authority_text" text;
ALTER TABLE public."AvailableDocuments" ADD COLUMN "inset_text" text;
-- ACCA CERTIFICATE
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'acca-certificate', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                7,
                                                'ACCA Certificate',
                                                'ACCA Certificate',
                                                'ACCA membership certificate',
                                                null,
                                                'Your original ACCA membership certificate without a signature from an official of the issuing authority<span>certification required</span>',
                                                null,
                                                null,
                                                'can be legalised',
                                                'Certificate',
                                                null,
                                                'ACCA,ACCA certificate,Education,Certificate',
                                                'We accept ACCA membership certificates in the following format. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                null,
                                                'We are unable to legalise photocopies or PDF printouts of ACCA membership certificates. Qualification certificates are acceptable as photocopies or PDF printouts.');

-- ACCESS NI DOCUMENT
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'access-ni-document', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                9,
                                                'Access NI Document',
                                                'Access NI Document',
                                                'Access NI document',
                                                null,
                                                'Your original criminal records check without a signature from an official of the issuing authority<span>certification required</span>',
                                                null,
                                                null,
                                                'can be legalised',
                                                'Document',
                                                null,
                                                'Access NI Document,criminal record',
                                                'We accept Access NI documents in the following format. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                null,
                                                'We are unable to legalise photocopies of this document');
-- BAPTISMAL CERTIFICATE
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'baptismal-certificate', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                5,
                                                'Baptismal Certificate',
                                                'Baptismal Certificate',
                                                'baptismal certificate',
                                                null,
                                                'Your original baptismal certificate<span>certification required</span>',
                                                'A photocopy or printout of your baptismal certificate<span>certification required</span>',
                                                null,
                                                'can be legalised',
                                                'Certificate',
                                                null,
                                                'baptismal,birth certificate,born,personal,identity,',
                                                'We accept the Baptismal Certificate in the following formats. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                null,
                                                null);
-- CHILD TRAVEL CONSENT FORM
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'child-travel-consent-form', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                9,
                                                'Child Travel Consent Form',
                                                'Child travel consent form',
                                                'child travel consent form',
                                                null,
                                                'Your original child travel consent form<span>certification required</span>',
                                                'A photocopy or printout of your child travel consent form<span>certification required</span>',
                                                null,
                                                'can be legalised',
                                                'Document',
                                                null,
                                                'child travel consent form,travel',
                                                'We will accept the document in the following formats. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                null,
                                                null);
-- DEPARTMENT FOR BUSINESS AND TRADE
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'department-for-business-and-trade-document', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                1,
                                                'Department for Business and Trade Document',
                                                'Department for Business and Trade Document',
                                                'Department for Business and Trade document',
                                                null,
                                                'Your original Department for Business and Trade document signed by an official of the issuing authority<span>wet ink</span>',
                                                'Your original Department for Business and Trade document not signed by an official of the issuing authority<span>certification required</span>',
                                                'A photocopy or printout of your Department for Business and Trade document<span>certification required</span>',
                                                'can be legalised',
                                                'Document',
                                                null,
                                                'department for business and trade document',
                                                'We accept the document in the following formats. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.',
                                                null);
-- GENDER RECOGNITION CERTIFICATE
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'gender-recognition-certificate', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                4,
                                                'Gender Recognition Certificate',
                                                'Gender Recognition certificate',
                                                'Gender Recognition certificate',
                                                null,
                                                'Your original certificate which has been signed with the original wet ink signature of an official from the Gender Recognition Panel<span>wet ink</span>',
                                                'Your original certificate which bears the original wet ink or embossed seal of the Gender Recognition Panel<span>wet ink</span>',
                                                'Your original certificate which has been certified in the UK by either a UK practising solicitor or notary public<span>certification required</span>',
                                                'can be legalised',
                                                'Certificate',
                                                null,
                                                'personal, identity, Id, identification, gender recognition certificate, civil record',
                                                'We accept the document in the following formats. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                'Your original [document] must contain a wet ink signature or a seal from the issuing authority.',
                                                'We are unable to legalise photocopies of this document.');
-- LASTING POWER OF ATTORNEY
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'lasting-power-of-attorney', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                2,
                                                'Lasting Power of Attorney',
                                                'Lasting power of attorney',
                                                'lasting power of attorney',
                                                null,
                                                'Your original registered lasting power of attorney<span>certification required</span><span>custom text</span><span>lasting power of attorney original</span>',
                                                'Photocopy or printout of your lasting power of attorney<span>certification required</span><span>custom text</span><span>lasting power of attorney copy</span>',
                                                null,
                                                'can be legalised',
                                                'Certificate',
                                                null,
                                                'lasting power of attorney, legal',
                                                'We accept the document in the following formats. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                'Your document must be registered with the Office of the Public Guardian. In England and Wales, it will bear the original embossed validation “VALIDATED-OPG” at the bottom of every page.',
                                                null);
-- SUBJECT ACCESS REQUEST LETTER
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'subject-access-request-letter', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                3,
                                                'Subject Access Request Letter',
                                                'Subject Access Request Letter',
                                                'subject access request letter',
                                                null,
                                                'Your original subject access request letter signed by an official of the issuing authority<span>wet ink</span>',
                                                'Your original subject access request letter not signed by an official of the issuing authority<span>certification required</span>',
                                                'A photocopy or printout of your electronic subject access request letter document<span>certification required</span>',
                                                'can be legalised',
                                                'Document',
                                                null,
                                                'subject access request letter,legal,criminal record',
                                                'We accept the subject access request letter in the following formats. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.',
                                                null);
-- TEFL OR TESOL DOCUMENT
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'tefl-or-tesol-document', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                6,
                                                'TEFL or TESOL document',
                                                'TEFL or TESOL document',
                                                'TEFL or TESOL document',
                                                null,
                                                'Your original TEFL or TESOL document<span>certification required</span>',
                                                'A photocopy or printout of your TEFL or TESOL document<span>certification required</span>',
                                                null,
                                                'can be legalised if it is a <a href="https://www.gov.uk/find-a-regulated-qualification">regulated qualification</a> or if it has been awarded by a <a href="https://www.gov.uk/check-university-award-degree">recognised body</a>',
                                                'Document',
                                                null,
                                                'tefl or tesol document,education',
                                                'We accept the document in the following formats. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                null,
                                                null);
-- V5C DOCUMENTS
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'v5c-document', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                4,
                                                'V5C Document',
                                                'V5C document',
                                                'V5C document',
                                                null,
                                                'Your original V5C document signed by a DVLA official<span>certification required</span>',
                                                'A photocopy or printout of your V5C document<span>certification required</span>',
                                                null,
                                                'can be legalised',
                                                'Document',
                                                null,
                                                'v5c document,identity,driving',
                                                'We accept the document in the following formats. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                null,
                                                null);
-- UK CROWN DEPENDENCY DOCUMENT
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'uk-crown-dependency-document', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                2,
                                                'UK Crown Dependency document',
                                                'UK Crown Dependency document',
                                                'UK Crown Dependency document',
                                                null,
                                                'Your original UK Crown Dependency document legalised by the authorities in the state of issuance<span>certification required</span><span>custom text</span>',
                                                null,
                                                null,
                                                'can be legalised',
                                                'Document',
                                                null,
                                                'uk crown depedency document,legal',
                                                'We accept the document in the following format. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                null,
                                                'The Apostille Convention extends to Crown Dependencies, meaning each Crown Dependency can issue their own Apostilles. If the document is intended for a country which is party to the Apostille Convention, and bears an Apostille from the relevant Crown Dependency, it should not require further legalisation by the Legalisation Office in order to be accepted by foreign authorities.');
-- UK OVERSEAS TERRITORY DOCUMENT
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'uk-overseas-territory-document', --updated_at
                                                null,
                                                null,
                                                true,
                                                false,
                                                true,
                                                2,
                                                'UK Overseas Territory document',
                                                'UK Overseas Territory document',
                                                'UK Overseas Territory document',
                                                null,
                                                'Your original UK Overseas Territory document legalised by the authorities in the state of issuance<span>certification required</span><span>custom text</span>',
                                                null,
                                                null,
                                                'can be legalised',
                                                'Document',
                                                null,
                                                'uk overseas territory document,legal',
                                                'We accept the document in the following format. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                null,
                                                'The Apostille Convention extends to Overseas Territories, meaning each Overseas Territory can issue their own Apostilles. If the document is intended for a country which is party to the Apostille Convention, and bears an Apostille from the relevant Overseas Territory, it should not require further legalisation by the Legalisation Office in order to be accepted by foreign authorities.');

--ACRO POLICE
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of the issuing authority.<span>wet ink</span>' WHERE html_id = 'acro-police-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = null WHERE html_id = 'acro-police-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'acro-police-certificate';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature and date from the issuing authority.' WHERE html_id = 'acro-police-certificate';
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'acro-police-certificate';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the *replaceme* in the following format. Please select which one you will send:' WHERE html_id = 'acro-police-certificate';
UPDATE public."AvailableDocuments" SET inset_text = 'We are unable to legalise photocopies of this document' WHERE html_id = 'acro-police-certificate';
--ADOPTION DOCUMENT
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the *replaceme* in the following formats. Please select which one you will send:' WHERE html_id = 'adoption_document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original UK adoption certificate or certified copy from either the General Register Office (GRO) or local register office<div class="govuk-inset-text">We are unable to legalise photocopies of this document</div><span>wet ink</span>' WHERE html_id = 'adoption_document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original document stamped or sealed in wet ink by the court, or signed by an official of the court or a judge <span>wet ink</span><span>additional wet ink text</span>' WHERE html_id = 'adoption_document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'Your original document not stamped, sealed or signed by a court or an official of the court<span>certification required</span>' WHERE html_id = 'adoption_document';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = 'A photocopy or printout<span>certification required</span> of your *replaceme*<span>certification required</span>' WHERE html_id = 'adoption_document';
UPDATE public."AvailableDocuments" SET eligible_check_option_5 = null WHERE html_id = 'adoption_document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature or a seal from the issuing authority.' WHERE html_id = 'adoption_document';
--AFFIDAVIT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'affidavit';
UPDATE public."AvailableDocuments" SET accept_text = 'We will accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'affidavit';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original affidavit signed by a UK solicitor or notary<span>certification required</span>' WHERE html_id = 'affidavit';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your affidavit<span>certification required</span>' WHERE html_id = 'affidavit';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'affidavit';
-- ARTICLES OF ASSOCIATION
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'articles-of-association';
UPDATE public."AvailableDocuments" SET accept_text = 'We will accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'articles-of-association';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'articles-of-association';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your articles of association<span>certification required</span>' WHERE html_id = 'articles-of-association';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of Companies House<span>wet ink</span>' WHERE html_id = 'articles-of-association';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your [document] must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'articles-of-association';
-- BANK STATEMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'bank-statement';
UPDATE public."AvailableDocuments" SET accept_text = 'We will accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'bank-statement';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your bank statement<span>certification required</span>' WHERE html_id = 'bank-statement';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'bank-statement';
UPDATE public."AvailableDocuments" SET inset_text = 'Please ensure all pages are submitted for legalisation. Submissions with missing pages may be rejected.' WHERE html_id = 'bank-statement';
-- BIRTH CERTIFICATE
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'birth-certificate';
UPDATE public."AvailableDocuments" SET accept_text = 'We can only accept the document in the following format. Please confirm that you will send us:' WHERE html_id = 'birth-certificate';
UPDATE public."AvailableDocuments" SET inset_text = 'We are unable to legalise photocopies or DRAFT certificates.' WHERE html_id = 'birth-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original UK birth certificate or a certified copy issued by one of the following:<li>General Register Office (GRO)</li><li>Local Register Office</li><li>National Records of Scotland (NRS)</li><li>General Register Office Northern Ireland (GRONI)</li><li>Overseas Registration Unit in the UK</li><span>wet ink</span>' WHERE html_id = 'birth-certificate';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature or a seal from the issuing authority.' WHERE html_id = 'birth-certificate';
UPDATE public."AvailableDocuments" SET doc_title_mid = 'birth certificate' WHERE html_id = 'birth-certificate';
-- CERTIFICATE OF FREE SALE
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'certificate-of-freesale';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'certificate-of-freesale';
UPDATE public."AvailableDocuments" SET inset_text = 'Your certificate of free sale should include a “Signature valid” tick. Documents containing “Signature not valid/Validity unknown” will not be accepted.' WHERE html_id = 'certificate-of-freesale';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original certificate of free sale signed by an official of the issuing authority<span>wet ink</span>' WHERE html_id = 'certificate-of-freesale';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original certificate of free sale not signed by an official of the issuing authority<span>certification required</span>' WHERE html_id = 'certificate-of-freesale';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your certificate of free sale<span>certification required</span>' WHERE html_id = 'certificate-of-freesale';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'certificate-of-freesale';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'certificate-of-freesale';
-- CERTIFICATE OF INCORPORATION
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'certificate-of-incorporation';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'certificate-of-incorporation';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original certificate of memorandum signed by an official of Companies House<span>wet ink</span>' WHERE html_id = 'certificate-of-incorporation';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your certificate of incorporation<span>certification required</span>' WHERE html_id = 'certificate-of-incorporation';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'certificate-of-incorporation';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'certificate-of-incorporation';
-- CERTIFICATE OF MEMORANDUM
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'certificate-of-memorandum';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'certificate-of-memorandum';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'A photocopy or printout of your certificate of memorandum<span>wet ink</span>' WHERE html_id = 'certificate-of-memorandum';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your certificate of memorandum<span>certification required</span>' WHERE html_id = 'certificate-of-memorandum';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'certificate-of-memorandum';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'certificate-of-memorandum';
-- CERTIFICATE OF NATURALISATION/REGISTRATION
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'certificate-of-naturalisation';
UPDATE public."AvailableDocuments" SET doc_title = 'Certificate of Naturalisation/Registration' WHERE html_id = 'certificate-of-naturalisation';
UPDATE public."AvailableDocuments" SET doc_title_start = 'Certificate of naturalisation/registration' WHERE html_id = 'certificate-of-naturalisation';
UPDATE public."AvailableDocuments" SET doc_title_mid = 'certificate of naturalisation/registration' WHERE html_id = 'certificate-of-naturalisation';
UPDATE public."AvailableDocuments" SET accept_text = 'We will accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'certificate-of-naturalisation';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your certificate of naturalisation/registration<span>certification required</span>' WHERE html_id = 'certificate-of-naturalisation';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'certificate-of-naturalisation';
-- CERTIFICATE OF NO IMPEDIMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'certificate-of-no-impediment';
UPDATE public."AvailableDocuments" SET accept_text = 'We can only accept the document in the following format. Please select that you will send us:' WHERE html_id = 'certificate-of-no-impediment';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'An original certificate of no impediment signed by the named registrar<span>wet ink</span>' WHERE html_id = 'certificate-of-no-impediment';
UPDATE public."AvailableDocuments" SET inset_text = 'We are unable to legalise photocopies or DRAFT certificates.' WHERE html_id = 'certificate-of-no-impediment';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature and date from the issuing authority.' WHERE html_id = 'certificate-of-no-impediment';
-- CHANGE OF NAME DEED
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET accept_text = 'We will accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'An original change of name deed signed by a UK solicitor or notary public<span>certification required</span>' WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'An original change of name deed not signed by a UK solicitor<span>certification required</span>' WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your change of name deed<span>certification required</span>' WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET eligible_check_option_5 = null WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET eligible_check_option_6 = null WHERE html_id = 'change-of-name-deed';
-- CHILD TRAVEL CONSENT FORM
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET accept_text = 'We will accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'An original change of name deed signed by a UK solicitor or notary public<span>certification required</span>' WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'An original change of name deed not signed by a UK solicitor<span>certification required</span>' WHERE html_id = 'change-of-name-deed';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your change of name deed<span>certification required</span>' WHERE html_id = 'change-of-name-deed';
-- CIVIL PARTNERSHIP AND CONVERSION OF CIVIL PARTNERSHIP CERTIFICATE
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'civil-partnership-certificate';
UPDATE public."AvailableDocuments" SET accept_text = 'We can only accept the document in the following format. Please confirm that you will send us:' WHERE html_id = 'civil-partnership-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'An original civil partnership certificate or original conversion of civil partnership to marriage certificate signed by a registrar or a certified copy issued by any of the following:<li>General Register Office (GRO)</li><li>Local Register Office</li><li>National Records of Scotland (NRS)</li><li>General Register Office Northern Ireland (GRONI)</li><span>wet ink</span>' WHERE html_id = 'civil-partnership-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = null WHERE html_id = 'civil-partnership-certificate';
UPDATE public."AvailableDocuments" SET inset_text = 'We are unable to legalise photocopies or DRAFT certificates.' WHERE html_id = 'civil-partnership-certificate';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature or a seal from the issuing authority.' WHERE html_id = 'civil-partnership-certificate';
-- COMPANIES HOUSE DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'companies-house-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'companies-house-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original Companies House document signed by an official of Companies House<span>wet ink</span>' WHERE html_id = 'companies-house-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your Companies House document<span>certification required</span>' WHERE html_id = 'companies-house-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'companies-house-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'companies-house-document';
-- CORONER'S REPORT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'coroners-report';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'coroners-report';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original coroner’s report signed with a wet ink signature of the named coroner<span>wet ink</span>' WHERE html_id = 'coroners-report';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your coroner''s report<span>certification required</span>' WHERE html_id = 'coroners-report';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'coroners-report';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'coroners-report';
-- COUNTY COURT DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'county-court-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'county-court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original court document stamped or sealed with wet ink by the court, or signed by an official of the court<span>wet ink</span>' WHERE html_id = 'county-court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court or court official<span>certification required</span>' WHERE html_id = 'county-court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your court document<span>certification required</span>' WHERE html_id = 'county-court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'county-court-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'county-court-document';
-- COURT OF BANKRUPTCY DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'court-of-bancruptcy-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'court-of-bancruptcy-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original court document stamped or sealed with wet ink by the court, or signed by an official of the court<span>wet ink</span>' WHERE html_id = 'court-of-bancruptcy-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court or court official<span>certification required</span>' WHERE html_id = 'court-of-bancruptcy-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your court document<span>certification required</span>' WHERE html_id = 'court-of-bancruptcy-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'court-of-bancruptcy-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'court-of-bancruptcy-document';
-- COURT DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'court-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'court-document';
UPDATE public."AvailableDocuments" SET doc_title_mid = 'Court document' WHERE html_id = 'court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original court document stamped or sealed with wet ink by the court, or signed by an official of the court<span>wet ink</span>' WHERE html_id = 'court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court or court official<span>certification required</span>' WHERE html_id = 'court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your court document<span>certification required</span>' WHERE html_id = 'court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'court-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'court-document';
-- CREMATION CERTIFICATE
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'cremation-certificate';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'cremation-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original document signed by an official of the local council where the cremation took place<span>wet ink</span>' WHERE html_id = 'cremation-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your cremation certificate<span>certification required</span>' WHERE html_id = 'cremation-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'cremation-certificate';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'cremation-certificate';
-- CRIMINAL RECORDS CHECK
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'criminal-records-check';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the criminal records check in the following formats. Please select which one you will send:' WHERE html_id = 'criminal-records-check';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original criminal records check signed by an official of the issuing authority<span>wet ink</span>' WHERE html_id = 'criminal-records-check';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'criminal-records-check';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature and date from the issuing authority.' WHERE html_id = 'criminal-records-check';
UPDATE public."AvailableDocuments" SET inset_text = 'We do not accept criminal record checks issued by private companies and we are unable to legalise photocopies of this document.' WHERE html_id = 'criminal-records-check';
-- DEATH CERTIFICATE
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'death-certificate';
UPDATE public."AvailableDocuments" SET accept_text = 'We can only accept the document in the following format. Please confirm that you will send us:' WHERE html_id = 'death-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'An original death certificate signed by a registrar, or a certified copy issued by one of the following:<li>General Register Office (GRO)</li><li>Local Register Office</li><li>National Records of Scotland (NRS)</li><li>General Register Office Northern Ireland (GRONI)</li><li>Overseas Registration Unit in the UK</li><span>wet ink</span>' WHERE html_id = 'death-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = null WHERE html_id = 'death-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'death-certificate';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature or a seal from the issuing authority.' WHERE html_id = 'death-certificate';
UPDATE public."AvailableDocuments" SET inset_text = 'We are unable to legalise photocopies or DRAFT certificates.' WHERE html_id = 'death-certificate';
-- DECREE ABSOLUTE
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'decree-absolute';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'decree-absolute';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original court document stamped or sealed with wet ink by the court, or signed by an official of the court<span>wet ink</span>' WHERE html_id = 'decree-absolute';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court or court official<span>certification required</span>' WHERE html_id = 'decree-absolute';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your court document<span>certification required</span>' WHERE html_id = 'decree-absolute';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'decree-absolute';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'decree-absolute';
-- DECREE NISI
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'decree-nisi';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'decree-nisi';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original court document stamped or sealed with wet ink by the court, or signed by an official of the court<span>wet ink</span>' WHERE html_id = 'decree-nisi';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court or court official<span>certification required</span>' WHERE html_id = 'decree-nisi';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your court document<span>certification required</span>' WHERE html_id = 'decree-nisi';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'decree-nisi';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'decree-nisi';
-- DEGREE CERTIFICATE OR TRANSCRIPT (UK)
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised if it has been awarded by a <a href="https://www.gov.uk/check-university-award-degree">recognised body</a>' WHERE html_id = 'degree-certificate-uk';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'degree-certificate-uk';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original degree certificate or transcript (UK)<span>certification required</span><span>custom text</span>' WHERE html_id = 'degree-certificate-uk';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your degree certificate or transcript (UK)<span>certification required</span>' WHERE html_id = 'degree-certificate-uk';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'degree-certificate-uk';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'degree-certificate-uk';
-- DIPLOMA
UPDATE public."AvailableDocuments" SET doc_title_mid = 'diploma certificate or transcript (UK)' WHERE html_id = 'diploma';
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised if it is a <a href="https://www.gov.uk/find-a-regulated-qualification">regulated qualification</a>' WHERE html_id = 'diploma';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'diploma';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original diploma<span>certification required</span><span>custom text</span>' WHERE html_id = 'diploma';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your diploma<span>certification required</span>' WHERE html_id = 'diploma';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'diploma';
-- DISCLOSURE AND BARRING SERVICE (DBS) DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'disclosure-and-barring-service-dbs-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We can only accept the Disclosure and Barring Service (DBS) document in the following format. Please select that you will send us:' WHERE html_id = 'disclosure-and-barring-service-dbs-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original Disclosure and Barring Service (DBS) document without a signature from an official of the issuing authority<span>certification required</span>' WHERE html_id = 'disclosure-and-barring-service-dbs-document';
UPDATE public."AvailableDocuments" SET inset_text = 'We are unable to legalise photocopies of this document.' WHERE html_id = 'disclosure-and-barring-service-dbs-document';
-- DISCLOSURE SCOTLAND DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'disclosure-scotland-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the Disclosure Scotland document in the following formats. Please select which one you will send:' WHERE html_id = 'disclosure-scotland-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original Disclosure Scotland document signed by an official of the issuing authority<span>wet ink</span>' WHERE html_id = 'disclosure-scotland-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original Disclosure Scotland document without a signature from an official of the issuing authority<span>certification required</span>' WHERE html_id = 'disclosure-scotland-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'disclosure-scotland-document';
UPDATE public."AvailableDocuments" SET inset_text = 'We are unable to legalise photocopies of this document.' WHERE html_id = 'disclosure-scotland-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature and date from the issuing authority.' WHERE html_id = 'disclosure-scotland-document';
-- DOCTOR'S LETTER
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'doctors-medical';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send.' WHERE html_id = 'doctors-medical';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original doctor''s letter signed by the named doctor. The doctor must be registered with the <a href="https://www.gmc-uk.org">General Medical Council</a><span>wet ink</span>' WHERE html_id = 'doctors-medical';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your doctor''s letter<span>certification required</span>' WHERE html_id = 'doctors-medical';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'doctors-medical';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'doctors-medical';
-- DRIVING LICENCE
UPDATE public."AvailableDocuments" SET accept_text = 'Please select that you''ll send us:' WHERE html_id = 'driving-license';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'A photocopy of your<span>certification required</span><span>custom text</span>' WHERE html_id = 'driving-license';
-- EDUCATION CERTIFICATE (UK)
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised if it is a <a href="https://www.gov.uk/find-a-regulated-qualification">regulated qualification</a> or if it has been awarded by a <a href="https://www.gov.uk/check-university-award-degree">recognised body</a>' WHERE html_id = 'educational-certificate-uk';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'educational-certificate-uk';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original education certificate (UK)<span>certification required</span><span>custom text</span>' WHERE html_id = 'educational-certificate-uk';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your education certificate (UK)<span>certification required</span>' WHERE html_id = 'educational-certificate-uk';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'educational-certificate-uk';
-- EXPORT CERTIFICATE
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'export-certificate';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send.' WHERE html_id = 'export-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original export certificate signed by an official of the issuing authority<span>wet ink</span>' WHERE html_id = 'export-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original export certificate signed by an official of the Chamber of Commerce<span>wet ink</span>' WHERE html_id = 'export-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'Your original export certificate not signed by an official of the issuing authority/Chamber of Commerce<span>certification required</span>' WHERE html_id = 'export-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = 'A photocopy or printout of your export certificate<span>certification required</span>' WHERE html_id = 'export-certificate';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'export-certificate';
-- FAMILY DIVISION OF THE HIGH COURT OF JUSTICE DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'family-division-of-the-high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original court document stamped or sealed with wet ink by the court, or signed by an official of the court<span>wet ink</span>' WHERE html_id = 'family-division-of-the-high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court or court official<span>certification required</span>' WHERE html_id = 'family-division-of-the-high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your court document<span>certification required</span>' WHERE html_id = 'family-division-of-the-high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'family-division-of-the-high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'family-division-of-the-high-court-of-justice-document';
-- FINGERPRINTS DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'fingerprints-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'fingerprints-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original document, issued by the police or signed by an official of the police authority<span>wet ink</span>' WHERE html_id = 'fingerprints-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original document, issued by a private institution<span>certification required</span>' WHERE html_id = 'fingerprints-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'fingerprints-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature and date from the issuing authority.' WHERE html_id = 'fingerprints-document';
UPDATE public."AvailableDocuments" SET inset_text = 'We are unable to legalise photocopies of this document.' WHERE html_id = 'fingerprints-document';
-- FIT NOTE
UPDATE public."AvailableDocuments" SET legalisation_clause = ', issued in the UK, can be legalised' WHERE html_id = 'fit-note';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'fit-note';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original fit note signed by the named and regulated medical practitioner. The medical practitioner must be registered with the relevant regulatory authority.<span>wet ink</span>' WHERE html_id = 'fit-note';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your fit note<span>certification required</span>' WHERE html_id = 'fit-note';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'fit-note';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'fit-note';
-- GOVERNMENT ISSUED DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'government-issued-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'government-issued-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original government issued document signed by an official from the issuing authority<span>wet ink</span>' WHERE html_id = 'government-issued-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your government issued document<span>certification required</span>' WHERE html_id = 'government-issued-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'government-issued-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'government-issued-document';
-- GRANT OF PROBATE
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'grant-of-probate';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'grant-of-probate';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original court document, stamped or sealed by the court, or signed by an official of the court<span>wet ink</span>' WHERE html_id = 'grant-of-probate';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your court document<span>certification required</span>' WHERE html_id = 'grant-of-probate';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'grant-of-probate';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature or a seal from the issuing authority.' WHERE html_id = 'grant-of-probate';
-- HIGH COURT OF JUSTICE DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original court document stamped or sealed with wet ink by the court, or signed by an official of the court<span>wet ink</span>' WHERE html_id = 'high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court or court official<span>certification required</span>' WHERE html_id = 'high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your court document<span>certification required</span>' WHERE html_id = 'high-court-of-justice-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'high-court-of-justice-document';
-- HMRC DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'hm-revenue-and-customs-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'hm-revenue-and-customs-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original HM Revenue and Customs (HMRC) document signed by an official of the issuing authority<span>wet ink</span>' WHERE html_id = 'hm-revenue-and-customs-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your HM Revenue and Customs (HMRC) document<span>certification required</span>' WHERE html_id = 'hm-revenue-and-customs-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'hm-revenue-and-customs-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'hm-revenue-and-customs-document';
-- HOME OFFICE (HO) DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'home-office-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'home-office-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original Home Office (HO) document signed/sealed by an official of the issuing authority<span>wet ink</span>' WHERE html_id = 'home-office-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original Home Office (HO) document not signed/sealed by an official of the issuing authority<span>certification required</span>' WHERE html_id = 'home-office-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your Home Office (HO) document<span>certification required</span>' WHERE html_id = 'home-office-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'home-office-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'home-office-document';
-- LAST WILL AND TESTAMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'last-will-and-testament';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'last-will-and-testament';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original last will and testament witnessed in the UK by a solicitor or notary public<span>certification required</span>' WHERE html_id = 'last-will-and-testament';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A copy of your last will and testament which has been deposited with the relevant court and containing a court official’s signature or seal<span>wet ink</span>' WHERE html_id = 'last-will-and-testament';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A copy or printout of your last will and testament certified in the UK by a solicitor or notary public<span>certification required</span>' WHERE html_id = 'last-will-and-testament';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'last-will-and-testament';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'last-will-and-testament';
-- LETTER FROM AN EMPLOYER
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'letter-from-an-employer';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'letter-from-an-employer';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original letter from an employer<span>certification required</span>' WHERE html_id = 'letter-from-an-employer';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your letter from an employer<span>certification required</span>' WHERE html_id = 'letter-from-an-employer';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'letter-from-an-employer';
-- LETTER OF ENROLMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'letter-of-enrolment';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'letter-of-enrolment';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original letter of enrolment<span>certification required</span>' WHERE html_id = 'letter-of-enrolment';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your letter of enrolment<span>certification required</span>' WHERE html_id = 'letter-of-enrolment';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'letter-of-enrolment';
-- LETTER OF INVITATION (TO LIVE IN THE UK)
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'letter-of-invitation';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'letter-of-invitation';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original letter of invitation (to live in UK)<span>certification required</span>' WHERE html_id = 'letter-of-invitation';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your letter of invitation (to live in UK)<span>certification required</span>' WHERE html_id = 'letter-of-invitation';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'letter-of-invitation';
-- LETTER OF NO TRACE
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'letter-of-no-trace';
UPDATE public."AvailableDocuments" SET accept_text = 'We can only accept the document in the following format. Please select that you will send us:' WHERE html_id = 'letter-of-no-trace';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Original letter of no trace signed by an official of the GRO<span>wet ink</span>' WHERE html_id = 'letter-of-no-trace';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature and date from the issuing authority.' WHERE html_id = 'letter-of-no-trace';
-- MARRIAGE CERTIFICATE
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'marriage-certificate-gro';
UPDATE public."AvailableDocuments" SET accept_text = 'We can only accept the document in the following formats. Please select that you will send us:' WHERE html_id = 'marriage-certificate-gro';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'An original marriage certificate signed by a registrar, or a certified copy issued by one of the following: <li> General Register Office (GRO)</li><li>Local Registry Office</li><li>National Records of Scotland (NRS)</li><li>General Register Office Northern Ireland (GRONI)</li> <div class="govuk-inset-text">We are unable to legalise photocopies or DRAFT certificates</div><span>wet ink</span>' WHERE html_id = 'marriage-certificate-gro';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original certificate issued on official watermarked paper, signed with an original <span>wet ink</span> signature of the Rector, Vicar, Curate, Authorised Person for Marriages, Secretary for Marriages, Registering Officer for the Society of Friends etc...<div class="govuk-inset-text">We are unable to legalise photocopies or DRAFT certificates</div>' WHERE html_id = 'marriage-certificate-gro';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'Your original Islamic marriage certificate/Greek Orthodox/Other marriage certificate<span>certification required</span>' WHERE html_id = 'marriage-certificate-gro';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = 'A photocopy of your Islamic marriage certificate/Greek Orthodox/Other marriage certificate<span>certification required</span>' WHERE html_id = 'marriage-certificate-gro';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature or a seal from the issuing authority.' WHERE html_id = 'marriage-certificate-gro';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'An original marriage certificate signed by a registrar, or a certified copy issued by one of the following: <li> General Register Office (GRO)</li><li>Local Registry Office</li><li>National Records of Scotland (NRS)</li><li>General Register Office Northern Ireland (GRONI)</li> <div class="govuk-inset-text">We are unable to legalise photocopies or DRAFT certificates</div><span>wet ink</span>' WHERE html_id = 'marriage-certificate-gro';
-- MARRIAGE CERTIFICATE ISSUED BY A PLACE OF WORSHIP
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original certificate issued on official watermarked paper, signed with an original wet ink signature of the Rector, Vicar, Curate, Authorised Person for Marriages, Secretary for Marriages, Registering officer for the Society of Friends etc.<span>wet ink</span>' WHERE html_id = 'marriage-certificate-other';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature or a seal from the issuing authority.' WHERE html_id = 'marriage-certificate-other';
-- MEDICAL REPORT
UPDATE public."AvailableDocuments" SET legalisation_clause = ', issued in the UK, can be legalised' WHERE html_id = 'medical-report';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'medical-report';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original medical report signed by the named and regulated medical practitioner. The medical practitioner must be registered with the relevant regulatory authority.<span>wet ink</span>' WHERE html_id = 'medical-report';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your medical report<span>certification required</span>' WHERE html_id = 'medical-report';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'medical-report';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'medical-report';
UPDATE public."AvailableDocuments" SET inset_text = 'If your medical practitioner is signing test results issued by an external laboratory, the practitioner must confirm the name of the patient to whom the results belong.' WHERE html_id = 'medical-report';
-- MEDICAL TEST RESULTS
UPDATE public."AvailableDocuments" SET legalisation_clause = ', issued in the UK, can be legalised' WHERE html_id = 'medical-test-results';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'medical-test-results';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original medical report signed by the named and regulated medical practitioner. The medical practitioner must be registered with the relevant regulatory authority.<span>wet ink</span>' WHERE html_id = 'medical-test-results';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your medical report<span>certification required</span>' WHERE html_id = 'medical-test-results';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'medical-test-results';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'medical-test-results';
UPDATE public."AvailableDocuments" SET inset_text = 'If your medical practitioner is signing test results issued by an external laboratory, the practitioner must confirm the name of the patient to whom the results belong.' WHERE html_id = 'medical-test-results';
-- PASSPORT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'passport';
UPDATE public."AvailableDocuments" SET accept_text = 'We can only legalise a certified copy of your passport. The copy must include the page which displays your digital or ink signature. We cannot legalise the original document. Please select that you will send us:' WHERE html_id = 'passport';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'A copy of your passport certified in the UK by a solicitor or notary public<span>certification required</span><span>custom text</span>' WHERE html_id = 'passport';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = null WHERE html_id = 'passport';
UPDATE public."AvailableDocuments" SET inset_text = 'Important Notice - Your passport must be signed by the holder unless it states the holder is not required to sign.' WHERE html_id = 'passport';
-- PET EXPORT DOCUMENT FROM DEFRA
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'Pet-export-document-from-defra';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'Pet-export-document-from-defra';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original pet export document signed by the named vet. The vet must be registered with <a href="https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs">DEFRA</a><span>wet ink</span>' WHERE html_id = 'Pet-export-document-from-defra';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your pet export document<span>certification required</span>' WHERE html_id = 'Pet-export-document-from-defra';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'Pet-export-document-from-defra';
UPDATE public."AvailableDocuments" SET inset_text = 'If you have a 48–72-hour limit pet export document, please contact UrgentLegalisation@fcdo.gov.uk' WHERE html_id = 'Pet-export-document-from-defra';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature and date from the issuing authority.' WHERE html_id = 'Pet-export-document-from-defra';
-- POWER OF ATTORNEY
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'power-of-attorney';
UPDATE public."AvailableDocuments" SET accept_text = 'We will accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'power-of-attorney';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'power-of-attorney';
UPDATE public."AvailableDocuments" SET inset_text = 'If a copy of a UK passport is included with this document, the passport must be signed by the holder.' WHERE html_id = 'power-of-attorney';
-- PROFESSIONAL QUALIFICATION CERTIFICATE
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised if it is a <a href="https://www.gov.uk/find-a-regulated-qualification">regulated qualification</a> or if it has been awarded by a <a href="https://www.gov.uk/check-university-award-degree">recognised body</a>' WHERE html_id = 'professional-qualification';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'professional-qualification';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original *replaceme*   <span>certification required</span><span>custom text</span>' WHERE html_id = 'professional-qualification';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your professional qualification certificate<span>certification required</span>' WHERE html_id = 'professional-qualification';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'professional-qualification';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature and date from the issuing authority.' WHERE html_id = 'professional-qualification';
-- REFERENCE FROM AN EMPLOYER
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'reference-from-an-employer';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'reference-from-an-employer';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your reference from an employer<span>certification required</span>' WHERE html_id = 'reference-from-an-employer';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'reference-from-an-employer';
-- RELIGIOUS DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'religious-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'religious-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your UK religious document<span>certification required</span>' WHERE html_id = 'religious-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'religious-document';
-- SCHOOL DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'school-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'school-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your school document<span>certification required</span>' WHERE html_id = 'school-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'school-document';
-- SHERIFF COURT DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'sheriff-court-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'sheriff-court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original court document stamped or sealed with wet ink by the court, or signed by an official of the court<span>wet ink</span>' WHERE html_id = 'sheriff-court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court or court official<span>certification required</span>' WHERE html_id = 'sheriff-court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = 'A photocopy or printout of your court document<span>certification required</span>' WHERE html_id = 'sheriff-court-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_4 = null WHERE html_id = 'sheriff-court-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.' WHERE html_id = 'sheriff-court-document';
-- STATUTORY DECLARATION
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'statutory-declaration';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'statutory-declaration';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your statutory declaration<span>certification required</span>' WHERE html_id = 'statutory-declaration';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'statutory-declaration';
-- TRANSLATION
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'translation';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'translation';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original translation<span>certification required</span><span>custom text</span>' WHERE html_id = 'translation';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your translation<span>certification required</span><span>custom text</span>' WHERE html_id = 'translation';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'translation';
UPDATE public."AvailableDocuments" SET inset_text = 'Important Notice - the translation must be carried out in the UK.' WHERE html_id = 'translation';
-- UTILITY BILL
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'utility-bill';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'utility-bill';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your utility bill<span>certification required</span>' WHERE html_id = 'utility-bill';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'utility-bill';
-- VETERINARY DOCUMENT
UPDATE public."AvailableDocuments" SET legalisation_clause = 'can be legalised' WHERE html_id = 'vet-document';
UPDATE public."AvailableDocuments" SET accept_text = 'We accept the document in the following formats. Please select which one you will send:' WHERE html_id = 'vet-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original veterinary document signed by a vet. The vet must be registered with the <a href="https://findavet.rcvs.org.uk/home/">RCVS</a><span>wet ink</span>' WHERE html_id = 'vet-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = 'A photocopy or printout of your veterinary document<span>certification required</span>' WHERE html_id = 'vet-document';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'vet-document';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature and date from the issuing authority.' WHERE html_id = 'vet-document';
UPDATE public."AvailableDocuments" SET inset_text = 'If you have a 48–72-hour limit pet export document, please contact UrgentLegalisation@fcdo.gov.uk' WHERE html_id = 'vet-document';

