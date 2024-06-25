ALTER TABLE public."AdditionalPaymentDetails" ADD COLUMN "submission_request" json;
ALTER TABLE public."AdditionalPaymentDetails" ADD COLUMN "submission_response_code" text;
ALTER TABLE "AdditionalPaymentDetails" DROP COLUMN  "casebook_response_code";
