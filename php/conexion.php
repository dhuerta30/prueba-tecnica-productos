<?php

$host = "localhost";
$dbname = "prueba_productos";
$user = "root";
$pass = "";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            // CLAVE contra inyección sql
            PDO::ATTR_EMULATE_PREPARES => false,
            // asegura fetch más seguro por defecto (opcional pero recomendado)
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // evita múltiples queries en un prepare
            PDO::MYSQL_ATTR_MULTI_STATEMENTS => false
        ]
    );
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}