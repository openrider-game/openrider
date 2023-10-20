<html lang="en">

<head>
    <title>OpenRider</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
    <meta charset="UTF-8">
    <base href="/openrider/">
    <link rel="stylesheet" href="./style.css">
</head>

<body>
    <div id="content">
        <div id="game">
            <canvas data-play="openrider"></canvas>
        </div>
    </div>
    <script type="module">
        import { GAME } from "./bootstrap.js";

        GAME.newGame({<?= isset($_GET['track']) ? sprintf(' id: %s ', $_GET['track']) : '' ?>});
    </script>
</body>

</html>