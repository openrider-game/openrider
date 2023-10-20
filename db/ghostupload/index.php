<?php

try {
    $db = new PDO('pgsql:host=localhost;port=5432;dbname=postgres;user=postgres;password=postgres');

    $stmt = $db->prepare('INSERT INTO "GHOSTS" ("GHOSTSTRING", "TRACKID", "TIME") VALUES (:ghostString, :trackId, :time) RETURNING "ID"');
    $stmt->execute([
        'ghostString' => $_POST['ghostString'],
        'trackId' => $_POST['trackId'],
        'time' => $_POST['time']
    ]);

    $res = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($res);
} catch (\Throwable $th) {
    echo $th->getMessage();
}
