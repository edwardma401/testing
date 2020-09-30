/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50631
 Source Host           : localhost:3306
 Source Schema         : covid19

 Target Server Type    : MySQL
 Target Server Version : 50631
 File Encoding         : 65001

 Date: 26/09/2020 13:44:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for data
-- ----------------------------
DROP TABLE IF EXISTS `data`;
CREATE TABLE `data` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `country` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `Lat` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `Lon` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `country_code` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `province` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `city_code` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `cases` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `stat_date` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `Recovered` int(11) DEFAULT NULL,
  `Deaths` int(11) DEFAULT NULL,
  `Confirmed` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

SET FOREIGN_KEY_CHECKS = 1;
