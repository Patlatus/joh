# --------------------------------------------------------
# Host:                         127.0.0.1
# Server version:               5.5.25a
# Server OS:                    Win64
# HeidiSQL version:             6.0.0.3603
# Date/time:                    2013-03-01 16:46:36
# --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

# Dumping database structure for stickers /*!40100 DEFAULT CHARACTER SET utf8 */
/* CREATE DATABASE IF NOT EXISTS `stickers` ;
USE `stickers`;*/


# Dumping structure for table stickers.stickers
CREATE TABLE IF NOT EXISTS `stickers` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `hashtag` text NOT NULL,
  `text` text,
  `title` text,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

# Dumping data for table stickers.stickers: ~3 rows (approximately)
/*!40000 ALTER TABLE `stickers` DISABLE KEYS */;
INSERT INTO `stickers` (`hashtag`, `text`, `title`, `x`, `y`) VALUES
	('default', '<a href="http://freemail.ukr.net" target="_blank">ukr.net</a><br><a href="https://accounts.google.com" target="_blank">Gmail</a><br><a href="http://mail.yahoo.com" target="_blank">Yahoo</a><br><a href="http://www.i.ua/" target="_blank">i.ua</a><br><a href="http://mail.ru/" target="_blank">Mail.ru</a>', 'Пошта', 257, 0),
	('0', '<a href="http://poperedzennya.blogspot.com/" target="_blank">Укра╖нською мовою</a><br><a href="http://www.thewarningsecondcoming.com/" target="_blank">Англ╕йською мовою</a><br>', '╤рландськ╕ послання', 1178, 568);
/*!40000 ALTER TABLE `stickers` ENABLE KEYS */;


# Dumping structure for table stickers.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# Dumping data for table stickers.users: ~0 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
