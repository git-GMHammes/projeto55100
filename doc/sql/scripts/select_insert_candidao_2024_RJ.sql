INSERT INTO `candidato_2024_RJ` (
        `id`,
        `NR_MUNICIPIO`,
        `NM_MUNICIPIO`,
        `NR_CANDIDATO`,
        `NM_CANDIDATO`,
        `SG_PARTIDO`,
        `NM_PARTIDO`,
        `QT_VOTOS_NOMINAIS_VALIDOS`
    )
SELECT `ID`,
    `CD_MUNICIPIO`,
    `NM_MUNICIPIO`,
    `NR_VOTAVEL`,
    `NM_VOTAVEL`,
    `SG_PARTIDO`,
    `NM_PARTIDO`,
    `QT_VOTOS_NOMINAIS_VALIDOS`
FROM `view_candidato_2024_RJ`;