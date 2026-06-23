<?php

require 'conexion.php';

$sql = "SELECT id,nombre
        FROM bodegas
        ORDER BY nombre";

$stmt = $pdo->query($sql);

echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC)
);