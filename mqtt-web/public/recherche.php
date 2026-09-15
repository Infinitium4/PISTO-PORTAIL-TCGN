```php
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recherche</title>
</head>

<body>

    <h1>Recherches</h1>

    <form method="GET">
        <input 
            type="text" 
            name="recherche" 
            placeholder="Rechercher..."
        >
        <button type="submit">Rechercher</button>
    </form>

    <?php

    require_once '/actionPHP/logbdd.php';

    if (isset($_GET['recherche']) && $_GET['recherche'] != '') {

        $recherche = $_GET['recherche'];

        $stmt = $pdo->prepare(
            "SELECT * FROM univers WHERE nom LIKE ?"
        );

        $stmt->execute(["%" . $recherche . "%"]);

        $univers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($univers as $u) {
    ?>

            <h2><?= htmlspecialchars($u['nom']) ?></h2>

            <p>
                Température :
                <?= htmlspecialchars($u['temperature']) ?> °C
            </p>

            <p>
                <?= htmlspecialchars($u['info_complementaire']) ?>
            </p>

            <p>
                ID vidéo :
                <?= htmlspecialchars($u['id_video']) ?>
            </p>

    <?php
        }

        if (count($univers) == 0) {
            echo "<p>Aucune planète trouvée.</p>";
        }
    }

    ?>

</body>
</html>
```
