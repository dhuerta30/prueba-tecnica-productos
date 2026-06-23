<?php

require 'conexion.php';

$codigo = trim($_POST['codigo'] ?? '');

$sql = "SELECT COUNT(*) total
        FROM productos
        WHERE codigo = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$codigo]);

$total = $stmt->fetchColumn();

echo json_encode([
    'existe' => $total > 0
]);