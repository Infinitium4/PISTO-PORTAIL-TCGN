document.addEventListener("DOMContentLoaded", function () {

    console.log("MULTIVERSE JS chargé");

    const canvas = document.getElementById("multiverseCanvas");
    const ctx = canvas.getContext("2d");

    const terminal = document.getElementById("terminal");

    const dimensionCount = document.getElementById("dimensionCount");
    const signatureCount = document.getElementById("signatureCount");
    const activeRealities = document.getElementById("activeRealities");

    const systemStatus = document.getElementById("systemStatus");
    const stabilityValue = document.getElementById("stabilityValue");
    const stabilityBar = document.getElementById("stabilityBar");

    const telemetryX = document.getElementById("telemetryX");
    const telemetryY = document.getElementById("telemetryY");
    const telemetryZ = document.getElementById("telemetryZ");

    const simulateButton = document.getElementById("simulateButton");
    const collapseButton = document.getElementById("collapseButton");
    const resetButton = document.getElementById("resetButton");

    const fullscreenButton =
        document.getElementById("fullscreenButton");

    const popup =
        document.getElementById("planetPopup");

    const popupClose =
        document.getElementById("popupClose");

    const openPlanet =
        document.getElementById("openPlanet");

    const popupName =
        document.getElementById("popupName");

    const popupDimension =
        document.getElementById("popupDimension");

    const popupCoordinates =
        document.getElementById("popupCoordinates");

    const popupStatus =
        document.getElementById("popupStatus");

    const collapseOverlay =
        document.getElementById("collapseOverlay");

    const collapsePercent =
        document.getElementById("collapsePercent");


    /* =====================================================
       VERIFICATION
    ===================================================== */

    if (!canvas) {
        console.error("Canvas introuvable");
        return;
    }

    if (!simulateButton) {
        console.error("Bouton simulation introuvable");
    }

    if (!collapseButton) {
        console.error("Bouton collapse introuvable");
    }

    if (!resetButton) {
        console.error("Bouton reset introuvable");
    }


    /* =====================================================
       DONNEES
    ===================================================== */

    let planets = [];

    if (
        typeof multiversePlanets !== "undefined" &&
        Array.isArray(multiversePlanets)
    ) {

        planets = multiversePlanets;

    }

    console.log(
        "Planètes reçues :",
        planets
    );


    /* =====================================================
       VARIABLES
    ===================================================== */

    let nodes = [];

    let particles = [];

    let selectedPlanet = null;

    let dragging = false;

    let movedMouse = false;

    let lastMouseX = 0;

    let lastMouseY = 0;

    let stability = 100;

    let collapseTimer = null;

    let cameraX = 0;

    let cameraY = 0;

    let zoom = 1;


    /* =====================================================
       TERMINAL
    ===================================================== */

    function terminalLog(message) {

        if (!terminal) {
            return;
        }

        terminal.innerHTML +=
            "<br>> " + message;

        terminal.scrollTop =
            terminal.scrollHeight;

    }


    /* =====================================================
       CANVAS
    ===================================================== */

    function resizeCanvas() {

        const rect =
            canvas.getBoundingClientRect();

        const dpr =
            window.devicePixelRatio || 1;

        canvas.width =
            rect.width * dpr;

        canvas.height =
            rect.height * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
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

        planets.forEach(function (planet) {

            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                100 +
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

                active: true

            });

        });

        if (dimensionCount) {
            dimensionCount.textContent =
                nodes.length;
        }

        if (signatureCount) {
            signatureCount.textContent =
                nodes.length;
        }

        if (activeRealities) {
            activeRealities.textContent =
                nodes.length;
        }

    }


    /* =====================================================
       PARTICULES
    ===================================================== */

    function createParticles() {

        particles = [];

        for (let i = 0; i < 600; i++) {

            particles.push({

                x:
                    (Math.random() - 0.5) *
                    3000,

                y:
                    (Math.random() - 0.5) *
                    2200,

                size:
                    Math.random() * 1.5,

                opacity:
                    0.2 +
                    Math.random() * 0.8

            });

        }

    }


    /* =====================================================
       COORDONNEES
    ===================================================== */

    function worldToScreen(node) {

        return {

            x:
                canvas.clientWidth / 2 +
                (node.x + cameraX) *
                zoom,

            y:
                canvas.clientHeight / 2 +
                (node.y + cameraY) *
                zoom

        };

    }


    /* =====================================================
       PARTICULES
    ===================================================== */

    function drawParticles() {

        particles.forEach(function (particle) {

            const x =
                canvas.clientWidth / 2 +
                (particle.x + cameraX * 0.2) *
                zoom;

            const y =
                canvas.clientHeight / 2 +
                (particle.y + cameraY * 0.2) *
                zoom;

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
       CONNEXIONS
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

            for (
                let j = i + 1;
                j < nodes.length;
                j++
            ) {

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

                if (distance > 230) {
                    continue;
                }

                const posA =
                    worldToScreen(a);

                const posB =
                    worldToScreen(b);

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
       CENTRE
    ===================================================== */

    function drawCenter() {

        const x =
            canvas.clientWidth / 2;

        const y =
            canvas.clientHeight / 2;

        const pulse =
            35 +
            Math.sin(
                Date.now() * 0.002
            ) * 5;

        const gradient =
            ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                pulse
            );

        gradient.addColorStop(
            0,
            "rgba(150,255,200,0.8)"
        );

        gradient.addColorStop(
            0.25,
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
            pulse,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "rgba(130,255,190,0.4)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            25,
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

        nodes.forEach(function (node) {

            if (!node.active) {
                return;
            }

            const pos =
                worldToScreen(node);

            if (
                pos.x < -50 ||
                pos.x >
                canvas.clientWidth + 50 ||
                pos.y < -50 ||
                pos.y >
                canvas.clientHeight + 50
            ) {
                return;
            }

            node.pulse += 0.04;

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
                    25
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
                25,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* PLANETE */

            ctx.fillStyle =
                "#8affc1";

            ctx.beginPath();

            ctx.arc(
                pos.x,
                pos.y,
                node.radius + pulse,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* CERCLE */

            ctx.strokeStyle =
                "rgba(150,255,200,0.4)";

            ctx.beginPath();

            ctx.arc(
                pos.x,
                pos.y,
                10 + pulse,
                0,
                Math.PI * 2
            );

            ctx.stroke();


            /* NOM */

            if (zoom > 0.65) {

                ctx.fillStyle =
                    "rgba(170,255,210,0.7)";

                ctx.font =
                    "10px monospace";

                ctx.textAlign =
                    "left";

                ctx.fillText(
                    node.planet.nom,
                    pos.x + 13,
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

        if (telemetryX) {
            telemetryX.textContent =
                Math.floor(cameraX);
        }

        if (telemetryY) {
            telemetryY.textContent =
                Math.floor(cameraY);
        }

        if (telemetryZ) {
            telemetryZ.textContent =
                Math.floor(zoom * 100);
        }

        requestAnimationFrame(
            animate
        );

    }


    /* =====================================================
       CLIC
    ===================================================== */

    canvas.addEventListener(
        "click",
        function (event) {

            if (movedMouse) {
                movedMouse = false;
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

            nodes.forEach(function (node) {

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

                if (distance < 18) {
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
                Math.round(found.x) +
                " / " +
                Math.round(found.y);

            popupStatus.textContent =
                "STABLE";

            popup.classList.add(
                "active"
            );

            terminalLog(
                "Signature sélectionnée : " +
                found.planet.nom
            );

        }
    );


    /* =====================================================
       DRAG
    ===================================================== */

    canvas.addEventListener(
        "mousedown",
        function (event) {

            dragging = true;

            movedMouse = false;

            lastMouseX =
                event.clientX;

            lastMouseY =
                event.clientY;

        }
    );


    window.addEventListener(
        "mousemove",
        function (event) {

            if (!dragging) {
                return;
            }

            const dx =
                event.clientX -
                lastMouseX;

            const dy =
                event.clientY -
                lastMouseY;

            if (
                Math.abs(dx) > 2 ||
                Math.abs(dy) > 2
            ) {

                movedMouse = true;

            }

            cameraX +=
                dx / zoom;

            cameraY +=
                dy / zoom;

            lastMouseX =
                event.clientX;

            lastMouseY =
                event.clientY;

        }
    );


    window.addEventListener(
        "mouseup",
        function () {

            dragging = false;

        }
    );


    /* =====================================================
       ZOOM
    ===================================================== */

    canvas.addEventListener(
        "wheel",
        function (event) {

            event.preventDefault();

            if (event.deltaY < 0) {

                zoom *= 1.12;

            } else {

                zoom *= 0.88;

            }

            zoom =
                Math.max(
                    0.3,
                    Math.min(
                        zoom,
                        4
                    )
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
        function () {

            console.log(
                "SIMULATION CLICK"
            );

            systemStatus.textContent =
                "SIMULATION";

            terminalLog(
                "MULTIVERSE SIMULATION STARTED."
            );

            setTimeout(function () {

                terminalLog(
                    "Quantum fluctuations detected."
                );

            }, 700);

            setTimeout(function () {

                terminalLog(
                    "Reality connections recalculated."
                );

            }, 1400);

            setTimeout(function () {

                terminalLog(
                    "New dimensional signatures detected."
                );

                systemStatus.textContent =
                    "STABLE";

            }, 2100);

        }
    );


    /* =====================================================
       COLLAPSE
    ===================================================== */

    collapseButton.addEventListener(
        "click",
        function () {

            console.log(
                "COLLAPSE CLICK"
            );

            if (collapseTimer) {
                return;
            }

            collapseRunning();

        }
    );


    function collapseRunning() {

        stability = 100;

        collapseOverlay.classList.add(
            "active"
        );

        systemStatus.textContent =
            "CRITICAL";

        terminalLog(
            "⚠ MULTIVERSE COLLAPSE INITIATED."
        );

        collapseTimer =
            setInterval(function () {

                stability -=
                    Math.random() * 5 + 1;

                stability =
                    Math.max(
                        4,
                        stability
                    );


                stabilityValue.textContent =
                    Math.floor(stability) +
                    "%";

                stabilityBar.style.width =
                    stability +
                    "%";

                collapsePercent.textContent =
                    Math.floor(stability) +
                    "%";


                const active =
                    Math.ceil(
                        nodes.length *
                        stability /
                        100
                    );

                activeRealities.textContent =
                    active;


                nodes.forEach(function (node) {

                    if (
                        Math.random() >
                        stability / 100
                    ) {

                        node.active =
                            false;

                    }

                });


                if (stability <= 4) {

                    clearInterval(
                        collapseTimer
                    );

                    collapseTimer =
                        null;

                    terminalLog(
                        "!!! MULTIVERSE CRITICAL !!!"
                    );

                }

            }, 180);

    }


    /* =====================================================
       RESET
    ===================================================== */

    resetButton.addEventListener(
        "click",
        function () {

            console.log(
                "RESET CLICK"
            );

            if (collapseTimer) {

                clearInterval(
                    collapseTimer
                );

                collapseTimer =
                    null;

            }

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

            cameraX = 0;
            cameraY = 0;
            zoom = 1;

            createNodes();

            terminalLog(
                "MULTIVERSE RESET."
            );

        }
    );


    /* =====================================================
       POPUP
    ===================================================== */

    popupClose.addEventListener(
        "click",
        function () {

            popup.classList.remove(
                "active"
            );

        }
    );


    openPlanet.addEventListener(
        "click",
        function () {

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
       FULLSCREEN
    ===================================================== */

    fullscreenButton.addEventListener(
        "click",
        async function () {

            try {

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

            } catch (error) {

                console.error(
                    "Fullscreen error:",
                    error
                );

            }

        }
    );


    /* =====================================================
       INITIALISATION
    ===================================================== */

    createNodes();

    createParticles();

    terminalLog(
        planets.length +
        " planetary signature(s) loaded."
    );

    terminalLog(
        "Multiverse visualization online."
    );

    terminalLog(
        "Awaiting command..."
    );

    animate();

});
