-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 26 mars 2025 à 21:44
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `vtmap`
--

-- --------------------------------------------------------

--
-- Structure de la table `cas`
--

DROP TABLE IF EXISTS `cas`;
CREATE TABLE IF NOT EXISTS `cas` (
                                     `id` int NOT NULL AUTO_INCREMENT,
                                     `maladie_id` int NOT NULL,
                                     `region_id` int NOT NULL,
                                     `date_detection` date NOT NULL,
                                     `nombre_cas` int NOT NULL DEFAULT '1',
                                     PRIMARY KEY (`id`),
    KEY `maladie_id` (`maladie_id`),
    KEY `region_id` (`region_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `lieu_maladie`
--

DROP TABLE IF EXISTS `lieu_maladie`;
CREATE TABLE IF NOT EXISTS `lieu_maladie` (
                                              `id` int NOT NULL AUTO_INCREMENT,
                                              `maladie_id` int NOT NULL,
                                              `position_id` int NOT NULL,
                                              `nombre_cas` int NOT NULL DEFAULT '1',
                                              `date_maj` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                              PRIMARY KEY (`id`),
    KEY `maladie_id` (`maladie_id`),
    KEY `position_id` (`position_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `maladies`
--

DROP TABLE IF EXISTS `maladies`;
CREATE TABLE IF NOT EXISTS `maladies` (
                                          `id` int NOT NULL AUTO_INCREMENT,
                                          `nom` varchar(255) NOT NULL,
    `symptomes` text NOT NULL,
    `description` text NOT NULL,
    `niveau_contagion` int NOT NULL,
    PRIMARY KEY (`id`)
    ) ;

-- --------------------------------------------------------

--
-- Structure de la table `positions`
--

DROP TABLE IF EXISTS `positions`;
CREATE TABLE IF NOT EXISTS `positions` (
                                           `id` int NOT NULL AUTO_INCREMENT,
                                           `pays` varchar(100) NOT NULL,
    `ville` varchar(100) DEFAULT NULL,
    `position` point NOT NULL,
    PRIMARY KEY (`id`),
    SPATIAL KEY `position` (`position`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `regions`
--

DROP TABLE IF EXISTS `regions`;
CREATE TABLE IF NOT EXISTS `regions` (
                                         `id` int NOT NULL AUTO_INCREMENT,
                                         `nom` varchar(100) NOT NULL,
    `position_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `position_id` (`position_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
                                              `id` int NOT NULL AUTO_INCREMENT,
                                              `nom` varchar(60) NOT NULL,
    `prenom` varchar(60) NOT NULL,
    `email` varchar(100) NOT NULL,
    `mot_de_passe` varchar(255) NOT NULL,
    `date_inscription` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
