```php
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

} else {

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


    <!-- ============================= -->
    <!-- RECHERCHE -->
    <!-- ============================= -->

    <form method="GET">

        <input
            type="text"
            name="recherche"
            placeholder="Rechercher..."
            value="<?= isset($_GET['recherche']) ? htmlspecialchars($_GET['recherche']) : '' ?>"
        >

        <button type="submit">
            Rechercher
        </button>

        <button
            type="button"
            onclick="window.location.href='recherche.php'"
        >
            Show All
        </button>

    </form>


    <!-- ============================= -->
    <!-- RADAR INTERDIMENSIONNEL -->
    <!-- ============================= -->

    <section class="interdimensional-radar">

        <div class="radar-header">

            <div class="radar-title">

                <span class="radar-status"></span>

                <span>
                    RICK'S INTERDIMENSIONAL RADAR
                </span>

            </div>

            <span class="radar-version">
                v1.0
            </span>

        </div>


        <div class="radar-container">

            <!-- RADAR -->

            <div class="radar">

                <div class="radar-grid"></div>

                <div class="radar-circle circle-1"></div>
                <div class="radar-circle circle-2"></div>
                <div class="radar-circle circle-3"></div>

                <div class="radar-cross horizontal"></div>
                <div class="radar-cross vertical"></div>


                <!-- Ligne de balayage -->

                <div class="radar-sweep"></div>


                <!-- Centre -->

                <div class="radar-center">
                    +
                </div>


                <!-- Signatures générées par JS -->

                <div
                    class="radar-signatures"
                    id="radarSignatures"
                ></div>

            </div>


            <!-- INFORMATIONS RADAR -->

            <div class="radar-info">

                <div class="radar-info-title">
                    INTERDIMENSIONAL SCAN
                </div>


                <div class="radar-stat">

                    <span>
                        STATUT
                    </span>

                    <strong>
                        ONLINE
                    </strong>

                </div>


                <div class="radar-stat">

                    <span>
                        SIGNATURES
                    </span>

                    <strong id="signatureCount">
                        0
                    </strong>

                </div>


                <div class="radar-stat">

                    <span>
                        SECTEUR
                    </span>

                    <strong>
                        C-137
                    </strong>

                </div>


                <div class="radar-terminal">

                    <div id="radarTerminal">

                        > Initialisation du radar...<br>
                        > Connexion au réseau interdimensionnel...<br>
                        > Recherche de signatures...

                    </div>

                </div>


                <div class="radar-legend">

                    <div>
                        <span class="legend-dot"></span>
                        Planète détectée
                    </div>

                    <div>
                        <span class="legend-center"></span>
                        Position actuelle
                    </div>

                </div>

            </div>

        </div>

    </section>


    <!-- ============================= -->
    <!-- PLANÈTES -->
    <!-- ============================= -->

    <section class="planet-list">

        <?php foreach ($univers as $u) { ?>

            <div class="planete-card">

                <h2>

                    <a
                        href="planete.php?nom=<?= urlencode($u['nom']) ?>"
                    >
                        <?= htmlspecialchars($u['nom']) ?>
                    </a>

                </h2>


                <div class="planete-info">

                    <div class="info">

                        <strong>
                            Dimension :
                        </strong>

                        <span>
                            <?= htmlspecialchars($u['dimension']) ?>
                        </span>

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

            echo '<p class="aucune-planete">
                    Aucune planète trouvée.
                  </p>';

        }

        ?>

    </section>


    <!-- ============================= -->
    <!-- DONNÉES POUR LE RADAR -->
    <!-- ============================= -->

    <script>
        const radarPlanets = <?= json_encode(
            array_map(
                function ($u) {
                    return [
                        'nom' => $u['nom'],
                        'dimension' => $u['dimension']
                    ];
                },
                $univers,
                JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
            )
        ) ?>;
    </script>


    <!-- ============================= -->
    <!-- JAVASCRIPT DU RADAR -->
    <!-- ============================= -->

    <script src="radar.js"></script>

</body>

</html>