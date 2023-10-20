<?php

try {
    $db = new PDO('pgsql:host=localhost;port=5432;dbname=postgres;user=postgres;password=postgres');

    $stmt = $db->prepare('SELECT "CODE", "THUMBNAIL" FROM "TRACKS" WHERE "ID" = :id');
    $stmt->execute(['id' => $_POST['id']]);

    $res = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($res);
} catch (\Throwable $th) {
    echo $th->getMessage();
}
