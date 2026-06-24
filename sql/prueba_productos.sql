-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.4.3 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS prueba_productos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE prueba_productos;

-- Volcando estructura para tabla prueba_productos.bodegas
CREATE TABLE IF NOT EXISTS `bodegas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Volcando datos para la tabla prueba_productos.bodegas: ~3 rows (aproximadamente)
INSERT INTO `bodegas` (`id`, `nombre`) VALUES
	(1, 'Bodega Central'),
	(2, 'Bodega Norte'),
	(3, 'Bodega Sur');

-- Volcando estructura para tabla prueba_productos.materiales
CREATE TABLE IF NOT EXISTS `materiales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

-- Volcando datos para la tabla prueba_productos.materiales: ~5 rows (aproximadamente)
INSERT INTO `materiales` (`id`, `nombre`) VALUES
	(1, 'Plástico'),
	(2, 'Metal'),
	(3, 'Madera'),
	(4, 'Vidrio'),
	(5, 'Cartón');

-- Volcando estructura para tabla prueba_productos.monedas
CREATE TABLE IF NOT EXISTS `monedas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Volcando datos para la tabla prueba_productos.monedas: ~3 rows (aproximadamente)
INSERT INTO `monedas` (`id`, `codigo`, `nombre`) VALUES
	(1, 'CLP', 'Peso Chileno'),
	(2, 'USD', 'Dólar Americano'),
	(3, 'EUR', 'Euro');

-- Volcando estructura para tabla prueba_productos.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(15) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `bodega_id` int NOT NULL,
  `sucursal_id` int NOT NULL,
  `moneda_id` int NOT NULL,
  `precio` decimal(12,2) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `fk_producto_bodega` (`bodega_id`),
  KEY `fk_producto_sucursal` (`sucursal_id`),
  KEY `fk_producto_moneda` (`moneda_id`),
  CONSTRAINT `fk_producto_bodega` FOREIGN KEY (`bodega_id`) REFERENCES `bodegas` (`id`),
  CONSTRAINT `fk_producto_moneda` FOREIGN KEY (`moneda_id`) REFERENCES `monedas` (`id`),
  CONSTRAINT `fk_producto_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

-- Volcando datos para la tabla prueba_productos.productos: ~1 rows (aproximadamente)
INSERT INTO `productos` (`id`, `codigo`, `nombre`, `bodega_id`, `sucursal_id`, `moneda_id`, `precio`, `descripcion`, `fecha_creacion`) VALUES
	(1, 'ft9823', 'clavo', 1, 2, 1, 400.00, 'drfgtyhjui', '2026-06-23 23:16:36');

-- Volcando estructura para tabla prueba_productos.producto_material
CREATE TABLE IF NOT EXISTS `producto_material` (
  `producto_id` int NOT NULL,
  `material_id` int NOT NULL,
  PRIMARY KEY (`producto_id`,`material_id`),
  KEY `fk_pm_material` (`material_id`),
  CONSTRAINT `fk_pm_material` FOREIGN KEY (`material_id`) REFERENCES `materiales` (`id`),
  CONSTRAINT `fk_pm_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Volcando datos para la tabla prueba_productos.producto_material: ~0 rows (aproximadamente)
INSERT INTO `producto_material` (`producto_id`, `material_id`) VALUES
	(1, 2),
	(1, 3);

-- Volcando estructura para tabla prueba_productos.sucursales
CREATE TABLE IF NOT EXISTS `sucursales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bodega_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sucursal_bodega` (`bodega_id`),
  CONSTRAINT `fk_sucursal_bodega` FOREIGN KEY (`bodega_id`) REFERENCES `bodegas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

-- Volcando datos para la tabla prueba_productos.sucursales: ~5 rows (aproximadamente)
INSERT INTO `sucursales` (`id`, `bodega_id`, `nombre`) VALUES
	(1, 1, 'Sucursal Santiago'),
	(2, 1, 'Sucursal Providencia'),
	(3, 2, 'Sucursal Antofagasta'),
	(4, 2, 'Sucursal Calama'),
	(5, 3, 'Sucursal Puerto Montt');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
