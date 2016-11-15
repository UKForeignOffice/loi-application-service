-- Run against FCO-LOI-Users

-- Create required tables for account expiry feature
ALTER TABLE "Users" ADD "accountExpiry" timestamp without time zone; 
ALTER TABLE "Users" ADD "warningSent" boolean default false; 
ALTER TABLE "Users" ADD "expiryConfirmationSent" boolean default false; 
-- Update existing uses with account expiry date
UPDATE "Users" SET "accountExpiry"=NOW() + INTERVAL '1 year' WHERE "accountExpiry" is null 