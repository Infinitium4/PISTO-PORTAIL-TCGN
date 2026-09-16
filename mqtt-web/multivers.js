document.addEventListener("DOMContentLoaded", () => {

    const canvas =
        document.getElementById("multiverseCanvas");

    const ctx =
        canvas.getContext("2d");

    const terminal =
        document.getElementById("terminal");

    const dimensionCount =
        document.getElementById("dimensionCount");

    const signatureCount =
        document.getElementById("signatureCount");

    const activeRealities =
        document.getElementById("activeRealities");

    const systemStatus =
        document.getElementById("systemStatus");

    const stabilityValue =
        document.getElementById("stabilityValue");

    const stabilityBar =
        document.getElementById("stabilityBar");

    const telemetryX =
        document.getElementById("telemetryX");

    const telemetryY =
        document.getElementById("telemetryY");

    const telemetryZ =
        document.getElementById("telemetryZ");

    const popup =
        document.getElementById("planetPopup");

    const popupName =
        document.getElementById("popupName");

    const popupDimension =
        document.getElementById("popupDimension");

    const popupCoordinates =
        document.getElementById("popupCoordinates");

    const popupStatus =
        document.getElementById("popupStatus");

    const openPlanet =
        document.getElementById("openPlanet");

    const popupClose =
        document.getElementById("popupClose");

    const simulateButton =
        document.getElementById("simulateButton");

    const collapseButton =
        document.getElementById("collapseButton");

    const resetButton =
        document.getElementById("resetButton");

    const collapseOverlay =
        document.getElementById("collapseOverlay");

    const collapsePercent =
        document.getElementById("collapsePercent");

    const fullscreenButton =
        document.getElementById("fullscreenButton");


    /* =====================================================
       DONNEES
    ===================================================== */

    const planets =
        Array.isArray(multiversePlanets)
            ? multiversePlanets
            : [];


    let nodes = [];

    let particles = [];

    let camera = {
        x: 0,
        y: 0,
        zoom: 1
    };

    let selectedPlanet = null;

    let dragging = false;

    let lastMouse = {
        x: 0,
        y: 0
    };

    let simulationRunning = false;

    let collapseRunning = false;

    let stability = 100;


    /* =====================================================
       CANVAS
    ===================================================== */

    function resizeCanvas() {

        const rect =
            canvas.getBoundingClientRect();

        canvas.width =
            rect.width * window.devicePixelRatio;

        canvas.height =
            rect.height * window.devicePixelRatio;

        ctx.setTransform(
            window.devicePixelRatio,
            0,
            0,
            window.devicePixelRatio,
            0,
            0
        );

    }

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    resizeCanvas();


    /* =====================================================
       GENERATION DES PLANETES
    ===================================================== */

    function createNodes() {

        nodes = [];

        planets.forEach((planet, index) => {

            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                80 +
                Math.random() *
                650;

            nodes.push({

                planet: planet,

                x:
                    Math.cos(angle) *
                    distance,

                y:
                    Math.sin(angle) *
                    distance,

                radius:
                    3 +
                    Math.random() * 3,

                pulse:
                    Math.random() *
                    Math.PI *
                    2,

                speed:
                    0.01 +
                    Math.random() * 0.025,

                active: true

            });

        });

        dimensionCount.textContent =
            nodes.length;

        signatureCount.textContent =
            nodes.length;

        activeRealities.textContent =
            nodes.length;

    }


    /* =====================================================
       PARTICULES
    ===================================================== */

    function createParticles() {

        particles = [];

        for (
            let i = 0;
            i < 500;
            i++
        ) {

            particles.push({

                x:
                    (Math.random() - 0.5) *
                    2500,

                y:
                    (Math.random() - 0.5) *
                    1800,

                size:
                    Math.random() * 1.5,

                opacity:
                    Math.random(),

                speed:
                    Math.random() * 0.2

            });

        }

    }


    /* =====================================================
       COORDONNEES
    ===================================================== */

    function updateTelemetry() {

        telemetryX.textContent =
            Math.floor(
                camera.x
            ).toString()
            .padStart(3, "0");

        telemetryY.textContent =
            Math.floor(
                camera.y
            ).toString()
            .padStart(3, "0");

        telemetryZ.textContent =
            Math.floor(
                camera.zoom * 100
            ).toString()
            .padStart(3, "0");

    }


    /* =====================================================
       TERMINAL
    ===================================================== */

    function log(message) {

        terminal.innerHTML +=
            "<br>> " + message;

        terminal.scrollTop =
            terminal.scrollHeight;

    }


    /* =====================================================
       TRANSFORMATION MONDE → ECRAN
    ===================================================== */

    function worldToScreen(node) {

        const width =
            canvas.clientWidth;

        const height =
            canvas.clientHeight;

        return {

            x:
                width / 2 +
                (node.x + camera.x) *
                camera.zoom,

            y:
                height / 2 +
                (node.y + camera.y) *
                camera.zoom

        };

    }


    /* =====================================================
       DESSIN DES ETOILES
    ===================================================== */

    function drawParticles() {

        particles.forEach(particle => {

            const x =
                canvas.clientWidth / 2 +
                (particle.x + camera.x * 0.2) *
                camera.zoom;

            const y =
                canvas.clientHeight / 2 +
                (particle.y + camera.y * 0.2) *
                camera.zoom;

            if (
                x < 0 ||
                x > canvas.clientWidth ||
                y < 0 ||
                y > canvas.clientHeight
            ) {
                return;
            }

            ctx.globalAlpha =
                particle.opacity;

            ctx.fillStyle =
                "#8affc1";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

        });

        ctx.globalAlpha = 1;

    }


    /* =====================================================
       DESSIN DU RESEAU
    ===================================================== */

    function drawConnections() {

        for (
            let i = 0;
            i < nodes.length;
            i++
        ) {

            const a = nodes[i];

            if (!a.active) {
                continue;
            }

            let closest = null;

            let closestDistance =
                Infinity;

            for (
                let j = 0;
                j < nodes.length;
                j++
            ) {

                if (i === j) {
                    continue;
                }

                const b = nodes[j];

                if (!b.active) {
                    continue;
                }

                const dx =
                    a.x - b.x;

                const dy =
                    a.y - b.y;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                if (
                    distance <
                    closestDistance
                ) {

                    closestDistance =
                        distance;

                    closest = b;

                }

            }

            if (
                closest &&
                closestDistance < 250
            ) {

                const posA =
                    worldToScreen(a);

                const posB =
                    worldToScreen(closest);

                ctx.beginPath();

                ctx.moveTo(
                    posA.x,
                    posA.y
                );

                ctx.lineTo(
                    posB.x,
                    posB.y
                );

                ctx.strokeStyle =
                    "rgba(100,255,170,0.12)";

                ctx.lineWidth = 1;

                ctx.stroke();

            }

        }

    }


    /* =====================================================
       CENTRE DU MULTIVERS
    ===================================================== */

    function drawCenter() {

        const x =
            canvas.clientWidth / 2;

        const y =
            canvas.clientHeight / 2;

        const radius =
            45 * camera.zoom;

        const gradient =
            ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                radius
            );

        gradient.addColorStop(
            0,
            "rgba(150,255,200,0.8)"
        );

        gradient.addColorStop(
            0.2,
            "rgba(100,255,170,0.25)"
        );

        gradient.addColorStop(
            1,
            "rgba(100,255,170,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "rgba(120,255,180,0.3)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            30,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        ctx.fillStyle =
            "#baffd5";

        ctx.font =
            "10px monospace";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "C-137",
            x,
            y + 4
        );

    }


    /* =====================================================
       PLANETES
    ===================================================== */

    function drawNodes() {

        nodes.forEach(node => {

            if (!node.active) {
                return;
            }

            const pos =
                worldToScreen(node);

            if (
                pos.x < -30 ||
                pos.x >
                canvas.clientWidth + 30 ||
                pos.y < -30 ||
                pos.y >
                canvas.clientHeight + 30
            ) {
                return;
            }

            node.pulse +=
                node.speed;

            const pulse =
                Math.sin(
                    node.pulse
                ) * 1.5;


            /* GLOW */

            const glow =
                ctx.createRadialGradient(
                    pos.x,
                    pos.y,
                    0,
                    pos.x,
                    pos.y,
                    25 + pulse
                );

            glow.addColorStop(
                0,
                "rgba(130,255,180,0.5)"
            );

            glow.addColorStop(
                1,
                "rgba(130,255,180,0)"
            );

            ctx.fillStyle =
                glow;

            ctx.beginPath();

            ctx.arc(
                pos.x,
                pos.y,
                25 + pulse,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* POINT */

            ctx.fillStyle =
                "#8affc1";

            ctx.beginPath();

            ctx.arc(
                pos.x,
                pos.y,
                node.radius + pulse * 0.3,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* CERCLE */

            ctx.strokeStyle =
                "rgba(150,255,200,0.35)";

            ctx.beginPath();

            ctx.arc(
                pos.x,
                pos.y,
                9 + pulse,
                0,
                Math.PI * 2
            );

            ctx.stroke();


            /* NOM */

            if (
                camera.zoom > 0.7
            ) {

                ctx.font =
                    "10px monospace";

                ctx.fillStyle =
                    "rgba(170,255,210,0.65)";

                ctx.textAlign =
                    "left";

                ctx.fillText(
                    node.planet.nom,
                    pos.x + 12,
                    pos.y - 10
                );

            }

        });

    }


    /* =====================================================
       ANIMATION
    ===================================================== */

    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.clientWidth,
            canvas.clientHeight
        );

        drawParticles();

        drawConnections();

        drawCenter();

        drawNodes();

        updateTelemetry();

        requestAnimationFrame(
            animate
        );

    }


    /* =====================================================
       CLICK PLANETE
    ===================================================== */

    canvas.addEventListener(
        "click",
        event => {

            if (dragging) {
                return;
            }

            const rect =
                canvas.getBoundingClientRect();

            const mouseX =
                event.clientX -
                rect.left;

            const mouseY =
                event.clientY -
                rect.top;

            let found = null;

            nodes.forEach(node => {

                if (!node.active) {
                    return;
                }

                const pos =
                    worldToScreen(node);

                const distance =
                    Math.hypot(
                        mouseX - pos.x,
                        mouseY - pos.y
                    );

                if (
                    distance <
                    15
                ) {

                    found = node;

                }

            });

            if (!found) {
                return;
            }

            selectedPlanet =
                found;

            popupName.textContent =
                found.planet.nom;

            popupDimension.textContent =
                found.planet.dimension;

            popupCoordinates.textContent =
                Math.floor(found.x) +
                " / " +
                Math.floor(found.y);

            popupStatus.textContent =
                found.active
                    ? "STABLE"
                    : "OFFLINE";

            popup.classList.add(
                "active"
            );

        }
    );


    /* =====================================================
       FERMER POPUP
    ===================================================== */

    popupClose.addEventListener(
        "click",
        () => {

            popup.classList.remove(
                "active"
            );

        }
    );


    /* =====================================================
       OUVRIR PLANETE
    ===================================================== */

    openPlanet.addEventListener(
        "click",
        () => {

            if (!selectedPlanet) {
                return;
            }

            window.location.href =
                "planete.php?nom=" +
                encodeURIComponent(
                    selectedPlanet.planet.nom
                );

        }
    );


    /* =====================================================
       DRAG
    ===================================================== */

    canvas.addEventListener(
        "mousedown",
        event => {

            dragging = true;

            lastMouse.x =
                event.clientX;

            lastMouse.y =
                event.clientY;

        }
    );

    window.addEventListener(
        "mouseup",
        () => {

            dragging = false;

        }
    );

    window.addEventListener(
        "mousemove",
        event => {

            if (!dragging) {
                return;
            }

            const dx =
                event.clientX -
                lastMouse.x;

            const dy =
                event.clientY -
                lastMouse.y;

            camera.x +=
                dx /
                camera.zoom;

            camera.y +=
                dy /
                camera.zoom;

            lastMouse.x =
                event.clientX;

            lastMouse.y =
                event.clientY;

        }
    );


    /* =====================================================
       ZOOM
    ===================================================== */

    canvas.addEventListener(
        "wheel",
        event => {

            event.preventDefault();

            const oldZoom =
                camera.zoom;

            if (event.deltaY < 0) {

                camera.zoom *=
                    1.12;

            } else {

                camera.zoom *=
                    0.88;

            }

            camera.zoom =
                Math.max(
                    0.35,
                    Math.min(
                        camera.zoom,
                        4
                    )
                );

            const rect =
                canvas.getBoundingClientRect();

            const mouseX =
                event.clientX -
                rect.left -
                canvas.clientWidth / 2;

            const mouseY =
                event.clientY -
                rect.top -
                canvas.clientHeight / 2;

            camera.x -=
                mouseX *
                (
                    1 / camera.zoom -
                    1 / oldZoom
                );

            camera.y -=
                mouseY *
                (
                    1 / camera.zoom -
                    1 / oldZoom
                );

        },
        {
            passive: false
        }
    );


    /* =====================================================
       SIMULATION
    ===================================================== */

    simulateButton.addEventListener(
        "click",
        () => {

            if (simulationRunning) {
                return;
            }

            simulationRunning = true;

            systemStatus.textContent =
                "SIMULATION";

            log(
                "MULTIVERSE SIMULATION STARTED."
            );

            log(
                "Scanning dimensional anomalies..."
            );

            setTimeout(
                () => {

                    log(
                        "Quantum fluctuations detected."
                    );

                },
                1000
            );

            setTimeout(
                () => {

                    log(
                        "Reality connections recalculated."
                    );

                },
                2000
            );

            setTimeout(
                () => {

                    log(
                        "Simulation stabilized."
                    );

                    systemStatus.textContent =
                        "STABLE";

                    simulationRunning =
                        false;

                },
                3500
            );

        }
    );


    /* =====================================================
       COLLAPSE
    ===================================================== */

    collapseButton.addEventListener(
        "click",
        () => {

            if (collapseRunning) {
                return;
            }

            collapseRunning = true;

            collapseOverlay.classList.add(
                "active"
            );

            stability = 100;

            log(
                "⚠ MULTIVERSE COLLAPSE INITIATED."
            );

            let collapse =
                setInterval(
                    () => {

                        stability -=
                            Math.random() * 5;

                        stability =
                            Math.max(
                                0,
                                stability
                            );

                        stabilityBar.style.width =
                            stability + "%";

                        stabilityValue.textContent =
                            Math.floor(
                                stability
                            ) + "%";

                        collapsePercent.textContent =
                            Math.floor(
                                stability
                            ) + "%";

                        const active =
                            Math.ceil(
                                nodes.length *
                                stability /
                                100
                            );

                        activeRealities.textContent =
                            active;

                        nodes.forEach(
                            node => {

                                if (
                                    Math.random() >
                                    stability / 100
                                ) {

                                    node.active =
                                        false;

                                }

                            }
                        );

                        if (
                            stability <= 4
                        ) {

                            clearInterval(
                                collapse
                            );

                            stability =
                                4;

                            stabilityValue.textContent =
                                "4%";

                            collapsePercent.textContent =
                                "4%";

                            systemStatus.textContent =
                                "CRITICAL";

                            log(
                                "!!! MULTIVERSE CRITICAL !!!"
                            );

                        }

                    },
                    180
                );

        }
    );


    /* =====================================================
       RESET
    ===================================================== */

    resetButton.addEventListener(
        "click",
        () => {

            collapseOverlay.classList.remove(
                "active"
            );

            stability = 100;

            stabilityValue.textContent =
                "100%";

            stabilityBar.style.width =
                "100%";

            systemStatus.textContent =
                "STABLE";

            createNodes();

            camera.x = 0;
            camera.y = 0;
            camera.zoom = 1;

            collapseRunning =
                false;

            log(
                "MULTIVERSE RESET."
            );

        }
    );


    /* =====================================================
       FULLSCREEN
    ===================================================== */

    fullscreenButton.addEventListener(
        "click",
        async () => {

            if (!document.fullscreenElement) {

                await document.documentElement
                    .requestFullscreen();

                fullscreenButton.textContent =
                    "✕ EXIT FULLSCREEN";

            } else {

                await document.exitFullscreen();

                fullscreenButton.textContent =
                    "⛶ FULLSCREEN";

            }

        }
    );


    /* =====================================================
       INITIALISATION
    ===================================================== */

    createNodes();

    createParticles();

    log(
        planets.length +
        " planetary signature(s) loaded."
    );

    log(
        "Multiverse visualization online."
    );

    log(
        "Awaiting command..."
    );

    animate();

});

