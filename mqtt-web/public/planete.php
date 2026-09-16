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

<body style="overflow: hidden;">

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


</body>

</html>
