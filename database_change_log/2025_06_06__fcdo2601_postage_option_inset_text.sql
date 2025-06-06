ALTER TABLE "PostagesAvailable"
ADD COLUMN "inset_text" TEXT;

UPDATE public."PostagesAvailable" SET inset_text = 'You must pay sufficient postage for your documents to arrive. We will not pay to release any documents that do not have the correct postage paid' WHERE id = 4;
