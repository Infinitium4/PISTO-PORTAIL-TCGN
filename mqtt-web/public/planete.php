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

<body>

    <main class="wiki">

        <a href="recherche.php" class="retour">
            ← Retour aux recherches
        </a>

        <h1>
            <?= htmlspecialchars($planete['nom']) ?>
        </h1>

        <section class="wiki-info">

            <h2>Informations générales</h2>
            <a> 
                <img src="images/<?= htmlspecialchars($planete['nom']) ?>.png" alt="<?= htmlspecialchars($planete['nom']) ?>">
            </a>

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

            <p>
                <?= htmlspecialchars($planete['info_complementaire']) ?>
            </p>

        </section>

    </main>

</body>

</html>
