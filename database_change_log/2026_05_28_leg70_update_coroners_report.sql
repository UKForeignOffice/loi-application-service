-- CORONERS REPORT
UPDATE public."AvailableDocuments"
SET eligible_check_option_1 = 'Your original coroner’s report signed with a wet ink signature of the named coroner, or stamped with a wet-ink or embossed seal from the issuing authority<span>wet ink</span>'
WHERE html_id = 'coroners-report';
