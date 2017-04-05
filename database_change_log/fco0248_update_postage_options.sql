-- Update postage options

Update "PostagesAvailable"
SET title = 'You''ll post your documents from the UK'
WHERE title = 'I will post my documents from the UK';

Update "PostagesAvailable"
SET title = 'You''ll use a courier to send your documents from the UK'
WHERE title = 'I will use a courier to send my documents from the UK';

Update "PostagesAvailable"
SET title = 'You''re overseas and will post or courier your documents to the UK'
WHERE title = 'I am overseas and will post or courier my documents to the UK';

Update "PostagesAvailable"
SET title = 'You''ll arrange for the return of your documents by adding stamps on to a self-addressed envelope which you''ll include with your documents - typically £1 to £8, the cost varies'
WHERE title = 'I''ll include a pre-paid stamped addressed A4-sized envelope with my documents';

Update "PostagesAvailable"
SET title = 'The Legalisation Office will arrange for the return of your documents by courier (including to British Forces Post Office)'
WHERE title = 'Courier delivery (including to British Forces Post Office)';
