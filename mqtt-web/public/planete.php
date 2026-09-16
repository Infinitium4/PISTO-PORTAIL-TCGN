<?php

require_once 'logBDD.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    die("Planète introuvable.");
}

$id = $_GET['id'];

$stmt = $pdo->prepare(
    "SELECT * FROM univers WHERE id = :id"
);

$stmt->execute([
    'id' => $id
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

    <link rel="stylesheet" href="style.css">

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

            <p>
                <strong>Température :</strong>
                <?= htmlspecialchars($planete['temperature']) ?> °C
            </p>

            <h2>Description</h2>

            <p>
                <?= nl2br(htmlspecialchars($planete['info_complementaire'])) ?>
            </p>

        </section>

    </main>

</body>

</html>