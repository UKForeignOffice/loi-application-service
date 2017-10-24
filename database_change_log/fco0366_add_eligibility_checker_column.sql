
ALTER TABLE public."AvailableDocuments"
    ADD COLUMN eligible_check_option_4 text COLLATE pg_catalog."default";

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id IN (
'acro-police-certificate',
'affidavit',
'articles-of-association',
'bank-statement',
'baptism-certificate',
--'birth-certificate',
'certificate-of-freesale',
'certificate-of-incorporation',
'certificate-of-memorandum',
'certificate-of-naturalisation',
--'certificate-of-no-impediment',
'change-of-name-deed',
--'civil-partnership-certificate',
'companies-house-document',
--conversion-of-civil-partnership',
'coroners-report',
'county-court-document',
'court-document',
'court-of-bancruptcy-document',
'cremation-certificate',
'criminal-records-bureau-crb-document',
'criminal-records-check',
'death-certificate',
'decree-absolute',
'decree-nisi',
'degree-certificate-uk',
'department-of-business-innovation-and-skills-bis',
'department-of-health-document',
'diploma',
'disclosure-scotland-document',
'doctors-medical',
'driving-license',
'educational-certificate-uk',
'export-certificate',
'family-division-of-the-high-court-of-justice-document',
'fingerprints-document',
'fit-note',
'government-issued-document',
'grant-of-probate',
'high-court-of-justice-document',
'hm-revenue-and-customs-document',
'home-office-document',
'last-will-and-testament',
'letter-from-an-employer',
'letter-of-enrolment',
'letter-of-invitation',
'letter-of-no-trace',
--'marriage-certificate-gro',
'marriage-certificate-other',
'medical-report',
'medical-test-results',
'passport',
'Pet-export-document-from-defra',
'police-disclosure-document',
'power-of-attorney',
'professional-qualification',
'reference-from-an-employer',
'religious-document',
'school-document',
'sheriff-court-document',
'sick-note',
'statutory-declaration',
'translation',
'utility-bill',
'vet-document')
ORDER BY doc_id ASC

--acro-police-certificate
UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'acro-police-certificate';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'acro-police-certificate';

-- affidavit

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed and dated by a UK solicitor or notary'
WHERE html_id = 'affidavit';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'A photocopy of your *replaceme*  <span>certification required</span>'
WHERE html_id = 'affidavit';

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'affidavit';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'affidavit';

--articles-of-association

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of Companies House'
WHERE html_id = 'articles-of-association';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of Companies House <span>certification required</span> '
WHERE html_id = 'articles-of-association';

--'certificate-of-freesale'

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of the issuing authority'
WHERE html_id = 'certificate-of-freesale';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>'
WHERE html_id = 'certificate-of-freesale';

--'certificate-of-incorporation'

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of Companies House'
WHERE html_id = 'certificate-of-incorporation';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of Companies House <span>certification required</span>'
WHERE html_id = 'certificate-of-incorporation';

--'certificate-of-memorandum'

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of Companies House'
WHERE html_id = 'certificate-of-memorandum';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of Companies House <span>certification required</span>'
WHERE html_id = 'certificate-of-memorandum';

--change-of-name-deed

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'An original *replaceme* signed and dated by a UK solicitor or notary.'
WHERE html_id = 'change-of-name-deed';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'A photocopy of your <span>certification required</span>  *replaceme* '
WHERE html_id = 'change-of-name-deed';

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'change-of-name-deed';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'change-of-name-deed';

--companies-house-document
UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of Companies House'
WHERE html_id = 'companies-house-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of Companies House <span>certification required</span>'
WHERE html_id = 'companies-house-document';

--coroners-report

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'coroners-report';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'coroners-report';

--county-court-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original court document stamped or sealed by the court, or signed by an official of the court'
WHERE html_id = 'county-court-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>'
WHERE html_id = 'county-court-document';

--court-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original court document stamped or sealed by the court, or signed by an official of the court'
WHERE html_id = 'court-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original court document not stamped sealed or signed by a court, or an official of the court <span>certification required</span>'
WHERE html_id = 'court-document';

--court-of-bancruptcy-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original court document stamped or sealed by the court, or signed by an official of the court'
WHERE html_id = 'court-of-bancruptcy-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original court document not stamped sealed or signed by a court, or an official of the court <span>certification required</span>'
WHERE html_id = 'court-of-bancruptcy-document';

--cremation-certificate

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'cremation-certificate';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'cremation-certificate';

--criminal-records-bureau-crb-document

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'criminal-records-bureau-crb-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'criminal-records-bureau-crb-document';

--criminal-records-check

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'criminal-records-check';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'criminal-records-check';

--death-certificate

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'death-certificate';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'death-certificate';

--decree-absolute

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original court document stamped sealed or signed by a court or an official of the court '
WHERE html_id = 'decree-absolute';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court or an official of the court <span>certification required</span>'
WHERE html_id = 'decree-absolute';

--decree-nisi

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original court document stamped sealed or signed by a court or an official of the court '
WHERE html_id = 'decree-nisi';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court or an official of the court <span>certification required</span>'
WHERE html_id = 'decree-nisi';

--department-of-business-innovation-and-skills-bis

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of the issuing authority'
WHERE html_id = 'department-of-business-innovation-and-skills-bis';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>'
WHERE html_id = 'department-of-business-innovation-and-skills-bis';

--department-of-health-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of the issuing authority'
WHERE html_id = 'department-of-health-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>'
WHERE html_id = 'department-of-health-document';

--disclosure-scotland-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of the issuing authority'
WHERE html_id = 'disclosure-scotland-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* without a signature from an official of the iussuing authority <span>certification required</span>'
WHERE html_id = 'disclosure-scotland-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'disclosure-scotland-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'disclosure-scotland-document';

--doctors-medical

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'doctors-medical';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'doctors-medical';

--driving-license

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'driving-license';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'driving-license';

--export-certificate

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of the issuing authority'
WHERE html_id = 'export-certificate';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>'
WHERE html_id = 'export-certificate';

--family-division-of-the-high-court-of-justice-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original court document, stamped or sealed by the court, or signed by an official of the court'
WHERE html_id = 'family-division-of-the-high-court-of-justice-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original court document, not stamped, sealed or signed by a court or an official of the court <span>certification required</span>'
WHERE html_id = 'family-division-of-the-high-court-of-justice-document';

--fingerprints-document

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'fingerprints-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'fingerprints-document';

--fit-note

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'fit-note';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'fit-note';

--government-issued-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official from the issuing authority'
WHERE html_id = 'government-issued-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official from the issuing authority <span>certification required</span>'
WHERE html_id = 'government-issued-document';

--grant-of-probate

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original court document, stamped or sealed by the court, or signed by an official of the court '
WHERE html_id = 'grant-of-probate';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original court document, not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>'
WHERE html_id = 'grant-of-probate';

--high-court-of-justice-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original court document, stamped or sealed by the court, or signed by an official of the court '
WHERE html_id = 'high-court-of-justice-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original court document, not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>'
WHERE html_id = 'high-court-of-justice-document';

--hm-revenue-and-customs-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of the issuing authority'
WHERE html_id = 'hm-revenue-and-customs-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of the issuing authority'
WHERE html_id = 'hm-revenue-and-customs-document';

--home-office-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of the issuing authority'
WHERE html_id = 'home-office-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of the issuing authority'
WHERE html_id = 'home-office-document';

--letter-of-no-trace

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'letter-of-no-trace';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'letter-of-no-trace';

--marriage-certificate-other

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'marriage-certificate-other';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'marriage-certificate-other';

--medical-report

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'medical-report';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'medical-report';

--medical-test-results

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'medical-test-results';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'medical-test-results';

--passport

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'passport';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'passport';

--Pet-export-document-from-defra

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'Pet-export-document-from-defra';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'Pet-export-document-from-defra';

--police-disclosure-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of the issuing authority'
WHERE html_id = 'police-disclosure-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>'
WHERE html_id = 'police-disclosure-document';

--power-of-attorney

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'power-of-attorney';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'power-of-attorney';

--school-document

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'school-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'school-document';

--sheriff-court-document

UPDATE "AvailableDocuments"
SET eligible_check_option_1 = 'Your original court document stamped, sealed or signed by a court, or an official of the court'
WHERE html_id = 'sheriff-court-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_2 = 'Your original court document not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>'
WHERE html_id = 'sheriff-court-document';

--sick-note

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'sick-note';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'sick-note';

--statutory-declaration

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'statutory-declaration';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'statutory-declaration';

--translation

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'translation';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'translation';

--vet-document

UPDATE "AvailableDocuments"
SET eligible_check_option_3 = 'A printout of your electronic *replaceme* produced from the original PDF or other electronic document'
WHERE html_id = 'vet-document';

UPDATE "AvailableDocuments"
SET eligible_check_option_4 = null
WHERE html_id = 'vet-document';
