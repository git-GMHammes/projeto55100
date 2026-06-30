/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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

CREATE TABLE IF NOT EXISTS `mandatario_RJ` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `candidato_2022_RJ_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `candidato_2024_RJ_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cargo_politico` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suplente_candidato_RJ_id` bigint DEFAULT NULL,
  `ocupa_instituicao` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cargo_instituicao` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `partido_politico` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_politico` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dt_nascimento` date DEFAULT NULL,
  `municipio_mandato` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qtd_votos_2022` bigint DEFAULT NULL,
  `qtd_votos_2024` bigint DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidato_2022_RJ_id_candidato_2024_RJ` (`candidato_2022_RJ_id`,`candidato_2024_RJ_id`) USING BTREE,
  KEY `supernte_de_id` (`suplente_candidato_RJ_id`) USING BTREE,
  KEY `FK_mandatario_RJ_candidato_2024_RJ` (`candidato_2024_RJ_id`),
  CONSTRAINT `FK_mandatario_RJ_candidato_2022_RJ` FOREIGN KEY (`candidato_2022_RJ_id`) REFERENCES `candidato_2022_RJ` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `FK_mandatario_RJ_candidato_2024_RJ` FOREIGN KEY (`candidato_2024_RJ_id`) REFERENCES `candidato_2024_RJ` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `FK_mandatario_RJ_mandatario_RJ` FOREIGN KEY (`suplente_candidato_RJ_id`) REFERENCES `mandatario_RJ` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `municipio_ibge_tse` (
  `cd_ibge` char(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cd_tse` char(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nm_cidade` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`cd_ibge`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `municipio_RJ` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cd_ibge` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cd_tse` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_cidade` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aniversario_cidade` date DEFAULT NULL,
  `prefeito_mandatario_RJ_id` bigint DEFAULT NULL,
  `vice_prefeito` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vice_dt_nascimento` date DEFAULT NULL,
  `primeira_dama` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primeira_dama_dt_nascimento` date DEFAULT NULL,
  `festa_popular` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prefeito_candidato_RJ_id` (`prefeito_mandatario_RJ_id`) USING BTREE,
  CONSTRAINT `FK_municipio_RJ_candidato_RJ` FOREIGN KEY (`prefeito_mandatario_RJ_id`) REFERENCES `mandatario_RJ` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `partidos_2022_RJ` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `NR_PARTIDO` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SG_PARTIDO` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NM_PARTIDO` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `partidos_2024_RJ` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `NR_PARTIDO` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SG_PARTIDO` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NM_PARTIDO` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_action_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL COMMENT 'NULL = ação anônima ou de sistema',
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ex: user.login, user.create, profile.update',
  `entity` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tabela/entidade afetada',
  `entity_id` int unsigned DEFAULT NULL COMMENT 'ID do registro afetado',
  `old_value` json DEFAULT NULL COMMENT 'Estado anterior (auditoria)',
  `new_value` json DEFAULT NULL COMMENT 'Estado novo (auditoria)',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_al_user_id` (`user_id`),
  KEY `idx_al_action` (`action`),
  KEY `idx_al_entity` (`entity`,`entity_id`),
  KEY `idx_al_created_at` (`created_at`),
  CONSTRAINT `fk_al_user` FOREIGN KEY (`user_id`) REFERENCES `user_users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_password_reset_tokens` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `token_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SHA-256 do token enviado por e-mail',
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'E-mail no momento da solicitação',
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_prt_token_hash` (`token_hash`),
  KEY `idx_prt_user_id` (`user_id`),
  KEY `idx_prt_expires_at` (`expires_at`),
  CONSTRAINT `fk_prt_user` FOREIGN KEY (`user_id`) REFERENCES `user_users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permissions` json DEFAULT NULL COMMENT 'Array de permissões concedidas ao perfil',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1=ativo 0=inativo',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_profiles_slug` (`slug`),
  KEY `idx_profiles_status` (`status`),
  KEY `idx_profiles_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `profile_id` int unsigned DEFAULT NULL,
  `username` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'bcrypt ou argon2id',
  `status` enum('active','inactive','blocked') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_username` (`username`),
  KEY `idx_users_profile_id` (`profile_id`),
  KEY `idx_users_status` (`status`),
  KEY `idx_users_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_users_profile` FOREIGN KEY (`profile_id`) REFERENCES `user_profiles` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_user_data` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cpf` varbinary(255) DEFAULT NULL COMMENT 'AES_ENCRYPT — nunca em texto puro',
  `birth_date` date DEFAULT NULL,
  `gender` enum('M','F','NB','ND') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ND=não declarado',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_street` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_complement` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_neighborhood` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_state` char(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_zipcode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgpd_consent_at` datetime DEFAULT NULL COMMENT 'Momento do consentimento LGPD',
  `lgpd_consent_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'IP no momento do consentimento (IPv6-safe)',
  `data_retention_until` date DEFAULT NULL COMMENT 'Data limite de retenção dos dados',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_data_user_id` (`user_id`),
  KEY `idx_user_data_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_user_data_user` FOREIGN KEY (`user_id`) REFERENCES `user_users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `view_candidato_2022_RJ` (
	`ID` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`CD_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NR_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`SG_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`QT_VOTOS_NOMINAIS_VALIDOS` DECIMAL(43,0) NULL
) ENGINE=MyISAM;

CREATE TABLE `view_candidato_2024_RJ` (
	`ID` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`CD_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NR_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`SG_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`QT_VOTOS_NOMINAIS_VALIDOS` DECIMAL(43,0) NULL
) ENGINE=MyISAM;

CREATE TABLE `view_municipio_RJ` (
	`id` BIGINT NOT NULL,
	`mn_cd_ibge` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`mn_cd_tse` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`mn_nome_cidade` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`mn_aniversario_cidade` DATE NULL,
	`mn_prefeito_mandatario_RJ_id` BIGINT NULL,
	`mn_vice_prefeito` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`mn_vice_dt_nascimento` DATE NULL,
	`mn_primeira_dama` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`mn_primeira_dama_dt_nascimento` DATE NULL,
	`mn_festa_popular` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`mn_dt_festa_popular` DATE NULL,
	`mn_populacao` BIGINT NULL,
	`mn_eleitores` BIGINT NULL,
	`mn_densidade_demografica` DECIMAL(10,2) NULL COMMENT 'hab/km²',
	`mn_crescimento_populacional` DECIMAL(5,2) NULL COMMENT '% anual',
	`mn_populacao_urbana` BIGINT NULL COMMENT 'urbano total',
	`mn_populacao_rural` BIGINT NULL COMMENT 'rural total',
	`mn_pib_municipal` DECIMAL(15,2) NULL COMMENT 'milhões R$',
	`mn_pib_per_capita` DECIMAL(12,2) NULL COMMENT 'R$/habitante',
	`mn_receita_orcamentaria` DECIMAL(15,2) NULL COMMENT 'R$ total',
	`mn_despesa_orcamentaria` DECIMAL(15,2) NULL COMMENT 'R$ total',
	`mn_arrecadacao_propria` DECIMAL(15,2) NULL COMMENT 'ISS+IPTU+ITBI',
	`mn_empresas_ativas` INT NULL COMMENT 'qtd empresas',
	`mn_empregos_formais` INT NULL COMMENT 'vínculos ativos',
	`mn_idhm` DECIMAL(5,4) NULL COMMENT '0-1',
	`mn_indice_gini` DECIMAL(5,4) NULL COMMENT '0-1',
	`mn_percentual_pobres` DECIMAL(5,2) NULL COMMENT '% pobres',
	`mn_bolsa_familia_benef` INT NULL COMMENT 'beneficiários',
	`mn_ideb_anos_iniciais` DECIMAL(4,2) NULL COMMENT 'fundamental I',
	`mn_ideb_anos_finais` DECIMAL(4,2) NULL COMMENT 'fundamental II',
	`mn_taxa_analfabetismo` DECIMAL(5,2) NULL COMMENT '% >15a',
	`mn_matriculas_creche` INT NULL COMMENT '0-3 anos',
	`mn_distorcao_idade_serie` DECIMAL(5,2) NULL COMMENT '% distorção',
	`mn_mortalidade_infantil` DECIMAL(5,2) NULL COMMENT 'por mil',
	`mn_cobertura_saude_familia` DECIMAL(5,2) NULL COMMENT '% cobertura',
	`mn_leitos_por_habitante` DECIMAL(6,2) NULL COMMENT 'por mil hab',
	`mn_esperanca_vida` DECIMAL(4,1) NULL COMMENT 'anos',
	`mn_acesso_agua_tratada` DECIMAL(5,2) NULL COMMENT '% domicílios',
	`mn_acesso_esgoto` DECIMAL(5,2) NULL COMMENT '% domicílios',
	`mn_coleta_lixo_adequada` DECIMAL(5,2) NULL COMMENT '% domicílios',
	`mn_acesso_internet` DECIMAL(5,2) NULL COMMENT '% domicílios',
	`mn_deficit_habitacional` INT NULL COMMENT 'moradias falta',
	`mn_superlotacao` DECIMAL(5,2) NULL COMMENT '% domicílios',
	`mn_favelas_subnormais` INT NULL COMMENT 'aglomerados',
	`mn_taxa_homicidios` DECIMAL(8,2) NULL COMMENT 'por 100mil',
	`mn_num_roubos_furtos` INT NULL COMMENT 'ano/anterior',
	`mn_area_vegetacao` DECIMAL(12,2) NULL COMMENT 'hectares',
	`mn_risco_enchente` TINYINT(1) NULL COMMENT 'tem risco?',
	`mn_data_emancipacao` DATE NULL COMMENT 'dd/mm/aaaa',
	`mn_area_territorial` DECIMAL(12,2) NULL COMMENT 'km²',
	`created_at` TIMESTAMP NOT NULL,
	`updated_at` TIMESTAMP NULL,
	`deleted_at` DATETIME NULL,
	`md_id` BIGINT NULL,
	`md_candidato_2022_RJ_id` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_candidato_2024_RJ_id` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_cargo_politico` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_suplente_candidato_RJ_id` BIGINT NULL,
	`md_ocupa_instituicao` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_cargo_instituicao` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_partido_politico` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_nome_politico` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_dt_nascimento` DATE NULL,
	`md_municipio_mandato` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_whatsapp` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_youtube` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_facebook` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_instagram` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`md_email` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`mn_created_at` TIMESTAMP NOT NULL,
	`mn_updated_at` TIMESTAMP NULL,
	`mn_deleted_at` DATETIME NULL
) ENGINE=MyISAM;

CREATE TABLE `view_partidos_2022_RJ` (
	`SG_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci'
) ENGINE=MyISAM;

CREATE TABLE `view_partidos_2024_RJ` (
	`SG_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci'
) ENGINE=MyISAM;

CREATE TABLE `view_votacao_candidato_munzona_2022_RJ_group` (
	`ID` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`CD_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`DS_CARGO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NR_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_SOCIAL_CANDIDATO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`QT_VOTOS_NOMINAIS` DECIMAL(43,0) NULL,
	`DS_SIT_TOT_TURNO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci'
) ENGINE=MyISAM;

CREATE TABLE `view_votacao_candidato_munzona_2024_RJ_group` (
	`ID` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`CD_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`DS_CARGO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`SG_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NR_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`QT_VOTOS` DECIMAL(43,0) NULL
) ENGINE=MyISAM;

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
	`QT_VOTOS_NOMINAIS` DECIMAL(43,0) NULL,
	`DS_SIT_TOT_TURNO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci'
) ENGINE=MyISAM;

CREATE TABLE `view_votos_municipio_2024_RJ` (
	`ID` BIGINT UNSIGNED NOT NULL,
	`CD_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_MUNICIPIO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`DS_CARGO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`CD_CARGO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`SG_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_PARTIDO` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NR_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`NM_VOTAVEL` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`QT_VOTOS` DECIMAL(43,0) NULL
) ENGINE=MyISAM;

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

CREATE TABLE IF NOT EXISTS `votacao_secao_2024_RJ` (
  `id` int NOT NULL AUTO_INCREMENT,
  `DT_GERACAO` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `HH_GERACAO` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ANO_ELEICAO` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CD_TIPO_ELEICAO` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_TIPO_ELEICAO` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NR_TURNO` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CD_ELEICAO` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DS_ELEICAO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DT_ELEICAO` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TP_ABRANGENCIA` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SG_UF` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SG_UE` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_UE` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CD_MUNICIPIO` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_MUNICIPIO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NR_ZONA` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NR_SECAO` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CD_CARGO` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DS_CARGO` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SG_PARTIDO` varchar(505) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_PARTIDO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NR_VOTAVEL` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_VOTAVEL` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `QT_VOTOS` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NR_LOCAL_VOTACAO` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SQ_CANDIDATO` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NM_LOCAL_VOTACAO` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DS_LOCAL_VOTACAO_ENDERECO` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3407821 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `view_candidato_2022_RJ`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_candidato_2022_RJ` AS select concat(`votacao_candidato_munzona_2022_RJ`.`ANO_ELEICAO`,'.',`votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO`,'.',`votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO`) AS `ID`,`votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO` AS `CD_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO` AS `NR_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO` AS `NM_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,`votacao_candidato_munzona_2022_RJ`.`NM_PARTIDO` AS `NM_PARTIDO`,sum(cast(`votacao_candidato_munzona_2022_RJ`.`QT_VOTOS_NOMINAIS_VALIDOS` as unsigned)) AS `QT_VOTOS_NOMINAIS_VALIDOS` from `votacao_candidato_munzona_2022_RJ` group by `votacao_candidato_munzona_2022_RJ`.`ANO_ELEICAO`,`votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`SG_PARTIDO`,`votacao_candidato_munzona_2022_RJ`.`NM_PARTIDO` order by `votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO`;

DROP TABLE IF EXISTS `view_candidato_2024_RJ`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_candidato_2024_RJ` AS select concat(`votacao_secao_2024_RJ`.`ANO_ELEICAO`,'.',`votacao_secao_2024_RJ`.`CD_MUNICIPIO`,'.',`votacao_secao_2024_RJ`.`NR_VOTAVEL`,'.',row_number() OVER (ORDER BY `votacao_secao_2024_RJ`.`NR_VOTAVEL` ) ) AS `ID`,`votacao_secao_2024_RJ`.`CD_MUNICIPIO` AS `CD_MUNICIPIO`,`votacao_secao_2024_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,`votacao_secao_2024_RJ`.`NR_VOTAVEL` AS `NR_VOTAVEL`,`votacao_secao_2024_RJ`.`NM_VOTAVEL` AS `NM_VOTAVEL`,`votacao_secao_2024_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,`votacao_secao_2024_RJ`.`NM_PARTIDO` AS `NM_PARTIDO`,sum(cast(`votacao_secao_2024_RJ`.`QT_VOTOS` as unsigned)) AS `QT_VOTOS_NOMINAIS_VALIDOS` from `votacao_secao_2024_RJ` group by `votacao_secao_2024_RJ`.`ANO_ELEICAO`,`votacao_secao_2024_RJ`.`CD_MUNICIPIO`,`votacao_secao_2024_RJ`.`NM_MUNICIPIO`,`votacao_secao_2024_RJ`.`NR_VOTAVEL`,`votacao_secao_2024_RJ`.`NM_VOTAVEL`,`votacao_secao_2024_RJ`.`SG_PARTIDO`,`votacao_secao_2024_RJ`.`NM_PARTIDO` order by `votacao_secao_2024_RJ`.`NM_MUNICIPIO`,`votacao_secao_2024_RJ`.`NM_VOTAVEL`;

DROP TABLE IF EXISTS `view_municipio_RJ`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_municipio_RJ` AS select `mn`.`id` AS `id`,`mn`.`cd_ibge` AS `mn_cd_ibge`,`mn`.`cd_tse` AS `mn_cd_tse`,`mn`.`nome_cidade` AS `mn_nome_cidade`,`mn`.`aniversario_cidade` AS `mn_aniversario_cidade`,`mn`.`prefeito_mandatario_RJ_id` AS `mn_prefeito_mandatario_RJ_id`,`mn`.`vice_prefeito` AS `mn_vice_prefeito`,`mn`.`vice_dt_nascimento` AS `mn_vice_dt_nascimento`,`mn`.`primeira_dama` AS `mn_primeira_dama`,`mn`.`primeira_dama_dt_nascimento` AS `mn_primeira_dama_dt_nascimento`,`mn`.`festa_popular` AS `mn_festa_popular`,`mn`.`dt_festa_popular` AS `mn_dt_festa_popular`,`mn`.`populacao` AS `mn_populacao`,`mn`.`eleitores` AS `mn_eleitores`,`mn`.`densidade_demografica` AS `mn_densidade_demografica`,`mn`.`crescimento_populacional` AS `mn_crescimento_populacional`,`mn`.`populacao_urbana` AS `mn_populacao_urbana`,`mn`.`populacao_rural` AS `mn_populacao_rural`,`mn`.`pib_municipal` AS `mn_pib_municipal`,`mn`.`pib_per_capita` AS `mn_pib_per_capita`,`mn`.`receita_orcamentaria` AS `mn_receita_orcamentaria`,`mn`.`despesa_orcamentaria` AS `mn_despesa_orcamentaria`,`mn`.`arrecadacao_propria` AS `mn_arrecadacao_propria`,`mn`.`empresas_ativas` AS `mn_empresas_ativas`,`mn`.`empregos_formais` AS `mn_empregos_formais`,`mn`.`idhm` AS `mn_idhm`,`mn`.`indice_gini` AS `mn_indice_gini`,`mn`.`percentual_pobres` AS `mn_percentual_pobres`,`mn`.`bolsa_familia_benef` AS `mn_bolsa_familia_benef`,`mn`.`ideb_anos_iniciais` AS `mn_ideb_anos_iniciais`,`mn`.`ideb_anos_finais` AS `mn_ideb_anos_finais`,`mn`.`taxa_analfabetismo` AS `mn_taxa_analfabetismo`,`mn`.`matriculas_creche` AS `mn_matriculas_creche`,`mn`.`distorcao_idade_serie` AS `mn_distorcao_idade_serie`,`mn`.`mortalidade_infantil` AS `mn_mortalidade_infantil`,`mn`.`cobertura_saude_familia` AS `mn_cobertura_saude_familia`,`mn`.`leitos_por_habitante` AS `mn_leitos_por_habitante`,`mn`.`esperanca_vida` AS `mn_esperanca_vida`,`mn`.`acesso_agua_tratada` AS `mn_acesso_agua_tratada`,`mn`.`acesso_esgoto` AS `mn_acesso_esgoto`,`mn`.`coleta_lixo_adequada` AS `mn_coleta_lixo_adequada`,`mn`.`acesso_internet` AS `mn_acesso_internet`,`mn`.`deficit_habitacional` AS `mn_deficit_habitacional`,`mn`.`superlotacao` AS `mn_superlotacao`,`mn`.`favelas_subnormais` AS `mn_favelas_subnormais`,`mn`.`taxa_homicidios` AS `mn_taxa_homicidios`,`mn`.`num_roubos_furtos` AS `mn_num_roubos_furtos`,`mn`.`area_vegetacao` AS `mn_area_vegetacao`,`mn`.`risco_enchente` AS `mn_risco_enchente`,`mn`.`data_emancipacao` AS `mn_data_emancipacao`,`mn`.`area_territorial` AS `mn_area_territorial`,`mn`.`created_at` AS `created_at`,`mn`.`updated_at` AS `updated_at`,`mn`.`deleted_at` AS `deleted_at`,`md`.`id` AS `md_id`,`md`.`candidato_2022_RJ_id` AS `md_candidato_2022_RJ_id`,`md`.`candidato_2024_RJ_id` AS `md_candidato_2024_RJ_id`,`md`.`cargo_politico` AS `md_cargo_politico`,`md`.`suplente_candidato_RJ_id` AS `md_suplente_candidato_RJ_id`,`md`.`ocupa_instituicao` AS `md_ocupa_instituicao`,`md`.`cargo_instituicao` AS `md_cargo_instituicao`,`md`.`partido_politico` AS `md_partido_politico`,`md`.`nome_politico` AS `md_nome_politico`,`md`.`dt_nascimento` AS `md_dt_nascimento`,`md`.`municipio_mandato` AS `md_municipio_mandato`,`md`.`whatsapp` AS `md_whatsapp`,`md`.`youtube` AS `md_youtube`,`md`.`facebook` AS `md_facebook`,`md`.`instagram` AS `md_instagram`,`md`.`email` AS `md_email`,`mn`.`created_at` AS `mn_created_at`,`mn`.`updated_at` AS `mn_updated_at`,`mn`.`deleted_at` AS `mn_deleted_at` from (`municipio_RJ` `mn` left join `mandatario_RJ` `md` on((`md`.`id` = `mn`.`prefeito_mandatario_RJ_id`)));

DROP TABLE IF EXISTS `view_partidos_2022_RJ`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_partidos_2022_RJ` AS select distinct `votacao_candidato_munzona_2022_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,`votacao_candidato_munzona_2022_RJ`.`NM_PARTIDO` AS `NM_PARTIDO` from `votacao_candidato_munzona_2022_RJ` where (`votacao_candidato_munzona_2022_RJ`.`SG_PARTIDO` is not null) order by `votacao_candidato_munzona_2022_RJ`.`SG_PARTIDO`;

DROP TABLE IF EXISTS `view_partidos_2024_RJ`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_partidos_2024_RJ` AS select distinct `votacao_secao_2024_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,`votacao_secao_2024_RJ`.`NM_PARTIDO` AS `NM_PARTIDO` from `votacao_secao_2024_RJ` where (`votacao_secao_2024_RJ`.`SG_PARTIDO` is not null) order by `votacao_secao_2024_RJ`.`SG_PARTIDO`;

DROP TABLE IF EXISTS `view_votacao_candidato_munzona_2022_RJ_group`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_votacao_candidato_munzona_2022_RJ_group` AS select concat('2022',`votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO`) AS `ID`,`votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO` AS `CD_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`DS_CARGO` AS `DS_CARGO`,`votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO` AS `NR_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO` AS `NM_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`NM_SOCIAL_CANDIDATO` AS `NM_SOCIAL_CANDIDATO`,sum(cast(`votacao_candidato_munzona_2022_RJ`.`QT_VOTOS_NOMINAIS` as unsigned)) AS `QT_VOTOS_NOMINAIS`,`votacao_candidato_munzona_2022_RJ`.`DS_SIT_TOT_TURNO` AS `DS_SIT_TOT_TURNO` from `votacao_candidato_munzona_2022_RJ` group by `votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`DS_CARGO`,`votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`NM_SOCIAL_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`DS_SIT_TOT_TURNO`;

DROP TABLE IF EXISTS `view_votacao_candidato_munzona_2024_RJ_group`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_votacao_candidato_munzona_2024_RJ_group` AS select concat('2024',`votacao_secao_2024_RJ`.`NR_VOTAVEL`,`votacao_secao_2024_RJ`.`CD_MUNICIPIO`) AS `ID`,`votacao_secao_2024_RJ`.`CD_MUNICIPIO` AS `CD_MUNICIPIO`,`votacao_secao_2024_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,`votacao_secao_2024_RJ`.`DS_CARGO` AS `DS_CARGO`,`votacao_secao_2024_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,`votacao_secao_2024_RJ`.`NM_PARTIDO` AS `NM_PARTIDO`,`votacao_secao_2024_RJ`.`NR_VOTAVEL` AS `NR_VOTAVEL`,`votacao_secao_2024_RJ`.`NM_VOTAVEL` AS `NM_VOTAVEL`,sum(cast(`votacao_secao_2024_RJ`.`QT_VOTOS` as unsigned)) AS `QT_VOTOS` from `votacao_secao_2024_RJ` group by `votacao_secao_2024_RJ`.`CD_MUNICIPIO`,`votacao_secao_2024_RJ`.`NM_MUNICIPIO`,`votacao_secao_2024_RJ`.`DS_CARGO`,`votacao_secao_2024_RJ`.`SG_PARTIDO`,`votacao_secao_2024_RJ`.`NM_PARTIDO`,`votacao_secao_2024_RJ`.`NR_VOTAVEL`,`votacao_secao_2024_RJ`.`NM_VOTAVEL` order by `QT_VOTOS` desc;

DROP TABLE IF EXISTS `view_votos_municipio_2022_RJ`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_votos_municipio_2022_RJ` AS select row_number() OVER (ORDER BY `votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO`,sum(cast(`votacao_candidato_munzona_2022_RJ`.`QT_VOTOS_NOMINAIS` as unsigned)) desc )  AS `ID`,`votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO` AS `CD_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`DS_CARGO` AS `DS_CARGO`,`votacao_candidato_munzona_2022_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,`votacao_candidato_munzona_2022_RJ`.`NM_PARTIDO` AS `NM_PARTIDO`,`votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO` AS `NR_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO` AS `NM_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`NM_SOCIAL_CANDIDATO` AS `NM_SOCIAL_CANDIDATO`,sum(cast(`votacao_candidato_munzona_2022_RJ`.`QT_VOTOS_NOMINAIS` as unsigned)) AS `QT_VOTOS_NOMINAIS`,`votacao_candidato_munzona_2022_RJ`.`DS_SIT_TOT_TURNO` AS `DS_SIT_TOT_TURNO` from `votacao_candidato_munzona_2022_RJ` group by `votacao_candidato_munzona_2022_RJ`.`CD_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO`,`votacao_candidato_munzona_2022_RJ`.`DS_CARGO`,`votacao_candidato_munzona_2022_RJ`.`SG_PARTIDO`,`votacao_candidato_munzona_2022_RJ`.`NM_PARTIDO`,`votacao_candidato_munzona_2022_RJ`.`NR_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`NM_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`NM_SOCIAL_CANDIDATO`,`votacao_candidato_munzona_2022_RJ`.`DS_SIT_TOT_TURNO` order by `votacao_candidato_munzona_2022_RJ`.`NM_MUNICIPIO`,`QT_VOTOS_NOMINAIS` desc;

DROP TABLE IF EXISTS `view_votos_municipio_2024_RJ`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_votos_municipio_2024_RJ` AS select row_number() OVER (ORDER BY `votacao_secao_2024_RJ`.`NM_MUNICIPIO`,sum(cast(`votacao_secao_2024_RJ`.`QT_VOTOS` as unsigned)) desc )  AS `ID`,`votacao_secao_2024_RJ`.`CD_MUNICIPIO` AS `CD_MUNICIPIO`,`votacao_secao_2024_RJ`.`NM_MUNICIPIO` AS `NM_MUNICIPIO`,`votacao_secao_2024_RJ`.`DS_CARGO` AS `DS_CARGO`,`votacao_secao_2024_RJ`.`CD_CARGO` AS `CD_CARGO`,`votacao_secao_2024_RJ`.`SG_PARTIDO` AS `SG_PARTIDO`,`votacao_secao_2024_RJ`.`NM_PARTIDO` AS `NM_PARTIDO`,`votacao_secao_2024_RJ`.`NR_VOTAVEL` AS `NR_VOTAVEL`,`votacao_secao_2024_RJ`.`NM_VOTAVEL` AS `NM_VOTAVEL`,sum(cast(`votacao_secao_2024_RJ`.`QT_VOTOS` as unsigned)) AS `QT_VOTOS` from `votacao_secao_2024_RJ` group by `votacao_secao_2024_RJ`.`CD_MUNICIPIO`,`votacao_secao_2024_RJ`.`NM_MUNICIPIO`,`votacao_secao_2024_RJ`.`DS_CARGO`,`votacao_secao_2024_RJ`.`CD_CARGO`,`votacao_secao_2024_RJ`.`SG_PARTIDO`,`votacao_secao_2024_RJ`.`NM_PARTIDO`,`votacao_secao_2024_RJ`.`NR_VOTAVEL`,`votacao_secao_2024_RJ`.`NM_VOTAVEL` order by `votacao_secao_2024_RJ`.`NM_MUNICIPIO`,`QT_VOTOS` desc;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
