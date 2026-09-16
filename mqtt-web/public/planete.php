<?php

require_once 'logBDD.php';

if (!isset($_GET['nom']) || $_GET['nom'] === '') {
    die("Planète introuvable.");
}

$nom = $_GET['nom'];

$stmt = $pdo->prepare(
    "SELECT * FROM univers WHERE nom = :nom"
);

$stmt->execute([
    'nom' => $nom
]);

$planete = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$planete) {
    die("Planète introuvable.");
}

?>

<!DOCTYPE html>
<html lang="fr">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><?= htmlspecialchars($planete['nom']) ?></title>

    <link rel="stylesheet" href="recherche.css">

</head>

<body >

    <script>
        const ws = new WebSocket("ws://172.16.89.41:3000");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const message = JSON.parse(data.message);

            console.error("Received data:", data);
            console.error("Received message:", message.action);

            if (message.action === "wiki-retour"){
                window.location.href = "/mqtt-web/public/";
            }
        };
    </script>
    <a href="recherche.php" class="retour">
        ← Retour aux recherches
    </a>
    <main class="wiki">
        <h1>
            <?= htmlspecialchars($planete['nom']) ?>
        </h1>

        <section class="wiki-info">
            <div>
                <img
                    class="image-planete"
                    src="images/<?= htmlspecialchars($planete['nom']) ?>.png"
                    alt="<?= htmlspecialchars($planete['nom']) ?>"
                >

                <div class="dangerometre">
                    <h2>Dangeromètre</h2>

                    <div class="danger-bar">
                        <div
                            class="danger-progress"
                            id="dangerProgress"
                            data-danger="<?= htmlspecialchars($planete['danger']) ?>"
                        ></div>
                    </div>

                    <p>
                        Niveau <span id="dangerLevel">0</span> / 5
                    </p>
                </div>
            </div>

            <div>

                <h2>Informations générales</h2>

                <p>
                    Température :
                    <?= htmlspecialchars($planete['temperature']) ?> °C
                </p>

                <p>
                    Cette planète se trouve dans la dimension :
                    <?= htmlspecialchars($planete['dimension']) ?>
                </p>

                <p>
                    Température en temps réel :
                    <?= htmlspecialchars($planete['temperature']) ?> °C
                </p>

                <p>
                    Température minimale :
                    <?= htmlspecialchars($planete['temperature_min']) ?> °C
                </p>

                <p>
                    Température maximale :
                    <?= htmlspecialchars($planete['temperature_max']) ?> °C
                </p>

                <h2>Description</h2>

                <p>
                    <?= nl2br(htmlspecialchars($planete['info_complementaire'])) ?>
                </p>


            </div>

        </section>

        <section class="planet-scanner">

            <div class="scanner-header">
                <span class="scanner-status-dot"></span>
                <span>RICK'S INTERDIMENSIONAL SCANNER</span>
                <span class="scanner-version">v1.0</span>
            </div>

            <div class="scanner-content">

                <!-- PLANÈTE -->
                <div class="planet-display">

                    <div class="scanner-ring ring-1"></div>
                    <div class="scanner-ring ring-2"></div>
                    <div class="scanner-ring ring-3"></div>

                    <div class="scan-line"></div>

                    <div class="planet">
                        <div class="planet-light"></div>
                    </div>

                    <div class="coordinates">
                        X: <span id="coordX">---</span><br>
                        Y: <span id="coordY">---</span><br>
                        Z: <span id="coordZ">---</span>
                    </div>

                </div>


                <!-- INFORMATIONS -->
                <div class="scanner-info">

                    <h2>SCAN DE PLANÈTE</h2>

                    <div class="target-name">
                        CIBLE :
                        <strong id="planetName">INCONNUE</strong>
                    </div>


                    <!-- TERMINAL -->
                    <div class="scanner-terminal">

                        <div id="scanText">
                            > Scanner prêt.<br>
                            > En attente d'une cible...
                        </div>

                    </div>


                    <!-- PROGRESSION -->
                    <div class="scan-progress-container">

                        <div class="scan-progress-bar">
                            <div
                                class="scan-progress"
                                id="scanProgress">
                            </div>
                        </div>

                        <span id="scanPercent">0%</span>

                    </div>


                    <!-- BOUTON -->
                    <button
                        class="scan-button"
                        id="scanButton"
                        onclick="startPlanetScan()">

                        ⚡ LANCER LE SCAN

                    </button>


                    <!-- RÉSULTATS -->
                    <div
                        class="scan-results"
                        id="scanResults">

                        <div class="result">
                            <span>ATMOSPHÈRE</span>
                            <strong id="atmosphere">---</strong>
                        </div>

                        <div class="result">
                            <span>POPULATION</span>
                            <strong id="population">---</strong>
                        </div>

                        <div class="result">
                            <span>FORMES DE VIE</span>
                            <strong id="lifeforms">---</strong>
                        </div>

                        <div class="result">
                            <span>STABILITÉ</span>
                            <strong id="stability">---</strong>
                        </div>

                        <div class="result danger-result">
                            <span>DANGER</span>
                            <strong id="danger">---</strong>
                        </div>

                    </div>

                </div>

            </div>

        </section>



    </main>
<script>
const progress = document.getElementById("dangerProgress");
const dangerLevel = document.getElementById("dangerLevel");

const danger = Number(progress.dataset.danger);

let niveau = 0;

setTimeout(() => {

    const animation = setInterval(() => {

        niveau += 0.05;

        if (niveau >= danger) {
            niveau = danger;
            clearInterval(animation);
        }

        const pourcentage = (niveau / 5) * 100;

        progress.style.width = pourcentage + "%";

        dangerLevel.textContent = Math.ceil(niveau);

    }, 30);

}, 500);
</script>

<script src="script.js"></script>

</body>

</html>
