<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Recherchessss</h1>
    <form>
        <input type="text" placeholder="Rechercher...">
        <button type="submit">Rechercher</button>
    </form>
    <?php

        require_once 'logbdd.php';

        $recherche = $_GET['recherche'] ?? '';

        $stmt = $pdo->prepare(
            "SELECT * FROM univers WHERE nom LIKE ?"
        );

        $stmt->execute(["%" . $recherche . "%"]);

        $univers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($univers as $u) {
            echo "<h2>" . htmlspecialchars($u['nom']) . "</h2>";
            echo "<p>Température : " . htmlspecialchars($u['temperature']) . " °C</p>";
            echo "<p>" . htmlspecialchars($u['info_complementaire']) . "</p>";
            echo "<p>ID vidéo : " . htmlspecialchars($u['id_video']) . "</p>";
        }
    ?>
    
</body>
</html>