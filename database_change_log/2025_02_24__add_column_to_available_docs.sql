ALTER TABLE public."AvailableDocuments" ADD COLUMN "issuing_authority_text" text;
ALTER TABLE public."AvailableDocuments" ADD COLUMN "inset_text" text;
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
                                                'Your original ACCA membership certificate without a signature from an official of the issuing authority <span>certification required</span>',
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
UPDATE public."AvailableDocuments" SET inset_text = 'We are unable to legalise photocopies or DRAFT certificates.' WHERE html_id = 'death-certificate';

--ACRO POLICE
UPDATE public."AvailableDocuments" SET eligible_check_option_1 = 'Your original *replaceme* signed by an official of the issuing authority. <span>wet ink</span>' WHERE html_id = 'acro-police-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_2 = null WHERE html_id = 'acro-police-certificate';
UPDATE public."AvailableDocuments" SET eligible_check_option_3 = null WHERE html_id = 'acro-police-certificate';
UPDATE public."AvailableDocuments" SET issuing_authority_text = 'Your original [document] must contain a wet ink signature and date from the issuing authority.' WHERE html_id = 'acro-police-certificate';

