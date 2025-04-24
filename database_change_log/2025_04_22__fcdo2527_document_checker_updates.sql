-- Adding new document type - National Archives document
INSERT INTO public."AvailableDocuments" VALUES (nextval('doc_id_seq'::regclass), --doc_d
                                                null , null, 'national-archives-document', --updated_at
                                                null,
                                                null,
                                                true,
                                                true,
                                                true,
                                                7,
                                                'National Archives Document',
                                                'National Archives document',
                                                'National Archives document',
                                                null,
                                                'Your original National Archives document, stamped or sealed by the National Archives, or signed by an official of the National Archives<span>wet ink</span>',
                                                'Your original court document, not stamped, sealed or signed by the National Archives<span>certification required</span>',
                                                'A photocopy or printout of your National Archives document <span>certification required</span>',
                                                'can be legalised',
                                                'Document',
                                                null,
                                                'national archives document, government document',
                                                'We accept the document in the following formats. Please select which one you will send:',
                                                null,
                                                null,
                                                null,
                                                'Your document must contain a wet ink signature or a wet ink/embossed seal and a date from the issuing authority.',
                                                null);

-- Adding inset text boxes to court document types
UPDATE public."AvailableDocuments" SET inset_text = 'Court documents are issued with printed seals as standard which cannot be legalised. Please ensure your documents meet our requirements before submission.' WHERE html_id = 'county-court-document';
UPDATE public."AvailableDocuments" SET inset_text = 'Court documents are issued with printed seals as standard which cannot be legalised. Please ensure your documents meet our requirements before submission.' WHERE html_id = 'court-of-bancruptcy-document';
UPDATE public."AvailableDocuments" SET inset_text = 'Court documents are issued with printed seals as standard which cannot be legalised. Please ensure your documents meet our requirements before submission.' WHERE html_id = 'court-document';
UPDATE public."AvailableDocuments" SET inset_text = 'Court documents are issued with printed seals as standard which cannot be legalised. Please ensure your documents meet our requirements before submission.' WHERE html_id = 'decree-absolute';
UPDATE public."AvailableDocuments" SET inset_text = 'Court documents are issued with printed seals as standard which cannot be legalised. Please ensure your documents meet our requirements before submission.' WHERE html_id = 'decree-nisi';
