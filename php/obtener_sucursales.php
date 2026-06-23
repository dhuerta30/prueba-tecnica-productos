<?php

require 'conexion.php';

$id_bodega = (int)($_GET['id_bodega'] ?? 0);

$sql = "SELECT id,nombre
        FROM sucursales
        WHERE bodega_id = ?
        ORDER BY nombre";

$stmt = $pdo->prepare($sql);
$stmt->execute([$id_bodega]);

echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC)
);