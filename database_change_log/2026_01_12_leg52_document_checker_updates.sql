-- UPDATE ISSUING AUTHORITY TEXT FOR VARIOUS DOCUMENTS IN AvailableDocuments TABLE
UPDATE public."AvailableDocuments"
SET issuing_authority_text = 'Your original [document] must contain a wet ink signature or a seal from the issuing authority.<br><br>General Register Office documents must be dated outside the bold box. If the certificate is signed by an official, the signature must appear outside the bold box.<br><div class="govuk-inset-text">A wet ink signature/seal means that it has been physically applied by hand, as opposed to being printed or scanned onto the document.</div>'
WHERE html_id IN ('adoption_document', 'birth-certificate', 'civil-partnership-certificate', 'death-certificate', 'gender-recognition-certificate',
                  'grant-of-probate', 'marriage-certificate-gro');

UPDATE public."AvailableDocuments"
SET issuing_authority_text = 'Your original [document] must contain a wet ink signature and date from the issuing authority.<br><div class="govuk-inset-text">A wet ink signature/seal means that it has been physically applied by hand, as opposed to being printed or scanned onto the document.</div>'
WHERE html_id IN ('acro-police-certificate', 'certificate-of-no-impediment', 'criminal-records-check', 'doctors-medical', 'fingerprints-document',
                  'fit-note', 'letter-of-no-trace', 'medical-report', 'medical-test-results', 'Pet-export-document-from-defra', 'vet-document');

UPDATE public."AvailableDocuments"
SET issuing_authority_text = 'Your [document] must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.<br><div class="govuk-inset-text">A wet ink signature/seal means that it has been physically applied by hand, as opposed to being printed or scanned onto the document.</div>'
WHERE html_id = 'articles-of-association';

UPDATE public."AvailableDocuments"
SET issuing_authority_text = 'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.<br><div class="govuk-inset-text">A wet ink signature/seal means that it has been physically applied by hand, as opposed to being printed or scanned onto the document.</div>'
WHERE html_id IN ('certificate-of-freesale', 'certificate-of-incorporation', 'certificate-of-memorandum', 'certificate-of-naturalisation',
                  'companies-house-document', 'coroners-report', 'county-court-document', 'court-document', 'court-of-bancruptcy-document', 'cremation-certificate', 'decree-absolute',
                  'decree-nisi', 'department-for-business-and-trade-document', 'export-certificate', 'family-division-of-the-high-court-of-justice-document',
                  'government-issued-document', 'high-court-of-justice-document', 'hm-revenue-and-customs-document', 'home-office-document',
                  'last-will-and-testament', 'sheriff-court-document', 'subject-access-request-letter');
