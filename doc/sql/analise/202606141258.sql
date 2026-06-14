/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET NAMES utf8 */
;
/*!50503 SET NAMES utf8mb4 */
;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;
/*!40103 SET TIME_ZONE='+00:00' */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;
CREATE TABLE IF NOT EXISTS `candidato_2022_RJ` (
    `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `NM_MUNICIPIO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NR_CANDIDATO` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_CANDIDATO` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `SG_PARTIDO` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_PARTIDO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `QT_VOTOS_NOMINAIS_VALIDOS` bigint unsigned DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Votos nominais válidos por candidato/município — Eleições 2022 RJ';
CREATE TABLE IF NOT EXISTS `candidato_2024_RJ` (
    `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `NM_MUNICIPIO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NR_CANDIDATO` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_CANDIDATO` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `SG_PARTIDO` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_PARTIDO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `QT_VOTOS_NOMINAIS_VALIDOS` bigint unsigned DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Votos nominais válidos por candidato/município — Eleições 2024 RJ';
CREATE TABLE IF NOT EXISTS `messages` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_created_at` (`created_at`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `municipio_ibge_tse` (
    `cd_ibge` char(7) COLLATE utf8mb4_unicode_ci NOT NULL,
    `cd_tse` char(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `nm_cidade` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`cd_ibge`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE `view_candidato_2022_RJ` (
    `ID` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NM_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NR_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NM_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `SG_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NM_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `QT_VOTOS_NOMINAIS_VALIDOS` DECIMAL(43, 0) NULL
) ENGINE = MyISAM;
CREATE TABLE `view_candidato_2024_RJ` (
    `ID` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NM_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NR_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NM_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `SG_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NM_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `QT_VOTOS_NOMINAIS_VALIDOS` DECIMAL(43, 0) NULL
) ENGINE = MyISAM;
CREATE TABLE `view_votacao_candidato_munzona_2022_RJ_group` (
    `ID` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `CD_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NM_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `DS_CARGO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NR_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NM_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NM_SOCIAL_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `QT_VOTOS_NOMINAIS` DECIMAL(43, 0) NULL,
    `DS_SIT_TOT_TURNO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci'
) ENGINE = MyISAM;
CREATE TABLE `view_votacao_candidato_munzona_2024_RJ_group` (
    `ID` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `CD_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NM_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `DS_CARGO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `SG_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NM_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NR_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NM_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `QT_VOTOS` DECIMAL(43, 0) NULL
) ENGINE = MyISAM;
CREATE TABLE `view_votos_municipio_2022_RJ` (
    `ID` BIGINT UNSIGNED NOT NULL,
    `CD_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NM_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `DS_CARGO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `SG_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NM_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NR_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NM_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `NM_SOCIAL_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
    `QT_VOTOS_NOMINAIS` DECIMAL(43, 0) NULL,
    `DS_SIT_TOT_TURNO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci'
) ENGINE = MyISAM;
CREATE TABLE `view_votos_municipio_2024_RJ` (
    `ID` BIGINT UNSIGNED NOT NULL,
    `CD_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NM_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `DS_CARGO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `CD_CARGO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `SG_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NM_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NR_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `NM_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
    `QT_VOTOS` DECIMAL(43, 0) NULL
) ENGINE = MyISAM;
CREATE TABLE IF NOT EXISTS `votacao_candidato_munzona_2022_RJ` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `DT_GERACAO` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `HH_GERACAO` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `ANO_ELEICAO` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `CD_TIPO_ELEICAO` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_TIPO_ELEICAO` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NR_TURNO` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `CD_ELEICAO` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `DS_ELEICAO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `DT_ELEICAO` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `TP_ABRANGENCIA` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `SG_UF` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `SG_UE` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_UE` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `CD_MUNICIPIO` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_MUNICIPIO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NR_ZONA` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `CD_CARGO` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `DS_CARGO` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `SQ_CANDIDATO` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NR_CANDIDATO` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_CANDIDATO` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_URNA_CANDIDATO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_SOCIAL_CANDIDATO` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `CD_SITUACAO_CANDIDATURA` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `DS_SITUACAO_CANDIDATURA` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `CD_DETALHE_SITUACAO_CAND` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `DS_DETALHE_SITUACAO_CAND` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `CD_SITUACAO_JULGAMENTO` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `DS_SITUACAO_JULGAMENTO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `CD_SITUACAO_CASSACAO` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `DS_SITUACAO_CASSACAO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `CD_SITUACAO_DCONST_DIPLOMA` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `DS_SITUACAO_DCONST_DIPLOMA` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `TP_AGREMIACAO` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NR_PARTIDO` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `SG_PARTIDO` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_PARTIDO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NR_FEDERACAO` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_FEDERACAO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `SG_FEDERACAO` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `DS_COMPOSICAO_FEDERACAO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `SQ_COLIGACAO` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_COLIGACAO` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `DS_COMPOSICAO_COLIGACAO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `ST_VOTO_EM_TRANSITO` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `QT_VOTOS_NOMINAIS` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `NM_TIPO_DESTINACAO_VOTOS` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `QT_VOTOS_NOMINAIS_VALIDOS` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `CD_SIT_TOT_TURNO` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `DS_SIT_TOT_TURNO` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 476350 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Votação por candidato/município/zona com resultado — Eleições 2022 RJ';
CREATE TABLE IF NOT EXISTS `votacao_secao_2024_RJ` (
    `id` int NOT NULL AUTO_INCREMENT,
    `DT_GERACAO` varchar(10) DEFAULT NULL,
    `HH_GERACAO` varchar(8) DEFAULT NULL,
    `ANO_ELEICAO` varchar(4) DEFAULT NULL,
    `CD_TIPO_ELEICAO` varchar(5) DEFAULT NULL,
    `NM_TIPO_ELEICAO` varchar(50) DEFAULT NULL,
    `NR_TURNO` varchar(1) DEFAULT NULL,
    `CD_ELEICAO` varchar(10) DEFAULT NULL,
    `DS_ELEICAO` varchar(100) DEFAULT NULL,
    `DT_ELEICAO` varchar(10) DEFAULT NULL,
    `TP_ABRANGENCIA` varchar(1) DEFAULT NULL,
    `SG_UF` varchar(2) DEFAULT NULL,
    `SG_UE` varchar(10) DEFAULT NULL,
    `NM_UE` varchar(100) DEFAULT NULL,
    `CD_MUNICIPIO` varchar(10) DEFAULT NULL,
    `NM_MUNICIPIO` varchar(100) DEFAULT NULL,
    `NR_ZONA` varchar(5) DEFAULT NULL,
    `NR_SECAO` varchar(5) DEFAULT NULL,
    `CD_CARGO` varchar(5) DEFAULT NULL,
    `DS_CARGO` varchar(50) DEFAULT NULL,
    `SG_PARTIDO` varchar(505) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `NM_PARTIDO` varchar(100) DEFAULT NULL,
    `NR_VOTAVEL` varchar(10) DEFAULT NULL,
    `NM_VOTAVEL` varchar(150) DEFAULT NULL,
    `QT_VOTOS` varchar(10) DEFAULT NULL,
    `NR_LOCAL_VOTACAO` varchar(10) DEFAULT NULL,
    `SQ_CANDIDATO` varchar(20) DEFAULT NULL,
    `NM_LOCAL_VOTACAO` varchar(150) DEFAULT NULL,
    `DS_LOCAL_VOTACAO_ENDERECO` varchar(250) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3407821 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS `view_candidato_2022_RJ`;
CREATE ALGORITHM = UNDEFINED DEFINER = `root` @`%` SQL SECURITY DEFINER VIEW `view_candidato_2022_RJ` AS
select concat(
        `votacao_candidato_munzona_2022_RJ`.`ANO_ELEICAO`,
        '.',
        `votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO`,
        '.',
        `votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO`
    ) AS `ID`,
    `votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,
    `votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO` AS `NR_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO` AS `NM_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_PARTIDO` AS `NM_PARTIDO`,
    sum(
        cast(
            `votacao_candidato_munzona_2022_RJ`.`QT_VOTOS_NOMINAIS_VALIDOS` as unsigned
        )
    ) AS `QT_VOTOS_NOMINAIS_VALIDOS`
from `votacao_candidato_munzona_2022_RJ`
group by `votacao_candidato_munzona_2022_RJ`.`ANO_ELEICAO`,
    `votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO`,
    `votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`SG_PARTIDO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_PARTIDO`;
DROP TABLE IF EXISTS `view_candidato_2024_RJ`;
CREATE ALGORITHM = UNDEFINED DEFINER = `root` @`%` SQL SECURITY DEFINER VIEW `view_candidato_2024_RJ` AS
select concat(
        `votacao_secao_2024_RJ`.`ANO_ELEICAO`,
        '.',
        `votacao_secao_2024_RJ`.`CD_MUNICIPIO`,
        '.',
        `votacao_secao_2024_RJ`.`NR_VOTAVEL`
    ) AS `ID`,
    `votacao_secao_2024_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,
    `votacao_secao_2024_RJ`.`NR_VOTAVEL` AS `NR_VOTAVEL`,
    `votacao_secao_2024_RJ`.`NM_VOTAVEL` AS `NM_VOTAVEL`,
    `votacao_secao_2024_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,
    `votacao_secao_2024_RJ`.`NM_PARTIDO` AS `NM_PARTIDO`,
    sum(
        cast(`votacao_secao_2024_RJ`.`QT_VOTOS` as unsigned)
    ) AS `QT_VOTOS_NOMINAIS_VALIDOS`
from `votacao_secao_2024_RJ`
group by `votacao_secao_2024_RJ`.`ANO_ELEICAO`,
    `votacao_secao_2024_RJ`.`CD_MUNICIPIO`,
    `votacao_secao_2024_RJ`.`NM_MUNICIPIO`,
    `votacao_secao_2024_RJ`.`NR_VOTAVEL`,
    `votacao_secao_2024_RJ`.`NM_VOTAVEL`,
    `votacao_secao_2024_RJ`.`SG_PARTIDO`,
    `votacao_secao_2024_RJ`.`NM_PARTIDO`
order by `votacao_secao_2024_RJ`.`NR_VOTAVEL`;
DROP TABLE IF EXISTS `view_votacao_candidato_munzona_2022_RJ_group`;
CREATE ALGORITHM = UNDEFINED DEFINER = `root` @`localhost` SQL SECURITY DEFINER VIEW `view_votacao_candidato_munzona_2022_RJ_group` AS
select concat(
        '2022',
        `votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO`,
        `votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO`
    ) AS `ID`,
    `votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO` AS `CD_MUNICIPIO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,
    `votacao_candidato_munzona_2022_RJ`.`DS_CARGO` AS `DS_CARGO`,
    `votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO` AS `NR_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO` AS `NM_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_SOCIAL_CANDIDATO` AS `NM_SOCIAL_CANDIDATO`,
    sum(
        cast(
            `votacao_candidato_munzona_2022_RJ`.`QT_VOTOS_NOMINAIS` as unsigned
        )
    ) AS `QT_VOTOS_NOMINAIS`,
    `votacao_candidato_munzona_2022_RJ`.`DS_SIT_TOT_TURNO` AS `DS_SIT_TOT_TURNO`
from `votacao_candidato_munzona_2022_RJ`
group by `votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO`,
    `votacao_candidato_munzona_2022_RJ`.`DS_CARGO`,
    `votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_SOCIAL_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`DS_SIT_TOT_TURNO`;
DROP TABLE IF EXISTS `view_votacao_candidato_munzona_2024_RJ_group`;
CREATE ALGORITHM = UNDEFINED DEFINER = `root` @`%` SQL SECURITY DEFINER VIEW `view_votacao_candidato_munzona_2024_RJ_group` AS
select concat(
        '2024',
        `votacao_secao_2024_RJ`.`NR_VOTAVEL`,
        `votacao_secao_2024_RJ`.`CD_MUNICIPIO`
    ) AS `ID`,
    `votacao_secao_2024_RJ`.`CD_MUNICIPIO` AS `CD_MUNICIPIO`,
    `votacao_secao_2024_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,
    `votacao_secao_2024_RJ`.`DS_CARGO` AS `DS_CARGO`,
    `votacao_secao_2024_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,
    `votacao_secao_2024_RJ`.`NM_PARTIDO` AS `NM_PARTIDO`,
    `votacao_secao_2024_RJ`.`NR_VOTAVEL` AS `NR_VOTAVEL`,
    `votacao_secao_2024_RJ`.`NM_VOTAVEL` AS `NM_VOTAVEL`,
    sum(
        cast(`votacao_secao_2024_RJ`.`QT_VOTOS` as unsigned)
    ) AS `QT_VOTOS`
from `votacao_secao_2024_RJ`
group by `votacao_secao_2024_RJ`.`CD_MUNICIPIO`,
    `votacao_secao_2024_RJ`.`NM_MUNICIPIO`,
    `votacao_secao_2024_RJ`.`DS_CARGO`,
    `votacao_secao_2024_RJ`.`SG_PARTIDO`,
    `votacao_secao_2024_RJ`.`NM_PARTIDO`,
    `votacao_secao_2024_RJ`.`NR_VOTAVEL`,
    `votacao_secao_2024_RJ`.`NM_VOTAVEL`
order by `QT_VOTOS` desc;
DROP TABLE IF EXISTS `view_votos_municipio_2022_RJ`;
CREATE ALGORITHM = UNDEFINED DEFINER = `root` @`%` SQL SECURITY DEFINER VIEW `view_votos_municipio_2022_RJ` AS
select row_number() OVER (
        ORDER BY `votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO`,
            sum(
                cast(
                    `votacao_candidato_munzona_2022_RJ`.`QT_VOTOS_NOMINAIS` as unsigned
                )
            ) desc
    ) AS `ID`,
    `votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO` AS `CD_MUNICIPIO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,
    `votacao_candidato_munzona_2022_RJ`.`DS_CARGO` AS `DS_CARGO`,
    `votacao_candidato_munzona_2022_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_PARTIDO` AS `NM_PARTIDO`,
    `votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO` AS `NR_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO` AS `NM_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_SOCIAL_CANDIDATO` AS `NM_SOCIAL_CANDIDATO`,
    sum(
        cast(
            `votacao_candidato_munzona_2022_RJ`.`QT_VOTOS_NOMINAIS` as unsigned
        )
    ) AS `QT_VOTOS_NOMINAIS`,
    `votacao_candidato_munzona_2022_RJ`.`DS_SIT_TOT_TURNO` AS `DS_SIT_TOT_TURNO`
from `votacao_candidato_munzona_2022_RJ`
group by `votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO`,
    `votacao_candidato_munzona_2022_RJ`.`DS_CARGO`,
    `votacao_candidato_munzona_2022_RJ`.`SG_PARTIDO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_PARTIDO`,
    `votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`NM_SOCIAL_CANDIDATO`,
    `votacao_candidato_munzona_2022_RJ`.`DS_SIT_TOT_TURNO`
order by `votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO`,
    `QT_VOTOS_NOMINAIS` desc;
DROP TABLE IF EXISTS `view_votos_municipio_2024_RJ`;
CREATE ALGORITHM = UNDEFINED DEFINER = `root` @`%` SQL SECURITY DEFINER VIEW `view_votos_municipio_2024_RJ` AS
select row_number() OVER (
        ORDER BY `votacao_secao_2024_RJ`.`NM_MUNICIPIO`,
            sum(
                cast(`votacao_secao_2024_RJ`.`QT_VOTOS` as unsigned)
            ) desc
    ) AS `ID`,
    `votacao_secao_2024_RJ`.`CD_MUNICIPIO` AS `CD_MUNICIPIO`,
    `votacao_secao_2024_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,
    `votacao_secao_2024_RJ`.`DS_CARGO` AS `DS_CARGO`,
    `votacao_secao_2024_RJ`.`CD_CARGO` AS `CD_CARGO`,
    `votacao_secao_2024_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,
    `votacao_secao_2024_RJ`.`NM_PARTIDO` AS `NM_PARTIDO`,
    `votacao_secao_2024_RJ`.`NR_VOTAVEL` AS `NR_VOTAVEL`,
    `votacao_secao_2024_RJ`.`NM_VOTAVEL` AS `NM_VOTAVEL`,
    sum(
        cast(`votacao_secao_2024_RJ`.`QT_VOTOS` as unsigned)
    ) AS `QT_VOTOS`
from `votacao_secao_2024_RJ`
group by `votacao_secao_2024_RJ`.`CD_MUNICIPIO`,
    `votacao_secao_2024_RJ`.`NM_MUNICIPIO`,
    `votacao_secao_2024_RJ`.`DS_CARGO`,
    `votacao_secao_2024_RJ`.`CD_CARGO`,
    `votacao_secao_2024_RJ`.`SG_PARTIDO`,
    `votacao_secao_2024_RJ`.`NM_PARTIDO`,
    `votacao_secao_2024_RJ`.`NR_VOTAVEL`,
    `votacao_secao_2024_RJ`.`NM_VOTAVEL`
order by `votacao_secao_2024_RJ`.`NM_MUNICIPIO`,
    `QT_VOTOS` desc;
/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */
;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */
;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */
;