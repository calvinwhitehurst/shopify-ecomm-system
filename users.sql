-- MySQL dump 10.13  Distrib 5.7.32, for Linux (x86_64)
--
-- Host: localhost    Database: controlcenter
-- ------------------------------------------------------
-- Server version	5.7.32-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` char(60) NOT NULL,
  `roles` char(1) NOT NULL,
  `lastLogin` varchar(30) NOT NULL,
  `picture` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=746 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (10,'david','$2a$10$XdmCHF3iWWx5HCsw5k8n.On.6pJIi96ZB1hUEIsQugmgwKhe9alzi','2','September 25th 2020, 11:31 pm','undefined-1576178124671.jpg'),(13,'orange','$2a$10$RxAisS75rGNBwcSLPGzrhuFHKcGpmdegBr4rob1owJZQgXxZuYOX.','0','November 10th 2020, 4:11 pm','matt.jpg'),(14,'calvin','$2a$10$bkkq8wcB/6xizJBqZZ8lPelffzq2ZMAQNuXZvcnOZ5DssM/2j.LGy','2','November 12th 2020, 1:52 pm','undefined-1599169421808.jpg'),(15,'John','$2a$10$W37J1QQtoVvlVHjWa1Ek3edZV.qREwjESUJ6DAUe2/NhC00KIbd3e','1','October 20th 2020, 12:39 pm','matt.jpg'),(16,'michael','$2a$10$eIMkiU8GImxyMECP6LitG.RDHC6zFUMAXb5t4FeoqVdIvUB60rr8y','1','November 12th 2020, 2:10 pm','undefined-1599159722635.jpg'),(18,'anna','$2a$10$0LcmWfRqTTYzbi..8QhsOeh6YhkKhzW.pnY86gjvP16T20EQUJ4HK','1','November 10th 2020, 5:56 am','undefined-1600971858043.jpeg'),(19,'kristina','$2a$10$3fmkuW4ub2sCpPnOfg4Fpemuu0cElX/w1jDlmGW4fRn7hMdQXGf9C','1','January 28th 2020, 7:54 pm','matt.jpg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-12 16:01:42
