<?php

try {
    $db = new PDO('pgsql:host=localhost;port=5432;dbname=postgres;user=postgres;password=postgres');

    $stmt = $db->prepare('INSERT INTO "TRACKS" ("CODE", "THUMBNAIL") VALUES (:trackCode, :thumbnail) RETURNING "ID"');
    $stmt->execute([
        'trackCode' => $_POST['trackCode'],
        'thumbnail' => $_POST['thumbnail']
    ]);

    $res = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($res);
} catch (\Throwable $th) {
    echo $th->getMessage();
}
