UPDATE country
SET casebook_mapping = 'Bonaire, Sint Eustatius and Saba'
WHERE name = 'Bonaire/St Eustatius/Saba';

UPDATE country
SET casebook_mapping = 'Curaçao'
WHERE name = 'Curaçao';

UPDATE country
SET casebook_mapping = 'North Korea / DPRK'
WHERE name = 'North Korea';

UPDATE country
SET casebook_mapping = 'Réunion'
WHERE name = 'Réunion';

UPDATE country
SET casebook_mapping = 'Saint Barthélemy'
WHERE name = 'Saint-Barthélemy';

UPDATE country
SET casebook_mapping = 'São Tomé and Príncipe'
WHERE name = 'Sao Tome and Principe';

UPDATE country
SET casebook_mapping = 'South Korea / Republic of Korea'
WHERE name = 'South Korea';

UPDATE country
SET casebook_mapping = 'Saint Helena, Ascension and Tristan da Cunha'
WHERE name = 'St Helena, Ascension and Tristan da Cunha';

SELECT * FROM country
WHERE casebook_mapping in (
                           'Bonaire, Sint Eustatius and Saba',
                           'Curaçao',
                           'North Korea / DPRK',
                           'Réunion',
                           'Saint Barthélemy',
                           'São Tomé and Príncipe',
                           'South Korea / Republic of Korea',
                           'Saint Helena, Ascension and Tristan da Cunha');
