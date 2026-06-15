/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `candidato_2022_RJ`;
CREATE TABLE IF NOT EXISTS `candidato_2022_RJ` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `NR_MUNICIPIO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_MUNICIPIO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NR_CANDIDATO` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_CANDIDATO` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SG_PARTIDO` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_PARTIDO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `QT_VOTOS_NOMINAIS_VALIDOS` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Votos nominais válidos por candidato/município — Eleições 2022 RJ';

DROP TABLE IF EXISTS `candidato_2024_RJ`;
CREATE TABLE IF NOT EXISTS `candidato_2024_RJ` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `NR_MUNICIPIO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_MUNICIPIO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NR_CANDIDATO` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_CANDIDATO` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SG_PARTIDO` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_PARTIDO` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `QT_VOTOS_NOMINAIS_VALIDOS` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Votos nominais válidos por candidato/município — Eleições 2024 RJ';

DROP TABLE IF EXISTS `candidato_RJ`;
CREATE TABLE IF NOT EXISTS `candidato_RJ` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `candidato_2022_RJ_id` bigint DEFAULT NULL,
  `candidato_2024_RJ_id` bigint DEFAULT NULL,
  `cargo_politico` varchar(50) DEFAULT NULL,
  `suplente_candidato_RJ_id` int DEFAULT NULL,
  `ocupa_instituicao` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cargo_instituicao` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `partido_politico` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nome_politico` varchar(200) DEFAULT NULL,
  `dt_nascimento` date DEFAULT NULL,
  `municipio_mandato` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `whatsapp` varchar(50) DEFAULT NULL,
  `youtube` varchar(200) DEFAULT NULL,
  `facebook` varchar(200) DEFAULT NULL,
  `instagram` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidato_2022_RJ_id_candidato_2024_RJ` (`candidato_2022_RJ_id`,`candidato_2024_RJ_id`) USING BTREE,
  KEY `supernte_de_id` (`suplente_candidato_RJ_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `municipio_ibge_tse`;
CREATE TABLE IF NOT EXISTS `municipio_ibge_tse` (
  `cd_ibge` char(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cd_tse` char(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nm_cidade` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`cd_ibge`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `municipio_rj`;
CREATE TABLE IF NOT EXISTS `municipio_rj` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cd_ibge` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cd_tse` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_cidade` varchar(200) DEFAULT NULL,
  `aniversario_cidade` date DEFAULT NULL,
  `prefeito_candidato_RJ_id` bigint DEFAULT NULL,
  `vice_prefeito` varchar(200) DEFAULT NULL,
  `vice_dt_nascimento` date DEFAULT NULL,
  `primeira_dama` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `primeira_dama_dt_nascimento` date DEFAULT NULL,
  `festa_popular` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dt_festa_popular` date DEFAULT NULL,
  `populacao` bigint DEFAULT NULL,
  `eleitores` bigint DEFAULT NULL,
  `densidade_demografica` decimal(10,2) DEFAULT NULL COMMENT 'hab/km²',
  `crescimento_populacional` decimal(5,2) DEFAULT NULL COMMENT '% anual',
  `populacao_urbana` bigint DEFAULT NULL COMMENT 'urbano total',
  `populacao_rural` bigint DEFAULT NULL COMMENT 'rural total',
  `pib_municipal` decimal(15,2) DEFAULT NULL COMMENT 'milhões R$',
  `pib_per_capita` decimal(12,2) DEFAULT NULL COMMENT 'R$/habitante',
  `receita_orcamentaria` decimal(15,2) DEFAULT NULL COMMENT 'R$ total',
  `despesa_orcamentaria` decimal(15,2) DEFAULT NULL COMMENT 'R$ total',
  `arrecadacao_propria` decimal(15,2) DEFAULT NULL COMMENT 'ISS+IPTU+ITBI',
  `empresas_ativas` int DEFAULT NULL COMMENT 'qtd empresas',
  `empregos_formais` int DEFAULT NULL COMMENT 'vínculos ativos',
  `idhm` decimal(5,4) DEFAULT NULL COMMENT '0-1',
  `indice_gini` decimal(5,4) DEFAULT NULL COMMENT '0-1',
  `percentual_pobres` decimal(5,2) DEFAULT NULL COMMENT '% pobres',
  `bolsa_familia_benef` int DEFAULT NULL COMMENT 'beneficiários',
  `ideb_anos_iniciais` decimal(4,2) DEFAULT NULL COMMENT 'fundamental I',
  `ideb_anos_finais` decimal(4,2) DEFAULT NULL COMMENT 'fundamental II',
  `taxa_analfabetismo` decimal(5,2) DEFAULT NULL COMMENT '% >15a',
  `matriculas_creche` int DEFAULT NULL COMMENT '0-3 anos',
  `distorcao_idade_serie` decimal(5,2) DEFAULT NULL COMMENT '% distorção',
  `mortalidade_infantil` decimal(5,2) DEFAULT NULL COMMENT 'por mil',
  `cobertura_saude_familia` decimal(5,2) DEFAULT NULL COMMENT '% cobertura',
  `leitos_por_habitante` decimal(6,2) DEFAULT NULL COMMENT 'por mil hab',
  `esperanca_vida` decimal(4,1) DEFAULT NULL COMMENT 'anos',
  `acesso_agua_tratada` decimal(5,2) DEFAULT NULL COMMENT '% domicílios',
  `acesso_esgoto` decimal(5,2) DEFAULT NULL COMMENT '% domicílios',
  `coleta_lixo_adequada` decimal(5,2) DEFAULT NULL COMMENT '% domicílios',
  `acesso_internet` decimal(5,2) DEFAULT NULL COMMENT '% domicílios',
  `deficit_habitacional` int DEFAULT NULL COMMENT 'moradias falta',
  `superlotacao` decimal(5,2) DEFAULT NULL COMMENT '% domicílios',
  `favelas_subnormais` int DEFAULT NULL COMMENT 'aglomerados',
  `taxa_homicidios` decimal(8,2) DEFAULT NULL COMMENT 'por 100mil',
  `num_roubos_furtos` int DEFAULT NULL COMMENT 'ano/anterior',
  `area_vegetacao` decimal(12,2) DEFAULT NULL COMMENT 'hectares',
  `risco_enchente` tinyint(1) DEFAULT NULL COMMENT 'tem risco?',
  `data_emancipacao` date DEFAULT NULL COMMENT 'dd/mm/aaaa',
  `area_territorial` decimal(12,2) DEFAULT NULL COMMENT 'km²',
  PRIMARY KEY (`id`),
  KEY `prefeito_candidato_RJ_id` (`prefeito_candidato_RJ_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `partidos_2022_RJ`;
CREATE TABLE IF NOT EXISTS `partidos_2022_RJ` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `NR_PARTIDO` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `SG_PARTIDO` varchar(50) NOT NULL,
  `NM_PARTIDO` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `partidos_2024_RJ`;
CREATE TABLE IF NOT EXISTS `partidos_2024_RJ` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `NR_PARTIDO` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `SG_PARTIDO` varchar(50) NOT NULL,
  `NM_PARTIDO` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `votacao_candidato_munzona_2022_RJ`;
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
) ENGINE=InnoDB AUTO_INCREMENT=476350 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Votação por candidato/município/zona com resultado — Eleições 2022 RJ';

DROP TABLE IF EXISTS `votacao_secao_2024_RJ`;
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
) ENGINE=InnoDB AUTO_INCREMENT=3407821 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
