-- =============================================================
-- view_votacao_candidato_munzona_2022_RJ_group.sql
-- =============================================================
CREATE OR REPLACE VIEW `vw_votos_candidato_2022_RJ` AS
SELECT CONCAT('2022', `NR_CANDIDATO`, `CD_MUNICIPIO`) AS `ID`,
    `CD_MUNICIPIO`,
    `DS_CARGO`,
    `NR_CANDIDATO`,
    `NM_CANDIDATO`,
    `NM_SOCIAL_CANDIDATO`,
    SUM(CAST(`QT_VOTOS_NOMINAIS` AS UNSIGNED)) AS `QT_VOTOS_NOMINAIS`,
    `DS_SIT_TOT_TURNO`
FROM `votacao_candidato_munzona_2022_RJ`
GROUP BY `DS_CARGO`,
    `NR_CANDIDATO`,
    `NM_CANDIDATO`,
    `NM_SOCIAL_CANDIDATO`,
    `DS_SIT_TOT_TURNO`;


-- =============================================================
-- view_votacao_candidato_munzona_2024_RJ_group.sql
-- =============================================================
CREATE OR REPLACE VIEW view_votacao_candidato_munzona_2024_RJ_group AS
SELECT
    CONCAT('2024', `NR_VOTAVEL`, `CD_MUNICIPIO`) AS `ID`,
    CD_MUNICIPIO,
    NM_MUNICIPIO,
    DS_CARGO,
    SG_PARTIDO,
    NM_PARTIDO,
    NR_VOTAVEL,
    NM_VOTAVEL,
    SUM(CAST(QT_VOTOS AS UNSIGNED)) AS QT_VOTOS
FROM votacao_secao_2024_RJ
GROUP BY
    CD_MUNICIPIO,
    NM_MUNICIPIO,
    DS_CARGO,
    SG_PARTIDO,
    NM_PARTIDO,
    NR_VOTAVEL,
    NM_VOTAVEL
ORDER BY
    QT_VOTOS DESC;


-- =============================================================
-- view_votos_municipio_2022.sql
-- =============================================================
CREATE OR REPLACE VIEW `view_votos_municipio_2022` AS
SELECT ROW_NUMBER() OVER (
        ORDER BY `NM_MUNICIPIO`,
            SUM(CAST(`QT_VOTOS_NOMINAIS` AS UNSIGNED)) DESC
    ) AS `ID`,
    `CD_MUNICIPIO`,
    `NM_MUNICIPIO`,
    `DS_CARGO`,
    `SG_PARTIDO`,
    `NM_PARTIDO`,
    `NR_CANDIDATO`,
    `NM_CANDIDATO`,
    `NM_SOCIAL_CANDIDATO`,
    SUM(CAST(`QT_VOTOS_NOMINAIS` AS UNSIGNED)) AS `QT_VOTOS_NOMINAIS`,
    `DS_SIT_TOT_TURNO`
FROM `votacao_candidato_munzona_2022_RJ`
GROUP BY `NM_MUNICIPIO`,
    `DS_CARGO`,
    `NR_CANDIDATO`,
    `NM_CANDIDATO`,
    `NM_SOCIAL_CANDIDATO`,
    `DS_SIT_TOT_TURNO`
ORDER BY NM_MUNICIPIO ASC,
    QT_VOTOS_NOMINAIS DESC;


-- =============================================================
-- view_votos_municipio_2024.sql
-- =============================================================
CREATE OR REPLACE VIEW view_votos_municipio_2024_RJ AS
SELECT
    ROW_NUMBER() OVER (
        ORDER BY NM_MUNICIPIO, SUM(CAST(QT_VOTOS AS UNSIGNED)) DESC
    ) AS ID,
    CD_MUNICIPIO,
    NM_MUNICIPIO,
    DS_CARGO,
    CD_CARGO,
    SG_PARTIDO,
    NM_PARTIDO,
    NR_VOTAVEL,
    NM_VOTAVEL,
    SUM(CAST(QT_VOTOS AS UNSIGNED)) AS QT_VOTOS
FROM votacao_secao_2024_RJ
GROUP BY
    CD_MUNICIPIO,
    NM_MUNICIPIO,
    DS_CARGO,
    CD_CARGO,
    SG_PARTIDO,
    NM_PARTIDO,
    NR_VOTAVEL,
    NM_VOTAVEL
ORDER BY
    NM_MUNICIPIO,
    QT_VOTOS DESC;
