document.addEventListener("DOMContentLoaded", () => {

    const radar = document.getElementById("radarSignatures");
    const counter = document.getElementById("signatureCount");
    const terminal = document.getElementById("radarTerminal");

    if (!radar || !counter || !terminal) {
        console.error("Radar introuvable.");
        return;
    }


    /*
     * Vérification des données envoyées par PHP
     */

    if (
        typeof radarPlanets === "undefined" ||
        !Array.isArray(radarPlanets)
    ) {

        console.error("Aucune donnée de planète reçue.");

        terminal.innerHTML +=
            "<br>> ERREUR : aucune donnée reçue.";

        return;

    }


    /*
     * Nombre de planètes
     */

    const planets = radarPlanets;


    counter.textContent = planets.length;


    /*
     * Message terminal
     */

    setTimeout(() => {

        terminal.innerHTML +=
            "<br>> " +
            planets.length +
            " signature(s) détectée(s).";

    }, 700);


    /*
     * Création des signatures
     */

    planets.forEach((planet, index) => {

        /*
         * Angle aléatoire
         */

        const angle =
            Math.random() * Math.PI * 2;


        /*
         * Distance du centre
         *
         * On évite de placer les planètes
         * trop près du centre.
         */

        const distance =
            12 + Math.random() * 35;


        /*
         * Conversion en coordonnées
         */

        const x =
            50 + Math.cos(angle) * distance;

        const y =
            50 + Math.sin(angle) * distance;


        /*
         * Création du point
         */

        const signature =
            document.createElement("div");


        signature.classList.add(
            "radar-signature"
        );


        signature.style.left =
            x + "%";


        signature.style.top =
            y + "%";


        /*
         * Décalage de l'animation
         * pour éviter que tous les points
         * clignotent ensemble.
         */

        signature.style.animationDelay =
            (Math.random() * 1.5) + "s";


        /*
         * Tooltip
         */

        const tooltip =
            document.createElement("div");


        tooltip.classList.add(
            "radar-tooltip"
        );


        tooltip.textContent =
            planet.nom;


        tooltip.style.display =
            "none";


        /*
         * Affichage du nom au survol
         */

        signature.addEventListener(
            "mouseenter",
            () => {

                tooltip.style.display =
                    "block";

            }
        );


        signature.addEventListener(
            "mouseleave",
            () => {

                tooltip.style.display =
                    "none";

            }
        );


        /*
         * Clic sur la planète
         */

        signature.addEventListener(
            "click",
            () => {

                window.location.href =
                    "planete.php?nom=" +
                    encodeURIComponent(
                        planet.nom
                    );

            }
        );


        /*
         * Ajout du tooltip dans le point
         */

        signature.appendChild(tooltip);


        /*
         * Ajout au radar
         */

        radar.appendChild(signature);

    });


    /*
     * Animation du terminal
     */

    setTimeout(() => {

        terminal.innerHTML +=
            "<br>> Balayage du secteur C-137...";

    }, 1400);


    setTimeout(() => {

        terminal.innerHTML +=
            "<br>> Analyse des signatures...";

    }, 2100);


    setTimeout(() => {

        terminal.innerHTML +=
            "<br>> RADAR OPÉRATIONNEL.";

    }, 2800);


});