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
        require_once '/actionPHP/afficher.php';
        foreach ($univers as $u){?>

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

            <hr>
        <?php
        }?>
</body>
</html>