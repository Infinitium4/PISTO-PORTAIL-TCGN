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


/*
|--------------------------------------------------------------------------
| Données envoyées au système multivers
|--------------------------------------------------------------------------
*/

$multiverseData = [];

foreach ($univers as $u) {

    $multiverseData[] = [

        'nom' => $u['nom'] ?? 'UNKNOWN',

        'dimension' =>
            $u['dimension'] ??
            'UNKNOWN',

    ];
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

    <title>
        INTERDIMENSIONAL DATABASE
    </title>

    <link
        rel="stylesheet"
        href="recherche.css"
    >

</head>


<body>


<!-- ========================================================= -->
<!-- BACKGROUND -->
<!-- ========================================================= -->

<div class="space-background">

    <div class="space-grid"></div>

    <div class="space-noise"></div>

</div>


<!-- ========================================================= -->
<!-- HEADER -->
<!-- ========================================================= -->

<header class="top-bar">

    <div class="brand">

        <span class="brand-symbol">
            ⦿
        </span>

        <div>

            <div class="brand-title">
                INTERDIMENSIONAL
            </div>

            <div class="brand-subtitle">
                PLANETARY DATABASE
            </div>

        </div>

    </div>


    <div class="system-state">

        <span
            class="state-dot"
            id="stateDot"
        ></span>

        <span id="systemStatus">
            SYSTEM STABLE
        </span>

    </div>


    <button
        class="fullscreen-button"
        id="fullscreenButton"
    >
        ⛶ FULLSCREEN
    </button>

</header>


<!-- ========================================================= -->
<!-- SEARCH -->
<!-- ========================================================= -->

<section class="search-zone">

    <form
        method="GET"
        class="search-form"
    >

        <span class="search-icon">
            ⌕
        </span>

        <input
            type="text"
            name="recherche"
            value="<?= isset($_GET['recherche']) ? htmlspecialchars($_GET['recherche']) : '' ?>"
            placeholder="SEARCH PLANETARY SIGNATURE..."
            autocomplete="off"
        >

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

</section>


<!-- ========================================================= -->
<!-- MAIN CONTROL CENTER -->
<!-- ========================================================= -->

<main class="control-center">


    <!-- ===================================================== -->
    <!-- LEFT PANEL -->
    <!-- ===================================================== -->

    <aside class="side-panel left-panel">

        <div class="panel-header">

            <span>
                DIMENSIONAL TELEMETRY
            </span>

            <span class="panel-status">
                LIVE
            </span>

        </div>


        <div class="telemetry-block">

            <div class="telemetry-title">
                COORDINATES
            </div>

            <div class="coordinate-row">

                <span>
                    X
                </span>

                <strong id="telemetryX">
                    000
                </strong>

            </div>

            <div class="coordinate-row">

                <span>
                    Y
                </span>

                <strong id="telemetryY">
                    000
                </strong>

            </div>

            <div class="coordinate-row">

                <span>
                    Z
                </span>

                <strong id="telemetryZ">
                    100
                </strong>

            </div>

        </div>


        <div class="telemetry-block">

            <div class="telemetry-title">
                MULTIVERSE STATUS
            </div>

            <div class="big-stat">

                <strong id="dimensionCount">
                    0
                </strong>

                <span>
                    DIMENSIONS
                </span>

            </div>

            <div class="big-stat">

                <strong id="activeRealities">
                    0
                </strong>

                <span>
                    ACTIVE REALITIES
                </span>

            </div>

            <div class="big-stat">

                <strong id="signatureCount">
                    0
                </strong>

                <span>
                    SIGNATURES
                </span>

            </div>

        </div>


        <div class="telemetry-block">

            <div class="telemetry-title">
                REALITY STABILITY
            </div>

            <div class="stability-number">

                <strong id="stabilityValue">
                    100%
                </strong>

            </div>

            <div class="stability-track">

                <div
                    class="stability-bar"
                    id="stabilityBar"
                ></div>

            </div>

        </div>


        <div class="danger-meter">

            <div class="danger-header">

                <span>
                    DANGEROMETRE
                </span>

                <strong id="dangerLevel">
                    LOW
                </strong>

            </div>

            <div class="danger-scale">

                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

    </aside>


    <!-- ===================================================== -->
    <!-- UNIVERSE VIEW -->
    <!-- ===================================================== -->

    <section class="universe-section">


        <div class="universe-title">

            <div>

                <span class="small-label">
                    DIMENSIONAL OBSERVATORY
                </span>

                <h1>
                    MULTIVERSE
                </h1>

            </div>


            <div class="dimension-core-status">

                <span class="core-pulse"></span>

                C-137 CORE ONLINE

            </div>

        </div>


        <div class="universe-wrapper">


            <canvas
                id="multiverseCanvas"
            ></canvas>


            <div class="scanlines"></div>

            <div class="crosshair"></div>


            <!-- CENTER HUD -->

            <div class="hud hud-top-left">

                SYSTEM
                <strong>
                    ONLINE
                </strong>

            </div>


            <div class="hud hud-top-right">

                SECTOR
                <strong>
                    C-137
                </strong>

            </div>


            <div class="hud hud-bottom-left">

                DRAG
                <strong>
                    NAVIGATE
                </strong>

            </div>


            <div class="hud hud-bottom-right">

                SCROLL
                <strong>
                    ZOOM
                </strong>

            </div>


            <!-- PORTAL -->

            <div
                class="portal-effect"
                id="portalEffect"
            >

                <div class="portal-ring ring-one"></div>
                <div class="portal-ring ring-two"></div>
                <div class="portal-ring ring-three"></div>

                <div class="portal-core">
                    PORTAL
                </div>

            </div>


            <!-- REALITY OVERLOAD -->

            <div
                class="reality-overload"
                id="realityOverload"
            >

                <div class="overload-text">

                    <span>
                        ⚠ REALITY BREACH ⚠
                    </span>

                    <strong>
                        DIMENSIONAL COLLAPSE
                    </strong>

                </div>

            </div>


        </div>


        <!-- ================================================= -->
        <!-- CONTROLS -->
        <!-- ================================================= -->

        <div class="controls">

            <button
                id="simulateButton"
                class="control-button primary"
            >
                <span>▶</span>
                SIMULATE MULTIVERSE
            </button>


            <button
                id="portalButton"
                class="control-button portal-button"
            >
                <span>◉</span>
                OPEN PORTAL
            </button>


            <button
                id="overloadButton"
                class="control-button danger-button"
            >
                <span>⚠</span>
                REALITY OVERLOAD
            </button>


            <button
                id="resetButton"
                class="control-button"
            >
                ↻ RESET
            </button>

        </div>

    </section>


    <!-- ===================================================== -->
    <!-- RIGHT PANEL -->
    <!-- ===================================================== -->

    <aside class="side-panel right-panel">


        <div class="panel-header">

            <span>
                QUANTUM TERMINAL
            </span>

            <span class="panel-status">
                LIVE
            </span>

        </div>


        <div
            class="terminal"
            id="terminal"
        >

            <div class="terminal-line">
                &gt; BOOTING INTERDIMENSIONAL SYSTEM...
            </div>

            <div class="terminal-line">
                &gt; INITIALIZING QUANTUM CORE...
            </div>

            <div class="terminal-line">
                &gt; WAITING FOR DATABASE...
            </div>

        </div>


        <div class="event-box">

            <div class="event-title">
                RANDOM EVENT
            </div>

            <div
                id="eventMessage"
                class="event-message"
            >
                NO EVENT DETECTED
            </div>

        </div>


        <div class="signal-box">

            <div class="signal-title">
                SIGNAL STRENGTH
            </div>

            <div class="signal-bars">

                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>


    </aside>

</main>


<!-- ========================================================= -->
<!-- PLANET POPUP -->
<!-- ========================================================= -->

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


    <div class="popup-header">

        <span class="popup-tag">
            PLANETARY SIGNATURE
        </span>

        <span class="popup-live">
            ● LIVE
        </span>

    </div>


    <div class="popup-name">

        <span id="popupName">
            UNKNOWN
        </span>

    </div>


    <div class="popup-data">

        <div>

            <span>
                DIMENSION
            </span>

            <strong id="popupDimension">
                UNKNOWN
            </strong>

        </div>


        <div>

            <span>
                COORDINATES
            </span>

            <strong id="popupCoordinates">
                000 / 000
            </strong>

        </div>


        <div>

            <span>
                STATUS
            </span>

            <strong id="popupStatus">
                STABLE
            </strong>

        </div>

    </div>


    <div class="popup-scan">

        <div class="scan-label">
            QUANTUM SCAN
        </div>

        <div class="scan-track">

            <div></div>

        </div>

    </div>


    <button
        class="open-planet"
        id="openPlanet"
    >
        OPEN DATABASE →
    </button>

</div>


<!-- ========================================================= -->
<!-- DATABASE RESULTS -->
<!-- ========================================================= -->

<section class="database-section">

    <div class="database-header">

        <div>

            <span class="small-label">
                DATABASE QUERY
            </span>

            <h2>
                PLANETARY RECORDS
            </h2>

        </div>

        <div class="record-count">

            <?= count($univers) ?>
            RECORD(S)

        </div>

    </div>


    <?php if (count($univers) > 0) { ?>

        <div class="planet-grid">

            <?php foreach ($univers as $u) { ?>

                <article class="planet-card">

                    <div class="planet-card-glow"></div>

                    <div class="planet-card-header">

                        <span>
                            SIGNATURE
                        </span>

                        <span>
                            #<?= str_pad((string) array_search($u, $univers) + 1, 3, '0', STR_PAD_LEFT) ?>
                        </span>

                    </div>


                    <h3>

                        <a
                            href="planete.php?nom=<?= urlencode($u['nom']) ?>"
                        >

                            <?= htmlspecialchars($u['nom']) ?>

                        </a>

                    </h3>


                    <div class="planet-card-info">

                        <span>
                            DIMENSION
                        </span>

                        <strong>

                            <?= htmlspecialchars($u['dimension']) ?>

                        </strong>

                    </div>


                    <a
                        class="planet-open"
                        href="planete.php?nom=<?= urlencode($u['nom']) ?>"
                    >

                        ACCESS RECORD →

                    </a>

                </article>

            <?php } ?>

        </div>

    <?php } else { ?>

        <div class="no-results">

            <div class="no-results-icon">
                ∅
            </div>

            <h3>
                NO PLANETARY SIGNATURE FOUND
            </h3>

            <p>
                Aucun signal correspondant à votre recherche.
            </p>

        </div>

    <?php } ?>

</section>


<!-- ========================================================= -->
<!-- JAVASCRIPT DATA -->
<!-- ========================================================= -->

<script>

    const multiversePlanets =
        <?= json_encode(
            $multiverseData,
            JSON_UNESCAPED_UNICODE |
            JSON_UNESCAPED_SLASHES
        ) ?>;

    console.log(
        "PHP : données multivers =",
        multiversePlanets
    );

</script>


<script src="multivers.js"></script>


</body>

</html>