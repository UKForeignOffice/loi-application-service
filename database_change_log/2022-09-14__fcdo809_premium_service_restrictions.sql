-- PHASE 1
ALTER TABLE public."Users" ADD COLUMN "premiumUpgradeToken" text;
ALTER TABLE public."Users" ADD COLUMN "premiumServiceEnabled" boolean default false;
ALTER TABLE public."Users" ADD COLUMN "noOfPremiumRequestAttempts" integer default 0;

--- PHASE 2
UPDATE "AccountDetails" SET company_name = 'N/A';
UPDATE "Users" SET "premiumEnabled" = false;
