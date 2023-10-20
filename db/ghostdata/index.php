<?php

try {
    $db = new PDO('pgsql:host=localhost;port=5432;dbname=postgres;user=postgres;password=postgres');

    $stmt = $db->prepare('SELECT "GHOSTSTRING" FROM "GHOSTS" WHERE "TRACKID" = :trackId AND "ID" = :id');
    $stmt->execute([
        'trackId' => $_POST['trackId'],
        'id' => $_POST['id']
    ]);

    $res = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($res);
} catch (\Throwable $th) {
    echo $th->getMessage();
}
