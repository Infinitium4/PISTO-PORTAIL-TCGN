<?php

require_once 'logBDD.php';

$univers = [];

if (isset($_GET['recherche']) && $_GET['recherche'] !== '') {

    $recherche = $_GET['recherche'];

    $nom = $pdo->prepare(
        "SELECT * FROM univers WHERE nom LIKE :recherche"
    );

    $nom->execute([
        'recherche' => '%' . $recherche . '%'
    ]);

    $univers = $nom->fetchAll(PDO::FETCH_ASSOC);
}

?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Recherche</title>
    <link rel="stylesheet" href="css/style.css">

</head>

<body>

    <h1>Recherche</h1>

    <form method="GET">

        <input
            type="text"
            name="recherche"
            placeholder="Rechercher..."
        >

        <button type="submit">
            Rechercher
        </button>

    </form>


    <?php foreach ($univers as $u) { ?>

        <h2><?= htmlspecialchars($u['nom']) ?></h2>

        <p>
            Température :
            <?= htmlspecialchars($u['temperature']) ?> °C
        </p>

        <p>
            <?= htmlspecialchars($u['info_complementaire']) ?>
        </p>


    <?php } ?>


    <?php
    if (
        isset($_GET['recherche']) &&
        $_GET['recherche'] !== '' &&
        count($univers) === 0
    ) {
        echo "<p>Aucune planète trouvée.</p>";
    }
    ?>

</body>
</html>

