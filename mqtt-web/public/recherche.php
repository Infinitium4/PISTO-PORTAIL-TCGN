
<?php

require_once 'logBDD.php';

$univers = [];

if (isset($_GET['recherche']) && $_GET['recherche'] !== '') {

    $recherche = $_GET['recherche'];

    $stmt = $pdo->prepare(
        "SELECT * FROM univers WHERE nom LIKE :recherche"
    );

    $stmt->execute([
        'recherche' => '%' . $recherche . '%'
    ]);

    $univers = $stmt->fetchAll(PDO::FETCH_ASSOC);

} else {

    $stmt = $pdo->prepare(
        "SELECT * FROM univers"
    );

    $stmt->execute();

    $univers = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

?>

<!DOCTYPE html>
<html lang="fr">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Rick's Multiverse</title>

    <link rel="stylesheet" href="multivers.css">

</head>

<body>

    <div class="multiverse-app">

        <!-- =====================================================
             HEADER
        ====================================================== -->

        <header class="top-bar">

            <div class="logo">

                <span class="logo-dot"></span>

                <div>
                    <strong>RICK'S</strong>
                    <span>MULTIVERSE SYSTEM</span>
                </div>

            </div>

            <div class="system-status">

                <span class="status-dot"></span>

                MULTIVERSE ONLINE

            </div>

            <button
                class="fullscreen-button"
                id="fullscreenButton"
            >
                ⛶ FULLSCREEN
            </button>

        </header>


        <!-- =====================================================
             RECHERCHE
        ====================================================== -->

        <form
            class="search-bar"
            method="GET"
        >

            <div class="search-input">

                <span>⌕</span>

                <input
                    type="text"
                    name="recherche"
                    placeholder="Search dimension / planet..."
                    value="<?= isset($_GET['recherche'])
                        ? htmlspecialchars($_GET['recherche'])
                        : '' ?>"
                >

            </div>

            <button type="submit">
                SCAN
            </button>

            <button
                type="button"
                onclick="window.location.href='recherche.php'"
            >
                SHOW ALL
            </button>

        </form>


        <!-- =====================================================
             MULTIVERSE
        ====================================================== -->

        <main class="multiverse">

            <canvas id="multiverseCanvas"></canvas>

            <div class="scanlines"></div>

            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>


            <!-- TITRE -->

            <div class="universe-title">

                <span>INTERDIMENSIONAL NETWORK</span>

                <h1>MULTIVERSE</h1>

                <p>
                    REALITY VISUALIZATION SYSTEM
                </p>

            </div>


            <!-- PANNEAU GAUCHE -->

            <div class="side-panel left-panel">

                <div class="panel-title">
                    SYSTEM
                </div>

                <div class="system-line">
                    <span>STATUS</span>
                    <strong id="systemStatus">
                        STABLE
                    </strong>
                </div>

                <div class="system-line">
                    <span>DIMENSIONS</span>
                    <strong id="dimensionCount">
                        0
                    </strong>
                </div>

                <div class="system-line">
                    <span>SIGNATURES</span>
                    <strong id="signatureCount">
                        0
                    </strong>
                </div>

                <div class="system-line">
                    <span>STABILITY</span>
                    <strong id="stabilityValue">
                        100%
                    </strong>
                </div>

                <div class="stability-bar">

                    <div id="stabilityBar"></div>

                </div>

            </div>


            <!-- PANNEAU DROIT -->

            <div class="side-panel right-panel">

                <div class="panel-title">
                    TELEMETRY
                </div>

                <div class="telemetry-line">
                    <span>X</span>
                    <strong id="telemetryX">
                        000
                    </strong>
                </div>

                <div class="telemetry-line">
                    <span>Y</span>
                    <strong id="telemetryY">
                        000
                    </strong>
                </div>

                <div class="telemetry-line">
                    <span>Z</span>
                    <strong id="telemetryZ">
                        000
                    </strong>
                </div>

                <div class="telemetry-line">
                    <span>SECTOR</span>
                    <strong>
                        C-137
                    </strong>
                </div>

            </div>


            <!-- TERMINAL -->

            <div class="terminal">

                <div class="terminal-header">

                    <span class="terminal-dot"></span>

                    MULTIVERSE TERMINAL

                </div>

                <div
                    class="terminal-content"
                    id="terminal"
                >
                    > Booting Rick's Multiverse System...
                    <br>
                    > Connecting to interdimensional network...
                    <br>
                    > Loading planetary signatures...
                </div>

            </div>


            <!-- CONTROLES -->

            <div class="controls">

                <button
                    id="simulateButton"
                    class="main-control"
                >
                    ⚡ SIMULATE MULTIVERSE
                </button>

                <button
                    id="collapseButton"
                    class="danger-control"
                >
                    ⚠ MULTIVERSE COLLAPSE
                </button>

                <button
                    id="resetButton"
                    class="reset-control"
                >
                    ↻ RESET
                </button>

            </div>


            <!-- COMPTEUR -->

            <div class="dimension-counter">

                <span>ACTIVE REALITIES</span>

                <strong id="activeRealities">
                    0
                </strong>

            </div>


            <!-- AIDE -->

            <div class="help">

                DRAG = MOVE
                &nbsp;&nbsp;
                SCROLL = ZOOM
                &nbsp;&nbsp;
                CLICK = SELECT

            </div>


            <!-- POPUP PLANETE -->

            <div
                class="planet-popup"
                id="planetPopup"
            >

                <button
                    class="popup-close"
                    id="popupClose"
                >
                    ×
                </button>

                <div class="popup-label">
                    PLANETARY SIGNATURE
                </div>

                <h2 id="popupName">
                    UNKNOWN
                </h2>

                <div class="popup-data">

                    <div>
                        <span>DIMENSION</span>
                        <strong id="popupDimension">
                            ---
                        </strong>
                    </div>

                    <div>
                        <span>COORDINATES</span>
                        <strong id="popupCoordinates">
                            ---
                        </strong>
                    </div>

                    <div>
                        <span>STATUS</span>
                        <strong id="popupStatus">
                            STABLE
                        </strong>
                    </div>

                </div>

                <button
                    id="openPlanet"
                    class="open-planet"
                >
                    OPEN DATABASE →
                </button>

            </div>


            <!-- EFFET COLLAPSE -->

            <div
                id="collapseOverlay"
                class="collapse-overlay"
            >

                <div class="collapse-message">

                    <span>⚠</span>

                    <h2>
                        MULTIVERSE
                        COLLAPSE
                    </h2>

                    <p>
                        INTERDIMENSIONAL STABILITY CRITICAL
                    </p>

                    <strong id="collapsePercent">
                        4%
                    </strong>

                </div>

            </div>

        </main>


        <!-- =====================================================
             LISTE DES PLANETES
        ====================================================== -->

        <section class="planet-results">

            <?php foreach ($univers as $u) { ?>

                <div class="planete-card">

                    <h2>

                        <a
                            href="planete.php?nom=<?= urlencode($u['nom']) ?>"
                        >
                            <?= htmlspecialchars($u['nom']) ?>
                        </a>

                    </h2>

                    <div>

                        <strong>
                            Dimension :
                        </strong>

                        <?= htmlspecialchars($u['dimension']) ?>

                    </div>

                </div>

            <?php } ?>

            <?php

            if (
                isset($_GET['recherche']) &&
                $_GET['recherche'] !== '' &&
                count($univers) === 0
            ) {

                echo '<p class="no-results">
                        Aucune planète trouvée.
                      </p>';

            }

            ?>

        </section>

    </div>


    <!-- DONNEES PHP → JAVASCRIPT -->

    <script>

        const multiversePlanets =
            <?= json_encode(
                array_map(
                    function ($u) {

                        return [
                            'nom' => $u['nom'],
                            'dimension' => $u['dimension']
                        ];

                    },
                    $univers
                ),
                JSON_UNESCAPED_UNICODE |
                JSON_UNESCAPED_SLASHES
            ) ?>;

    </script>


    <script src="multivers.js"></script>

</body>

</html>

