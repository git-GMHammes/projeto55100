CREATE OR REPLACE VIEW view_partidos_2022_RJ AS
SELECT DISTINCT
    `SG_PARTIDO`,
    `NM_PARTIDO`
FROM `votacao_candidato_munzona_2022_RJ`
where `SG_PARTIDO` is not null
ORDER BY `SG_PARTIDO`;