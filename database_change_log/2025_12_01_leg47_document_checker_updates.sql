-- ADD EDUCATIONAL SYNONYMS
UPDATE public."AvailableDocuments" SET synonyms = 'ACCA,ACCA certificate,Education,Certificate,educational' WHERE html_id = 'acca-certificate';
UPDATE public."AvailableDocuments" SET synonyms = 'education,school document,educational' WHERE html_id = 'school-document';

-- DELETE UK MARRIAGE CERTIFICATE ISSUED BY A PLACE OF WORSHIP
DELETE FROM public."AvailableDocuments" WHERE html_id = 'marriage-certificate-other';

-- AMEND DOCUMENT TITLE FOR DECREE ABSOLUTE
UPDATE public."AvailableDocuments"
SET doc_title = 'Final Order (Decree Absolute)',
    doc_title_start = 'Final order (decree absolute)',
    doc_title_mid = 'final order (decree absolute)'
WHERE html_id = 'decree-absolute';

-- AMEND DOCUMENT TITLE FOR DECREE NISI
UPDATE public."AvailableDocuments"
SET doc_title = 'Conditional Order (Decree Nisi)',
    doc_title_start = 'Conditional order (decree nisi)',
    doc_title_mid = 'conditional order (decree nisi)'
WHERE html_id = 'decree-nisi';

-- AMEND DOCUMENT TITLE FOR UK MARRIAGE CERTIFICATE
UPDATE public."AvailableDocuments"
SET doc_title = 'Marriage Certificate (UK)',
    doc_title_start = 'Marriage certificate (UK)',
    doc_title_mid = 'marriage certificate (UK)'
WHERE html_id = 'marriage-certificate-gro';

-- ACCEPT TEXT UPDATE
UPDATE public."AvailableDocuments"
SET accept_text = 'Please select the format of your document:'
WHERE html_id IN ('acca-certificate', 'access-ni-document', 'acro-police-certificate', 'adoption_document', 'affidavit',
                  'articles-of-association', 'bank-statement', 'baptismal-certificate', 'birth-certificate',
                  'certificate-of-freesale', 'certificate-of-incorporation', 'certificate-of-memorandum', 'certificate-of-naturalisation',
                  'certificate-of-no-impediment', 'change-of-name-deed', 'child-travel-consent-form', 'civil-partnership-certificate',
                  'companies-house-document', 'decree-nisi', 'coroners-report', 'county-court-document', 'court-document',
                  'court-of-bancruptcy-document', 'cremation-certificate', 'criminal-records-check', 'death-certificate',
                  'department-for-business-and-trade-document', 'disclosure-and-barring-service-dbs-document', 'disclosure-scotland-document',
                  'doctors-medical', 'export-certificate', 'family-division-of-the-high-court-of-justice-document', 'decree-absolute', 'fingerprints-document',
                  'fit-note', 'gender-recognition-certificate', 'government-issued-document', 'grant-of-probate', 'high-court-of-justice-document',
                  'hm-revenue-and-customs-document', 'home-office-document', 'lasting-power-of-attorney', 'last-will-and-testament', 'letter-from-an-employer',
                  'letter-of-enrolment', 'letter-of-invitation', 'letter-of-no-trace', 'marriage-certificate-gro', 'medical-report', 'medical-test-results',
                  'national-archives-document', 'Pet-export-document-from-defra', 'power-of-attorney', 'reference-from-an-employer', 'religious-document',
                  'school-document', 'sheriff-court-document', 'statutory-declaration', 'subject-access-request-letter', 'translation', 'uk-crown-dependency-document',
                  'uk-overseas-territory-document', 'utility-bill', 'v5c-document', 'vet-document');

-- ACCEPT TEXT UPDATE - DRIVING LICENSE (UK) / PASSPORT
UPDATE public."AvailableDocuments"
SET accept_text = 'Please select the format of your document'
WHERE html_id = 'driving-license';

UPDATE public."AvailableDocuments"
SET accept_text = 'We can only legalise a certified copy of your passport. The copy must include the page which displays your digital or ink signature. We cannot legalise the original document. Please select the format of your document:'
WHERE html_id = 'passport';

-- BIRTH CERTIFICATE (UK) - ADDITIONAL INFORMATION
UPDATE public."AvailableDocuments"
SET eligible_check_option_1 = 'Your original UK birth certificate or a certified copy issued by one of the following:<li>General Register Office (GRO)</li><li>Local Register Office</li><li>National Records of Scotland (NRS)</li><li>General Register Office Northern Ireland (GRONI)</li><li>Overseas Registration Unit in the UK</li><li>British Embassy, Consulate, High Commission or Military Base, signed by a registration officer</li><span>wet ink</span>'
WHERE html_id = 'birth-certificate';


-- CERTIFICATE OF NATURALISATION/REGISTRATION - AMEND WORDING AND EXTRA BULLET POINT
UPDATE public."AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed/sealed by a Home Office official<span>wet ink</span>',
    issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority'
WHERE html_id = 'certificate-of-naturalisation';

UPDATE public."AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed and sealed by a Home Office official<span>certification required</span>'
WHERE html_id = 'certificate-of-naturalisation';

UPDATE public."AvailableDocuments"
SET eligible_check_option_3 = 'A photocopy or printout of your certificate of naturalisation/registration<span>certification required</span>'
WHERE html_id = 'certificate-of-naturalisation';


-- CERTIFICATE OF NO IMPEDIMENT - AMEND WORDING
UPDATE public."AvailableDocuments"
SET eligible_check_option_1 = 'An original certificate of no impediment issued by a local government register office and signed by the named registrar<span>wet ink</span>'
WHERE html_id = 'certificate-of-no-impediment';

-- COURT DOCUMENTS - AMEND WORDING
UPDATE public."AvailableDocuments"
SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed with wet ink by a court or court official<span>certification required</span>'
WHERE html_id IN ('decree-nisi', 'county-court-document', 'court-of-bancruptcy-document', 'court-document', 'family-division-of-the-high-court-of-justice-document',
                  'decree-absolute', 'grant-of-probate', 'high-court-of-justice-document', 'sheriff-court-document');

-- DEATH CERTIFICATE - EXTRA BULLET POINT
UPDATE public."AvailableDocuments"
SET eligible_check_option_1 = 'An original death certificate signed by a registrar, or a certified copy issued by one of the following:<li>General Register Office (GRO)</li><li>Local Register Office</li><li>National Records of Scotland (NRS)</li><li>General Register Office Northern Ireland (GRONI)</li><li>Overseas Registration Unit in the UK</li><li>British Embassy, Consulate, High Commission or Military Base, signed by a registration officer</li><span>wet ink</span>'
WHERE html_id = 'death-certificate';

-- GRANT OF PROBATE - AMEND WORDING
UPDATE public."AvailableDocuments"
SET eligible_check_option_1 = 'Your original court document, stamped or sealed by the court, or signed with wet ink by a court, or court official',
    eligible_check_option_2 = 'Your original court document not stamped, sealed, or signed with wet ink by a court, or court official<span>certification required</span>'
WHERE html_id = 'grant-of-probate';

-- MARRIAGE CERTIFICATE (UK) - AMEND WORDING
UPDATE public."AvailableDocuments"
SET eligible_check_option_1 = 'An original marriage certificate signed by a registrar, or a certified copy issued by one of the following: <li>General Register Office (GRO)</li><li>Local Register Office</li><li>National Records of Scotland (NRS)</li><li>General Register Office Northern Ireland (GRONI)</li><li>British Embassy, Consulate, High Commission or Military Base, signed by a registration officer</li><div class="govuk-inset-text">We are unable to legalise photocopies or DRAFT certificates</div><span>wet ink</span>'
WHERE html_id = 'marriage-certificate-gro';

-- GENERAL REGISTER OFFICE / GENDER RECOGNITION CERTIFICATE - UPDATE ISSUING AUTHORITY TEXT
UPDATE public."AvailableDocuments"
SET issuing_authority_text = 'Your original [document] must contain a wet ink signature or a seal from the issuing authority.<br><br>General Register Office documents must be dated outside the bold box. If the certificate is signed by an official, the signature must appear outside the bold box.'
WHERE html_id IN ('adoption_document', 'birth-certificate', 'civil-partnership-certificate', 'death-certificate', 'grant-of-probate', 'marriage-certificate-gro',
                    'gender-recognition-certificate');

-- NATIONAL ARCHIVES DOCUMENT - AMEND WORDING
UPDATE public."AvailableDocuments"
SET eligible_check_option_2 = 'Your original National Archives document, not stamped, sealed or signed by the National Archives<span>certification required</span>'
WHERE html_id = 'national-archives-document';

-- GRANT OF PROBATE - PULL THROUGH TO CORRECT PAGE
UPDATE public."AvailableDocuments"
SET eligible_check_option_1 = 'Your original court document, stamped or sealed by the court, or signed with wet ink by a court, or court official<span>wet ink</span>'
WHERE html_id = 'grant-of-probate';

-- UK CROWN DEPENDENCY AND UK OVERSEAS TERRITORY DOCUMENTS - GO TO 'CONFIRM YOUR DOC MEETS OUR REQUIREMENTS' PAGE, ENSURING ORIGINAL TEXT IS SHOWN
UPDATE public."AvailableDocuments"
SET eligible_check_option_1 = 'Your original UK Crown Dependency document legalised by the authorities in the state of issuance<span>wet ink</span><span>custom text</span>'
WHERE html_id = 'uk-crown-dependency-document';

UPDATE public."AvailableDocuments"
SET eligible_check_option_1 = 'Your original UK Overseas Territory document legalised by the authorities in the state of issuance<span>wet ink</span><span>custom text</span>'
WHERE html_id = 'uk-overseas-territory-document';

UPDATE public."AvailableDocuments"
SET issuing_authority_text = '<p>Please find below a list of UK Crown Dependencies.</p>
<ul><li>Bailiwick of Guernsey</li><li>Bailiwick of Jersey</li><li>Isle of Man</li></ul><p>Your document must first have been legalised by the relevant authority in the Crown Dependency.</p>'
WHERE html_id = 'uk-crown-dependency-document';

UPDATE public."AvailableDocuments"
SET issuing_authority_text = '<p>Please find below a list of UK Overseas Territories.</p><ul><li>Anguilla</li><li>Bermuda</li><li>British Antarctic Territory</li><li>British Virgin Islands</li><li>Cayman Islands</li><li>Falkland Islands</li><li>Gibraltar</li><li>Montserrat</li><li>Saint Helena</li><li>Turks and Caicos Islands</li></ul><p>Your document must first have been legalised by the relevant authority in the Overseas Territory.</p>'
WHERE html_id = 'uk-overseas-territory-document';

-- OTHER CHANGES REQUIRED FROM DOC CHECKER DOCUMENT
UPDATE public."AvailableDocuments"
SET accept_text = 'Please select the format of your document:'
WHERE html_id IN ('degree-certicate-uk', 'diploma', 'educational-certificate-uk', 'professional-qualification', 'tefl-or-tesol-document');

UPDATE public."AvailableDocuments"
SET inset_text = 'Courts do not issue documents with a wet ink stamp as standard. Please ensure your document meets our requirements before submitting them.'
WHERE html_id IN ('county-court-document', 'court-document', 'court-of-bancruptcy-document', 'decree-absolute', 'decree-nisi');
