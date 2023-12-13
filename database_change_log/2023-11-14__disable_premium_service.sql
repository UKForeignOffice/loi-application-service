-- fco_user (before release on 11th Dec 2023)
ALTER TABLE public."Users" ADD COLUMN "businessUpgradeToken" text;
ALTER TABLE public."Users" ADD COLUMN "noOfBusinessRequestAttempts" integer default 0;

-- fco_user (after release on 11th Dec 2023)
ALTER TABLE public."Users" DROP COLUMN "premiumEnabled";
ALTER TABLE public."Users" DROP COLUMN "premiumUpgradeToken";
ALTER TABLE public."Users" DROP COLUMN "noOfPremiumRequestAttempts";

-- run after 29th Dev 5PM
SELECT DISTINCT(user_id)
FROM "Application"
WHERE "serviceType" = 2
  AND submitted = 'submitted'
  AND application_start_date >= '2023-11-01';

UPDATE "Users"
SET "premiumServiceEnabled" = false;

UPDATE "Users"
SET "premiumServiceEnabled" = true
WHERE id in(193);


-- run in 2024
UPDATE "AccountDetails" SET company_name = 'N/A' WHERE user_id in (SELECT id FROM "Users" WHERE "premiumServiceEnabled" = true and "dropOffEnabled" = false);

