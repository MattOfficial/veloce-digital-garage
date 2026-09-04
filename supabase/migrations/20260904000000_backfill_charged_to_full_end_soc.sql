-- "Charged to 100%" is a direct assertion, not a guess, but the app only ever
-- wrote the boolean flag -- the literal end_soc reading stayed null whenever
-- the owner used the toggle instead of typing "100". Segment chaining
-- (buildChargeSegments) and pack-capacity measurement both need the literal
-- percentage, not just "was this session full", so every charge-to-full
-- session logged before this fix has been invisible to them.
--
-- Backfilling the implied 100 costs nothing: FULL_CHARGE_SOC already treats
-- end_soc >= 98 as full, and resolveChargeRow (src/app/actions/fuel.ts) now
-- writes 100 itself for every new charge-to-full session with no end_soc
-- typed, so this just brings existing rows in line with what the app writes
-- going forward. Idempotent: a row already carrying a real end_soc is left
-- untouched, and re-running only ever matches rows still at null.
UPDATE public.fuel_logs
SET end_soc = 100
WHERE energy_type = 'charge'
    AND charged_to_full = TRUE
    AND end_soc IS NULL;
