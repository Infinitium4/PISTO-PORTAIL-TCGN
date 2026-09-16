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
else { 
    $nom = $pdo->prepare( 
        "SELECT * FROM univers" 
    ); 
 
    $nom->execute(); 
 
    $univers = $nom->fetchAll(PDO::FETCH_ASSOC); 
} 
 
?> 
 
<!DOCTYPE html> 
<html lang="fr"> 
 
<head> 
    <meta charset="UTF-8"> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
 
    <title>Wiki Planètes</title> 
    <link rel="stylesheet" href="recherche.css"> 
 
</head> 
 
<body> 
 
    <h1>Wiki Planètes</h1> 
 
    <form method="GET"> 
 
        <input 
            type="text" 
            name="recherche" 
            placeholder="Rechercher..." 
        > 
 
        <button type="submit"> 
            Rechercher 
        </button> 
 
        <button type="button" onclick="window.location.href='recherche.php'"> 
            Show All 
        </button> 
 
    </form> 
 
 
    <?php foreach ($univers as $u) { ?> 
 
        <div class="planete-card"> 
 
            <h2> 
                <a href="planete.php?nom=<?= urlencode($u['nom']) ?>"> 
                    <?= htmlspecialchars($u['nom']) ?> 
                </a> 
            </h2> 
 
            <div class="planete-info"> 
 
                <div class="info"> 
                    <strong>Dimension :</strong> 
                    <span><?= htmlspecialchars($u['dimension']) ?></span> 
                </div> 
 
                <div class="info description"> 
                    <strong>Informations complémentaires :</strong> 
                    <span><?= htmlspecialchars($u['info_complementaire']) ?></span> 
                </div> 
 
            </div> 
 
        </div> 
 
    <?php } ?> 
 
 
    <?php 
    if ( 
        isset($_GET['recherche']) && 
        $_GET['recherche'] !== '' && 
        count($univers) === 0 
    ) { 
        echo '<p class="aucune-planete">Aucune planète trouvée.</p>'; 
    } 
    ?> 
 
</body> 
</html>