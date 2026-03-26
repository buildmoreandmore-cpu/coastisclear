-- ═══════════════════════════════════════════════════════
-- COASTISCLEAR — Seed Data
-- Run in Supabase SQL Editor after schema.sql
-- ═══════════════════════════════════════════════════════

-- ─── Major Labels (Master Recording Owners) ───

INSERT INTO rights_holders (name, type, parent_company, email, department, aliases, avg_fee_master, avg_response_weeks) VALUES
('Universal Music Group', 'label', NULL, 'sampleclearance@umusic.com', 'Sample Licensing', ARRAY['UMG', 'Universal'], '$5,000–$25,000 + points', '6–10 weeks'),
('Sony Music Entertainment', 'label', NULL, 'sampleclearance@sonymusic.com', 'Sample Licensing', ARRAY['Sony Music', 'SME'], '$5,000–$25,000 + points', '6–10 weeks'),
('Warner Music Group', 'label', NULL, 'sampleclearance@wmg.com', 'Sample Licensing & Clearance', ARRAY['WMG', 'Warner'], '$5,000–$25,000 + points', '6–10 weeks'),
-- UMG Sub-labels
('Interscope Records', 'label', 'Universal Music Group', NULL, 'A&R / Licensing', ARRAY['Interscope', 'Interscope Geffen A&M'], '$5,000–$20,000 + points', '6–12 weeks'),
('Def Jam Recordings', 'label', 'Universal Music Group', NULL, 'Licensing', ARRAY['Def Jam'], '$5,000–$25,000 + points', '6–12 weeks'),
('Republic Records', 'label', 'Universal Music Group', NULL, 'Licensing', ARRAY['Republic'], '$5,000–$20,000 + points', '6–10 weeks'),
('Capitol Records', 'label', 'Universal Music Group', NULL, 'Licensing', ARRAY['Capitol', 'Capitol Music Group'], '$5,000–$20,000 + points', '6–10 weeks'),
('Motown Records', 'label', 'Universal Music Group', NULL, 'Licensing', ARRAY['Motown'], '$5,000–$25,000 + points', '8–12 weeks'),
('Island Records', 'label', 'Universal Music Group', NULL, 'Licensing', ARRAY['Island'], '$5,000–$20,000 + points', '6–10 weeks'),
-- Sony Sub-labels
('Columbia Records', 'label', 'Sony Music Entertainment', NULL, 'Sample Clearance', ARRAY['Columbia'], '$5,000–$25,000 + points', '6–12 weeks'),
('RCA Records', 'label', 'Sony Music Entertainment', NULL, 'Licensing', ARRAY['RCA'], '$5,000–$20,000 + points', '6–10 weeks'),
('Epic Records', 'label', 'Sony Music Entertainment', NULL, 'Licensing', ARRAY['Epic'], '$5,000–$20,000 + points', '6–10 weeks'),
-- Warner Sub-labels
('Atlantic Records', 'label', 'Warner Music Group', NULL, 'Licensing', ARRAY['Atlantic'], '$5,000–$25,000 + points', '6–12 weeks'),
('Elektra Records', 'label', 'Warner Music Group', NULL, 'Licensing', ARRAY['Elektra'], '$5,000–$20,000 + points', '6–10 weeks'),
('Warner Records', 'label', 'Warner Music Group', NULL, 'Licensing', ARRAY['Warner Bros Records', 'Warner Bros'], '$5,000–$20,000 + points', '6–10 weeks'),
-- Key Independents
('EMPIRE Distribution', 'label', NULL, NULL, 'Licensing', ARRAY['EMPIRE'], '$2,000–$10,000', '4–8 weeks'),
('Quality Control Music', 'label', NULL, NULL, 'Licensing', ARRAY['QC', 'Quality Control'], '$3,000–$15,000', '4–8 weeks'),
('Top Dawg Entertainment', 'label', NULL, NULL, 'Licensing', ARRAY['TDE', 'Top Dawg'], '$3,000–$15,000', '6–10 weeks');

-- ─── Major Publishers (Composition / Publishing Rights) ───

INSERT INTO rights_holders (name, type, parent_company, email, department, aliases, avg_fee_publishing, avg_response_weeks) VALUES
('Sony Music Publishing', 'publisher', 'Sony Music Entertainment', 'licensing@sonymusicpub.com', 'Sample Licensing', ARRAY['Sony/ATV', 'Sony ATV', 'Sony ATV Music Publishing'], '$2,500–$5,000 + 50% pub', '4–8 weeks'),
('Universal Music Publishing Group', 'publisher', 'Universal Music Group', 'licensing@umusicpub.com', 'Licensing', ARRAY['UMPG', 'Universal Publishing'], '$2,500–$5,000 + 50% pub', '4–8 weeks'),
('Warner Chappell Music', 'publisher', 'Warner Music Group', 'licensing@warnerchappell.com', 'Sample Licensing & Clearance', ARRAY['Warner Chappell', 'WCM'], '$2,500–$5,000 + 50% pub', '4–8 weeks'),
('Kobalt Music', 'publisher', NULL, 'licensing@kobaltmusic.com', 'Licensing', ARRAY['Kobalt', 'Kobalt Music Publishing'], '$2,000–$5,000 + negotiable', '3–6 weeks'),
('BMG Rights Management', 'publisher', NULL, 'licensing@bmg.com', 'Licensing', ARRAY['BMG', 'BMG Music'], '$2,500–$5,000 + 50% pub', '4–8 weeks'),
('Concord Music Publishing', 'publisher', NULL, 'licensing@concord.com', 'Licensing', ARRAY['Concord', 'Concord Music'], '$2,000–$5,000', '4–6 weeks'),
('Primary Wave Music', 'publisher', NULL, NULL, 'Licensing', ARRAY['Primary Wave'], '$2,500–$5,000 + negotiable', '4–8 weeks'),
('Spirit Music Group', 'publisher', NULL, NULL, 'Licensing', ARRAY['Spirit Music'], '$2,000–$5,000', '4–6 weeks'),
('Hipgnosis Songs Management', 'publisher', NULL, NULL, 'Licensing', ARRAY['Hipgnosis', 'Hipgnosis Songs'], '$2,500–$5,000 + negotiable', '4–8 weeks'),
('Downtown Music Publishing', 'publisher', NULL, NULL, 'Licensing', ARRAY['Downtown', 'Songtrust'], '$1,500–$3,000', '3–6 weeks');

-- ─── Production Libraries ───

INSERT INTO rights_holders (name, type, email, phone, address, department, aliases, avg_fee_master, avg_fee_publishing, avg_response_weeks, notes) VALUES
('APM Music', 'both', 'licensing@apmmusic.com', '(323) 461-3211', '6255 Sunset Blvd, Suite 900, Hollywood, CA 90028', 'Licensing', ARRAY['APM', 'Associated Production Music'], '$2,500 flat', '$2,500 flat', '1–3 weeks', 'Production library. Standard flat fee clearance. Administers Bruton Music, Sonoton, and others.'),
('Extreme Music', 'both', 'licensing@extrememusic.com', NULL, NULL, 'Licensing', ARRAY['Extreme'], '$2,000–$5,000 flat', '$2,000–$5,000 flat', '1–3 weeks', 'Sony Music production library'),
('Universal Production Music', 'both', 'licensing@universalproductionmusic.com', NULL, NULL, 'Licensing', ARRAY['UPM', 'Killer Tracks'], '$2,000–$5,000 flat', '$2,000–$5,000 flat', '1–3 weeks', 'UMG production library'),
('FirstCom Music', 'both', NULL, NULL, NULL, 'Licensing', ARRAY['FirstCom'], '$1,500–$3,000 flat', '$1,500–$3,000 flat', '1–3 weeks', 'Production library'),
('De Wolfe Music', 'both', NULL, NULL, NULL, 'Licensing', ARRAY['De Wolfe'], '$1,500–$3,000 flat', '$1,500–$3,000 flat', '2–4 weeks', 'UK production library'),
('Megatrax', 'both', NULL, NULL, NULL, 'Licensing', ARRAY['Megatrax Production Music'], '$1,500–$3,000 flat', '$1,500–$3,000 flat', '1–3 weeks', 'Production library');

-- ─── Distributors ───

INSERT INTO distributors (name, parent_company, known_label_relationships, notes) VALUES
('The Orchard', 'Sony Music Entertainment', ARRAY['Sony Music', 'Columbia', 'RCA', 'Epic'], 'Sony Music distribution arm'),
('AWAL', 'Sony Music Entertainment', ARRAY['Sony Music'], 'Sony Music independent distribution'),
('Virgin Music Group', 'Universal Music Group', ARRAY['UMG', 'Universal'], 'UMG distribution'),
('Caroline International', 'Universal Music Group', ARRAY['UMG', 'Universal'], 'UMG independent distribution'),
('ADA Music', 'Warner Music Group', ARRAY['WMG', 'Warner', 'Atlantic'], 'Warner Music distribution'),
('DistroKid', NULL, '{}', 'Independent distributor — no major affiliation'),
('TuneCore', NULL, '{}', 'Independent distributor — no major affiliation'),
('CD Baby', NULL, '{}', 'Independent distributor — no major affiliation'),
('Stem', NULL, '{}', 'Independent distributor — artist-friendly splits');

-- ─── Verified Song Ownership (from real deal threads) ───

-- Dawn Mist / Stringtonics (APM library track)
INSERT INTO song_ownership (song_title, artist, publisher_id, label_id, writers, pro, confidence_score, source, is_production_library, library_name, flat_buyout_eligible)
SELECT
  'Dawn Mist',
  'Stringtonics',
  (SELECT id FROM rights_holders WHERE name = 'APM Music' LIMIT 1),
  (SELECT id FROM rights_holders WHERE name = 'APM Music' LIMIT 1),
  '[{"name": "Barry Forgie", "pro": "ASCAP", "approval_required": true}]'::jsonb,
  'ASCAP',
  95,
  ARRAY['internal_verified'],
  true,
  'APM Music',
  false;

-- Witches Tears / Tangoman (APM, flat buyout eligible)
INSERT INTO song_ownership (song_title, artist, publisher_id, label_id, writers, confidence_score, source, is_production_library, library_name, flat_buyout_eligible)
SELECT
  'Witches Tears',
  'Tangoman',
  (SELECT id FROM rights_holders WHERE name = 'APM Music' LIMIT 1),
  (SELECT id FROM rights_holders WHERE name = 'APM Music' LIMIT 1),
  '[]'::jsonb,
  85,
  ARRAY['internal_verified'],
  true,
  'APM Music',
  true;

-- Could It Be / Tevin Campbell (major label)
INSERT INTO song_ownership (song_title, artist, publisher_id, label_id, writers, confidence_score, source, is_production_library, flat_buyout_eligible)
SELECT
  'Could It Be',
  'Tevin Campbell',
  (SELECT id FROM rights_holders WHERE name = 'Sony Music Publishing' LIMIT 1),
  (SELECT id FROM rights_holders WHERE name = 'Warner Records' LIMIT 1),
  '[{"name": "Tevin Campbell", "approval_required": true}, {"name": "Babyface", "pro": "ASCAP", "approval_required": true}]'::jsonb,
  88,
  ARRAY['internal_verified'],
  false,
  false;

-- Quiet Reflection / Dick Walter & Eugene Cines (verified completed deal)
INSERT INTO song_ownership (song_title, artist, publisher_id, label_id, writers, confidence_score, source, is_production_library, library_name, flat_buyout_eligible)
SELECT
  'Quiet Reflection',
  'Dick Walter',
  (SELECT id FROM rights_holders WHERE name = 'APM Music' LIMIT 1),
  (SELECT id FROM rights_holders WHERE name = 'APM Music' LIMIT 1),
  '[{"name": "Dick Walter", "approval_required": true}, {"name": "Eugene Cines", "approval_required": true}]'::jsonb,
  98,
  ARRAY['internal_verified'],
  true,
  'APM Music',
  false;
