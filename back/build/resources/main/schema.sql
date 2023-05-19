-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
-- Server version   8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE=`+00:00` */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE=`NO_AUTO_VALUE_ON_ZERO` */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `active_repo`
--
use rocketdan;

DROP TABLE IF EXISTS `battle_log`;
DROP TABLE IF EXISTS `personal_language`;
DROP TABLE IF EXISTS `repo_convention`;
DROP TABLE IF EXISTS `repo_history`;
DROP TABLE IF EXISTS `repomon_status`;
DROP TABLE IF EXISTS `user_language`;

ALTER TABLE `user` DROP FOREIGN KEY `FKj8tohyutmgrm550ik5uqcjt5p`;
DROP TABLE IF EXISTS `active_repo`;

DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `repo`;
DROP TABLE IF EXISTS `repomon`;

--
-- Table structure for table `user`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) DEFAULT NULL,
  `total_exp` bigint DEFAULT NULL,
  `represent_repo_id` bigint DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `repomon`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repomon` (
  `repomon_id` bigint NOT NULL,
  `repomon_name` varchar(255) DEFAULT NULL,
  `repomon_tier` int DEFAULT NULL,
  `repomon_url` varchar(255) DEFAULT NULL,
  `repomon_skill_name` varchar(255) DEFAULT NULL,
  `repomon_skill_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`repomon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `repo`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repo` (
  `repo_id` bigint NOT NULL AUTO_INCREMENT,
  `repo_name` varchar(255) DEFAULT NULL,
  `repo_owner` varchar(255) DEFAULT NULL,
  `repomon_nickname` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `repo_exp` bigint DEFAULT NULL,
  `repo_key` varchar(255) DEFAULT NULL,
  `repo_start` datetime(6) DEFAULT NULL,
  `repo_end` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `repomon_id` bigint DEFAULT NULL,
  PRIMARY KEY (`repo_id`),
  KEY `FKpsm3owav1yf3yy0erglcwxny1` (`repomon_id`),
  CONSTRAINT `FKpsm3owav1yf3yy0erglcwxny1` FOREIGN KEY (`repomon_id`) REFERENCES `repomon` (`repomon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `active_repo` (
  `active_repo_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `repo_id` bigint DEFAULT NULL,
  PRIMARY KEY (`active_repo_id`),
  KEY `FKm1doblmfnpr884wut43iqesnk` (`repo_id`),
  KEY `FKn0ptgbsjlv14pq0l7abe0ad24` (`user_id`),
  CONSTRAINT `FKm1doblmfnpr884wut43iqesnk` FOREIGN KEY (`repo_id`) REFERENCES `repo` (`repo_id`),
  CONSTRAINT `FKn0ptgbsjlv14pq0l7abe0ad24` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `repomon_status`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repomon_status` (
  `repo_id` bigint NOT NULL,
  `win_cnt` int DEFAULT NULL,
  `lose_cnt` int DEFAULT NULL,
  `atk_point` int DEFAULT NULL,
  `dodge_point` int DEFAULT NULL,
  `def_point` int DEFAULT NULL,
  `critical_point` int DEFAULT NULL,
  `hit_point` int DEFAULT NULL,
  `start_atk` int DEFAULT NULL,
  `start_dodge` int DEFAULT NULL,
  `start_def` int DEFAULT NULL,
  `start_critical` int DEFAULT NULL,
  `start_hit` int DEFAULT NULL,
  PRIMARY KEY (`repo_id`),
  CONSTRAINT `FK29wea0d7dop95b51x1vie94ny` FOREIGN KEY (`repo_id`) REFERENCES `repo` (`repo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `battle_log`
--

CREATE TABLE `battle_log` (
  `battle_log_id` bigint NOT NULL AUTO_INCREMENT,
  `is_win` bit(1) DEFAULT NULL,
  `attack_point` int DEFAULT NULL,
  `defense_point` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `attack_repo_id` bigint DEFAULT NULL,
  `defense_repo_id` bigint DEFAULT NULL,
  PRIMARY KEY (`battle_log_id`),
  KEY `FK5i3x8kow0x7clb4y1p5fkfudb` (`attack_repo_id`),
  KEY `FKises9i8jegoipubl87pc2olox` (`defense_repo_id`),
  CONSTRAINT `FK5i3x8kow0x7clb4y1p5fkfudb` FOREIGN KEY (`attack_repo_id`) REFERENCES `repomon_status` (`repo_id`),
  CONSTRAINT `FKises9i8jegoipubl87pc2olox` FOREIGN KEY (`defense_repo_id`) REFERENCES `repomon_status` (`repo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personal_language`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_language` (
  `personal_language_id` bigint NOT NULL AUTO_INCREMENT,
  `language_code` varchar(255) DEFAULT NULL,
  `repo_id` bigint DEFAULT NULL,
  PRIMARY KEY (`personal_language_id`),
  KEY `FKe0h1dyqfjp1yygssdnl3yjgtw` (`repo_id`),
  CONSTRAINT `FKe0h1dyqfjp1yygssdnl3yjgtw` FOREIGN KEY (`repo_id`) REFERENCES `repo` (`repo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `repo_convention`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repo_convention` (
  `repo_convention_id` bigint NOT NULL AUTO_INCREMENT,
  `repo_convention_type` varchar(255) DEFAULT NULL,
  `repo_convention_des` varchar(255) DEFAULT NULL,
  `repo_id` bigint DEFAULT NULL,
  PRIMARY KEY (`repo_convention_id`),
  KEY `FKgnbdoa79sxwcld4unps9u00a7` (`repo_id`),
  CONSTRAINT `FKgnbdoa79sxwcld4unps9u00a7` FOREIGN KEY (`repo_id`) REFERENCES `repo` (`repo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `repo_history`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repo_history` (
  `repo_history_id` bigint NOT NULL AUTO_INCREMENT,
  `repo_history_exp` bigint DEFAULT NULL,
  `repo_history_type` int DEFAULT NULL,
  `worked_at` date DEFAULT NULL,
  `repo_id` bigint DEFAULT NULL,
  PRIMARY KEY (`repo_history_id`),
  KEY `FKqfaaiykxip0w7t0cg4on1jll4` (`repo_id`),
  CONSTRAINT `FKqfaaiykxip0w7t0cg4on1jll4` FOREIGN KEY (`repo_id`) REFERENCES `repo` (`repo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_language`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_language` (
  `user_language_id` bigint NOT NULL AUTO_INCREMENT,
  `language_code` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`user_language_id`),
  KEY `FK5tj1u2cplnxdoiouqvmvy3ksp` (`user_id`),
  CONSTRAINT `FK5tj1u2cplnxdoiouqvmvy3ksp` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

ALTER TABLE `user`
ADD CONSTRAINT `FKj8tohyutmgrm550ik5uqcjt5p`
FOREIGN KEY (`represent_repo_id`) REFERENCES `active_repo` (`active_repo_id`);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
