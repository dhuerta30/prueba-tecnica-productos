<?php

header('Content-Type: application/json');
require 'conexion.php';

try {

    $codigo = trim($_POST['codigo'] ?? '');
    $nombre = trim($_POST['nombre'] ?? '');
    $bodega = (int)($_POST['bodega'] ?? 0);
    $sucursal = (int)($_POST['sucursal'] ?? 0);
    $moneda = (int)($_POST['moneda'] ?? 0);
    $precio = trim($_POST['precio'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    $materiales = $_POST['materiales'] ?? [];
    
    // validaciones
    if ($codigo === '') {
        throw new Exception(
            'El código del producto no puede estar en blanco.'
        );
    }

    if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/', $codigo)) {
        throw new Exception(
            'El código del producto debe contener letras y números.'
        );
    }

    if (strlen($codigo) < 5 || strlen($codigo) > 15) {
        throw new Exception(
            'El código del producto debe tener entre 5 y 15 caracteres.'
        );
    }
    
    if ($nombre === '') {
        throw new Exception(
            'El nombre del producto no puede estar en blanco.'
        );
    }

    if (strlen($nombre) < 2 || strlen($nombre) > 50) {
        throw new Exception(
            'El nombre del producto debe tener entre 2 y 50 caracteres.'
        );
    }

    if ($bodega <= 0) {
        throw new Exception(
            'Debe seleccionar una bodega.'
        );
    }

    if ($sucursal <= 0) {
        throw new Exception(
            'Debe seleccionar una sucursal para la bodega seleccionada.'
        );
    }

    if ($moneda <= 0) {
        throw new Exception(
            'Debe seleccionar una moneda para el producto.'
        );
    }

    if ($precio === '') {
        throw new Exception(
            'El precio del producto no puede estar en blanco.'
        );
    }

    if (!preg_match('/^\d+(\.\d{1,2})?$/', $precio)) {
        throw new Exception(
            'El precio del producto debe ser un número positivo con hasta dos decimales.'
        );
    }

    if (count($materiales) < 2) {
        throw new Exception(
            'Debe seleccionar al menos dos materiales para el producto.'
        );
    }

    if ($descripcion === '') {
        throw new Exception(
            'La descripción del producto no puede estar en blanco.'
        );
    }

    if (
        strlen($descripcion) < 10 ||
        strlen($descripcion) > 1000
    ) {
        throw new Exception(
            'La descripción debe tener entre 10 y 1000 caracteres.'
        );
    }

    // validar código único
    $sql = "
        SELECT COUNT(*)
        FROM productos
        WHERE codigo = ?
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$codigo]);

    if ($stmt->fetchColumn() > 0) {

        throw new Exception(
            'El código del producto ya está registrado.'
        );
    }

    // transaccion
    $pdo->beginTransaction();

    $sql = "
        INSERT INTO productos
        (
            codigo,
            nombre,
            bodega_id,
            sucursal_id,
            moneda_id,
            precio,
            descripcion
        )
        VALUES
        (
            ?, ?, ?, ?, ?, ?, ?
        )
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $codigo,
        $nombre,
        $bodega,
        $sucursal,
        $moneda,
        $precio,
        $descripcion
    ]);
    $productoId = $pdo->lastInsertId();

    // guardar materiales
    $sqlMaterial = "
        INSERT INTO producto_material
        (
            producto_id,
            material_id
        )
        VALUES
        (
            ?, ?
        )
    ";

    $stmtMaterial = $pdo->prepare($sqlMaterial);
    foreach ($materiales as $materialId) {
        $stmtMaterial->execute([
            $productoId,
            $materialId
        ]);
    }

    $pdo->commit();
    echo json_encode([
        'success' => true,
        'message' => 'Producto guardado correctamente.'
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}