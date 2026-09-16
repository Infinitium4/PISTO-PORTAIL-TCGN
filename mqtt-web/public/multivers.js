document.addEventListener("DOMContentLoaded", function () {

    console.log("================================");
    console.log("MULTIVERSE SYSTEM INITIALIZING");
    console.log("================================");


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const canvas =
        document.getElementById("multiverseCanvas");

    const ctx =
        canvas.getContext("2d");


    const systemStatus =
        document.getElementById("systemStatus");

    const stateDot =
        document.getElementById("stateDot");


    const dimensionCount =
        document.getElementById("dimensionCount");

    const signatureCount =
        document.getElementById("signatureCount");

    const activeRealities =
        document.getElementById("activeRealities");


    const stabilityValue =
        document.getElementById("stabilityValue");

    const stabilityBar =
        document.getElementById("stabilityBar");


    const dangerLevel =
        document.getElementById("dangerLevel");


    const telemetryX =
        document.getElementById("telemetryX");

    const telemetryY =
        document.getElementById("telemetryY");

    const telemetryZ =
        document.getElementById("telemetryZ");


    const terminal =
        document.getElementById("terminal");


    const eventMessage =
        document.getElementById("eventMessage");


    const simulateButton =
        document.getElementById("simulateButton");

    const portalButton =
        document.getElementById("portalButton");

    const overloadButton =
        document.getElementById("overloadButton");

    const resetButton =
        document.getElementById("resetButton");

    const fullscreenButton =
        document.getElementById("fullscreenButton");


    const popup =
        document.getElementById("planetPopup");

    const popupClose =
        document.getElementById("popupClose");

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


    const portalEffect =
        document.getElementById("portalEffect");

    const realityOverload =
        document.getElementById("realityOverload");


    if (!canvas) {

        console.error(
            "Canvas multivers introuvable."
        );

        return;

    }


    /* =====================================================
       DATABASE
    ===================================================== */

    let planets =
        Array.isArray(window.multiversePlanets)
            ? window.multiversePlanets
            : [];


    console.log(
        "Planètes reçues :",
        planets
    );


    /* =====================================================
       STATE
    ===================================================== */

    let nodes = [];

    let particles = [];

    let portals = [];

    let selectedNode = null;

    let dragging = false;

    let movedMouse = false;

    let lastMouseX = 0;

    let lastMouseY = 0;

    let cameraX = 0;

    let cameraY = 0;

    let zoom = 1;

    let stability = 100;

    let overloadActive = false;

    let animationFrame = null;

    let eventInterval = null;

    let simulationRunning = false;


    /* =====================================================
       RANDOM
    ===================================================== */

    function random(min, max) {

        return (
            Math.random() *
            (max - min)
            + min
        );

    }


    /* =====================================================
       TERMINAL
    ===================================================== */

    function terminalLog(message) {

        if (!terminal) {
            return;
        }


        const line =
            document.createElement("div");

        line.className =
            "terminal-line";

        line.textContent =
            "> " + message;


        terminal.appendChild(line);


        while (
            terminal.children.length > 80
        ) {

            terminal.removeChild(
                terminal.firstChild
            );

        }


        terminal.scrollTop =
            terminal.scrollHeight;

    }


    /* =====================================================
       RESIZE
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
       CREATE NODES
    ===================================================== */

    function createNodes() {

        nodes = [];


        planets.forEach(
            function (planet, index) {

                const angle =
                    random(
                        0,
                        Math.PI * 2
                    );


                const distance =
                    random(
                        90,
                        650
                    );


                nodes.push({

                    planet: planet,

                    x:
                        Math.cos(angle) *
                        distance,

                    y:
                        Math.sin(angle) *
                        distance,

                    vx:
                        random(
                            -0.03,
                            0.03
                        ),

                    vy:
                        random(
                            -0.03,
                            0.03
                        ),

                    radius:
                        random(3, 6),

                    pulse:
                        random(
                            0,
                            Math.PI * 2
                        ),

                    phase:
                        random(
                            0,
                            Math.PI * 2
                        ),

                    active: true,

                    scanned: false,

                    id: index

                });

            }
        );


        updateCounters();

    }


    /* =====================================================
       PARTICLES
    ===================================================== */

    function createParticles() {

        particles = [];


        for (
            let i = 0;
            i < 800;
            i++
        ) {

            particles.push({

                x:
                    random(
                        -3000,
                        3000
                    ),

                y:
                    random(
                        -2200,
                        2200
                    ),

                size:
                    random(
                        0.3,
                        1.8
                    ),

                opacity:
                    random(
                        0.1,
                        0.9
                    ),

                speed:
                    random(
                        0.001,
                        0.01
                    )

            });

        }

    }


    /* =====================================================
       PORTALS
    ===================================================== */

    function createPortal() {

        portals.push({

            x:
                random(
                    -650,
                    650
                ),

            y:
                random(
                    -400,
                    400
                ),

            radius:
                random(
                    40,
                    75
                ),

            rotation:
                random(
                    0,
                    Math.PI * 2
                ),

            life:
                100,

            speed:
                random(
                    0.01,
                    0.04
                )

        });


        if (
            portals.length > 8
        ) {

            portals.shift();

        }


        terminalLog(
            "DIMENSIONAL PORTAL DETECTED."
        );

        setEvent(
            "PORTAL DETECTED"
        );

    }


    /* =====================================================
       UPDATE COUNTERS
    ===================================================== */

    function updateCounters() {

        const active =
            nodes.filter(
                node =>
                    node.active
            ).length;


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
                active;

        }

    }


    /* =====================================================
       WORLD TO SCREEN
    ===================================================== */

    function worldToScreen(x, y) {

        return {

            x:
                canvas.clientWidth / 2 +
                (x + cameraX) *
                zoom,

            y:
                canvas.clientHeight / 2 +
                (y + cameraY) *
                zoom

        };

    }


    /* =====================================================
       PARTICLES
    ===================================================== */

    function drawParticles(time) {

        particles.forEach(
            function (particle) {

                particle.x +=
                    particle.speed;

                if (
                    particle.x > 3200
                ) {

                    particle.x = -3200;

                }


                const pos =
                    worldToScreen(
                        particle.x,
                        particle.y
                    );


                if (
                    pos.x < 0 ||
                    pos.x >
                    canvas.clientWidth ||
                    pos.y < 0 ||
                    pos.y >
                    canvas.clientHeight
                ) {

                    return;

                }


                ctx.globalAlpha =
                    particle.opacity;


                ctx.fillStyle =
                    "#8affc1";


                ctx.beginPath();


                ctx.arc(
                    pos.x,
                    pos.y,
                    particle.size,
                    0,
                    Math.PI * 2
                );


                ctx.fill();

            }
        );


        ctx.globalAlpha = 1;

    }


    /* =====================================================
       CONNECTIONS
    ===================================================== */

    function drawConnections() {

        for (
            let i = 0;
            i < nodes.length;
            i++
        ) {

            const a =
                nodes[i];


            if (!a.active) {
                continue;
            }


            for (
                let j = i + 1;
                j < nodes.length;
                j++
            ) {

                const b =
                    nodes[j];


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
                    distance > 250
                ) {

                    continue;

                }


                const alpha =
                    0.15 *
                    (
                        1 -
                        distance / 250
                    );


                const posA =
                    worldToScreen(
                        a.x,
                        a.y
                    );


                const posB =
                    worldToScreen(
                        b.x,
                        b.y
                    );


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
                    `rgba(100,255,170,${alpha})`;


                ctx.lineWidth =
                    1;


                ctx.stroke();

            }

        }

    }


    /* =====================================================
       CENTER CORE
    ===================================================== */

    function drawCore(time) {

        const center =
            worldToScreen(
                0,
                0
            );


        const pulse =
            32 +
            Math.sin(
                time * 0.002
            ) * 6;


        const gradient =
            ctx.createRadialGradient(
                center.x,
                center.y,
                0,
                center.x,
                center.y,
                pulse
            );


        gradient.addColorStop(
            0,
            "rgba(220,255,235,0.95)"
        );


        gradient.addColorStop(
            0.15,
            "rgba(130,255,180,0.6)"
        );


        gradient.addColorStop(
            0.45,
            "rgba(80,255,160,0.18)"
        );


        gradient.addColorStop(
            1,
            "rgba(80,255,160,0)"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();

        ctx.arc(
            center.x,
            center.y,
            pulse,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "rgba(130,255,190,0.4)";


        ctx.lineWidth =
            1;


        ctx.beginPath();

        ctx.arc(
            center.x,
            center.y,
            23,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.arc(
            center.x,
            center.y,
            31 +
            Math.sin(
                time * 0.001
            ) * 3,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        ctx.fillStyle =
            "#d8ffe8";


        ctx.font =
            "10px monospace";


        ctx.textAlign =
            "center";


        ctx.fillText(
            "C-137",
            center.x,
            center.y + 4
        );

    }


    /* =====================================================
       PORTAL DRAW
    ===================================================== */

    function drawPortals() {

        portals.forEach(
            function (portal) {

                portal.rotation +=
                    portal.speed;


                portal.life -=
                    0.03;


                const pos =
                    worldToScreen(
                        portal.x,
                        portal.y
                    );


                ctx.save();


                ctx.translate(
                    pos.x,
                    pos.y
                );


                ctx.rotate(
                    portal.rotation
                );


                const radius =
                    portal.radius *
                    zoom;


                const gradient =
                    ctx.createRadialGradient(
                        0,
                        0,
                        0,
                        0,
                        0,
                        radius
                    );


                gradient.addColorStop(
                    0,
                    "rgba(220,255,240,0.8)"
                );


                gradient.addColorStop(
                    0.2,
                    "rgba(100,255,170,0.35)"
                );


                gradient.addColorStop(
                    1,
                    "rgba(100,255,170,0)"
                );


                ctx.fillStyle =
                    gradient;


                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    radius,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.strokeStyle =
                    "rgba(130,255,190,0.65)";


                ctx.lineWidth =
                    2;


                ctx.setLineDash(
                    [8, 5]
                );


                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    radius * 0.65,
                    0,
                    Math.PI * 2
                );

                ctx.stroke();


                ctx.rotate(
                    -portal.rotation * 2
                );


                ctx.setLineDash(
                    [3, 10]
                );


                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    radius * 0.8,
                    0,
                    Math.PI * 2
                );

                ctx.stroke();


                ctx.restore();

            }
        );


        portals =
            portals.filter(
                portal =>
                    portal.life > 0
            );

    }


    /* =====================================================
       NODES
    ===================================================== */

    function drawNodes(time) {

        nodes.forEach(
            function (node) {

                if (!node.active) {
                    return;
                }


                node.pulse +=
                    0.04;


                const pos =
                    worldToScreen(
                        node.x,
                        node.y
                    );


                if (
                    pos.x < -80 ||
                    pos.x >
                    canvas.clientWidth + 80 ||
                    pos.y < -80 ||
                    pos.y >
                    canvas.clientHeight + 80
                ) {

                    return;

                }


                const pulse =
                    Math.sin(
                        node.pulse
                    ) * 1.5;


                const radius =
                    (
                        node.radius +
                        pulse
                    ) *
                    Math.max(
                        0.7,
                        zoom
                    );


                /* GLOW */

                const glow =
                    ctx.createRadialGradient(
                        pos.x,
                        pos.y,
                        0,
                        pos.x,
                        pos.y,
                        35 * zoom
                    );


                glow.addColorStop(
                    0,
                    "rgba(130,255,180,0.45)"
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
                    35 * zoom,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                /* ORBIT */

                ctx.strokeStyle =
                    node.scanned
                        ? "rgba(230,255,240,0.8)"
                        : "rgba(130,255,190,0.3)";


                ctx.lineWidth =
                    node.scanned
                        ? 2
                        : 1;


                ctx.beginPath();

                ctx.arc(
                    pos.x,
                    pos.y,
                    10 * zoom,
                    0,
                    Math.PI * 2
                );

                ctx.stroke();


                /* CORE */

                ctx.fillStyle =
                    node.scanned
                        ? "#ffffff"
                        : "#8affc1";


                ctx.beginPath();

                ctx.arc(
                    pos.x,
                    pos.y,
                    radius,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                /* NAME */

                if (
                    zoom > 0.55
                ) {

                    ctx.fillStyle =
                        node.scanned
                            ? "#ffffff"
                            : "rgba(180,255,210,0.75)";


                    ctx.font =
                        "10px monospace";


                    ctx.textAlign =
                        "left";


                    ctx.fillText(
                        node.planet.nom,
                        pos.x + 14,
                        pos.y - 10
                    );

                }

            }
        );

    }


    /* =====================================================
       ANIMATION
    ===================================================== */

    function animate(time) {

        ctx.clearRect(
            0,
            0,
            canvas.clientWidth,
            canvas.clientHeight
        );


        drawParticles(time);

        drawConnections();

        drawPortals();

        drawCore(time);

        drawNodes(time);


        /* TELEMETRY */

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
                Math.floor(
                    zoom * 100
                );

        }


        animationFrame =
            requestAnimationFrame(
                animate
            );

    }


    /* =====================================================
       FIND NODE
    ===================================================== */

    function findNode(mouseX, mouseY) {

        let found =
            null;


        nodes.forEach(
            function (node) {

                if (!node.active) {
                    return;
                }


                const pos =
                    worldToScreen(
                        node.x,
                        node.y
                    );


                const distance =
                    Math.hypot(
                        mouseX - pos.x,
                        mouseY - pos.y
                    );


                if (
                    distance <
                    Math.max(
                        18,
                        25 * zoom
                    )
                ) {

                    found =
                        node;

                }

            }
        );


        return found;

    }


    /* =====================================================
       SELECT NODE
    ===================================================== */

    function selectNode(node) {

        if (!node) {
            return;
        }


        selectedNode =
            node;


        node.scanned =
            true;


        popupName.textContent =
            node.planet.nom;


        popupDimension.textContent =
            node.planet.dimension;


        popupCoordinates.textContent =
            Math.round(node.x) +
            " / " +
            Math.round(node.y);


        popupStatus.textContent =
            "SCANNING";


        popup.classList.add(
            "active"
        );


        terminalLog(
            "PLANETARY SIGNATURE: " +
            node.planet.nom
        );


        terminalLog(
            "DIMENSION: " +
            node.planet.dimension
        );


        terminalLog(
            "QUANTUM SCAN INITIATED."
        );


        setTimeout(
            function () {

                if (
                    selectedNode === node
                ) {

                    popupStatus.textContent =
                        "STABLE";


                    terminalLog(
                        "SCAN COMPLETE."
                    );

                }

            },
            1200
        );

    }


    /* =====================================================
       MOUSE
    ===================================================== */

    canvas.addEventListener(
        "mousedown",
        function (event) {

            dragging =
                true;


            movedMouse =
                false;


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

                movedMouse =
                    true;

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

            dragging =
                false;

        }
    );


    canvas.addEventListener(
        "click",
        function (event) {

            if (movedMouse) {

                movedMouse =
                    false;

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


            const node =
                findNode(
                    mouseX,
                    mouseY
                );


            if (node) {

                selectNode(
                    node
                );

            }

        }
    );


    /* =====================================================
       ZOOM
    ===================================================== */

    canvas.addEventListener(
        "wheel",
        function (event) {

            event.preventDefault();


            const oldZoom =
                zoom;


            if (
                event.deltaY < 0
            ) {

                zoom *= 1.12;

            } else {

                zoom *= 0.88;

            }


            zoom =
                Math.max(
                    0.25,
                    Math.min(
                        zoom,
                        5
                    )
                );


            /* keep zoom smooth */

            if (
                oldZoom !== zoom
            ) {

                terminalLog(
                    "OPTICAL ZOOM: " +
                    Math.round(
                        zoom * 100
                    ) +
                    "%"
                );

            }

        },
        {
            passive: false
        }
    );


    /* =====================================================
       EVENT
    ===================================================== */

    const randomEvents = [

        "QUANTUM FLUCTUATION DETECTED",

        "UNKNOWN LIFEFORM SIGNAL",

        "DIMENSIONAL STATIC DETECTED",

        "TEMPORAL ANOMALY DETECTED",

        "PORTAL SIGNATURE DETECTED",

        "REALITY WAVE DETECTED",

        "UNKNOWN TRANSMISSION",

        "MULTIVERSE FREQUENCY SHIFT",

        "GRAVITATIONAL ANOMALY",

        "RICK SIGNATURE DETECTED"

    ];


    function setEvent(message) {

        if (!eventMessage) {
            return;
        }


        eventMessage.textContent =
            message;


        eventMessage.animate(
            [
                {
                    opacity: 0
                },
                {
                    opacity: 1
                }
            ],
            {
                duration: 300
            }
        );

    }


    function randomEvent() {

        const event =
            randomEvents[
                Math.floor(
                    Math.random() *
                    randomEvents.length
                )
            ];


        setEvent(
            event
        );


        terminalLog(
            event
        );


        if (
            Math.random() >
            0.7
        ) {

            createPortal();

        }

    }


    /* =====================================================
       SIMULATION
    ===================================================== */

    function runSimulation() {

        if (simulationRunning) {
            return;
        }


        simulationRunning =
            true;


        systemStatus.textContent =
            "SIMULATION ACTIVE";


        terminalLog(
            "MULTIVERSE SIMULATION STARTED."
        );


        terminalLog(
            "CALCULATING REALITY NETWORK..."
        );


        setTimeout(
            function () {

                terminalLog(
                    "QUANTUM FLUCTUATIONS DETECTED."
                );

                createPortal();

            },
            600
        );


        setTimeout(
            function () {

                terminalLog(
                    "DIMENSIONAL LINKS RECALCULATED."
                );

            },
            1200
        );


        setTimeout(
            function () {

                terminalLog(
                    "TEMPORAL STABILITY: 99.7%"
                );

            },
            1800
        );


        setTimeout(
            function () {

                terminalLog(
                    "SIMULATION COMPLETE."
                );


                systemStatus.textContent =
                    "SYSTEM STABLE";


                simulationRunning =
                    false;

            },
            2400
        );

    }


    /* =====================================================
       PORTAL BUTTON
    ===================================================== */

    function openPortal() {

        portalEffect.classList.add(
            "active"
        );


        createPortal();


        terminalLog(
            "MANUAL PORTAL GENERATION."
        );


        setEvent(
            "MANUAL PORTAL OPENED"
        );


        setTimeout(
            function () {

                portalEffect.classList.remove(
                    "active"
                );

            },
            2500
        );

    }


    /* =====================================================
       REALITY OVERLOAD
    ===================================================== */

    function startOverload() {

        if (overloadActive) {
            return;
        }


        overloadActive =
            true;


        realityOverload.classList.add(
            "active"
        );


        systemStatus.textContent =
            "CRITICAL";


        stateDot.style.background =
            "#ff5555";


        stateDot.style.boxShadow =
            "0 0 15px #ff5555";


        terminalLog(
            "!!! REALITY OVERLOAD INITIATED !!!"
        );


        let value =
            100;


        const overloadTimer =
            setInterval(
                function () {

                    value -=
                        random(
                            2,
                            7
                        );


                    value =
                        Math.max(
                            0,
                            value
                        );


                    stability =
                        value;


                    stabilityValue.textContent =
                        Math.floor(
                            value
                        ) +
                        "%";


                    stabilityBar.style.width =
                        value +
                        "%";


                    if (
                        value <
                        75
                    ) {

                        createPortal();

                    }


                    if (
                        value <=
                        0
                    ) {

                        clearInterval(
                            overloadTimer
                        );


                        terminalLog(
                            "!!! REALITY COLLAPSE COMPLETE !!!"
                        );


                        nodes.forEach(
                            function (node) {

                                if (
                                    Math.random() >
                                    0.35
                                ) {

                                    node.active =
                                        false;

                                }

                            }
                        );


                        updateCounters();


                        setTimeout(
                            function () {

                                realityOverload.classList.remove(
                                    "active"
                                );

                                overloadActive =
                                    false;


                                systemStatus.textContent =
                                    "SYSTEM CRITICAL";

                            },
                            1200
                        );

                    }

                },
                180
            );

    }


    /* =====================================================
       RESET
    ===================================================== */

    function resetSystem() {

        terminalLog(
            "RESETTING MULTIVERSE..."
        );


        if (overloadActive) {

            realityOverload.classList.remove(
                "active"
            );

            overloadActive =
                false;

        }


        portals =
            [];


        cameraX =
            0;

        cameraY =
            0;

        zoom =
            1;


        stability =
            100;


        stabilityValue.textContent =
            "100%";


        stabilityBar.style.width =
            "100%";


        systemStatus.textContent =
            "SYSTEM STABLE";


        stateDot.style.background =
            "#8affc1";


        stateDot.style.boxShadow =
            "0 0 12px #8affc1";


        createNodes();


        terminalLog(
            "QUANTUM CORE REINITIALIZED."
        );


        terminalLog(
            "MULTIVERSE RESET COMPLETE."
        );


        setEvent(
            "SYSTEM RESET"
        );

    }


    /* =====================================================
       FULLSCREEN
    ===================================================== */

    fullscreenButton.addEventListener(
        "click",
        async function () {

            try {

                if (
                    !document.fullscreenElement
                ) {

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


    document.addEventListener(
        "fullscreenchange",
        function () {

            if (
                !document.fullscreenElement
            ) {

                fullscreenButton.textContent =
                    "⛶ FULLSCREEN";

            }

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

            if (
                !selectedNode
            ) {

                return;

            }


            window.location.href =
                "planete.php?nom=" +
                encodeURIComponent(
                    selectedNode.planet.nom
                );

        }
    );


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                popup.classList.remove(
                    "active"
                );

            }

        }
    );


    /* =====================================================
       START RANDOM EVENTS
    ===================================================== */

    eventInterval =
        setInterval(
            function () {

                if (
                    !overloadActive
                ) {

                    randomEvent();

                }

            },
            7000
        );


    /* =====================================================
       BUTTONS
    ===================================================== */

    simulateButton.addEventListener(
        "click",
        runSimulation
    );


    portalButton.addEventListener(
        "click",
        openPortal
    );


    overloadButton.addEventListener(
        "click",
        startOverload
    );


    resetButton.addEventListener(
        "click",
        resetSystem
    );


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    createNodes();

    createParticles();


    terminalLog(
        planets.length +
        " PLANETARY SIGNATURE(S) LOADED."
    );


    terminalLog(
        "QUANTUM CORE ONLINE."
    );


    terminalLog(
        "DIMENSIONAL OBSERVATORY ONLINE."
    );


    terminalLog(
        "SYSTEM READY."
    );


    setEvent(
        "NO ANOMALY DETECTED"
    );


    animate();


    console.log(
        "MULTIVERSE SYSTEM ONLINE."
    );

});