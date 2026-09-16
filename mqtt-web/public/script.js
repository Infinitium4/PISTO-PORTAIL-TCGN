
function startPlanetScan() {

    const button = document.getElementById("scanButton");
    const progress = document.getElementById("scanProgress");
    const percent = document.getElementById("scanPercent");
    const scanText = document.getElementById("scanText");
    const results = document.getElementById("scanResults");

    const planetName = document.getElementById("planetName");

    const atmosphere = document.getElementById("atmosphere");
    const population = document.getElementById("population");
    const lifeforms = document.getElementById("lifeforms");
    const stability = document.getElementById("stability");
    const danger = document.getElementById("danger");

    /*
     * Sécurité : vérification des éléments
     */

    if (
        !button ||
        !progress ||
        !percent ||
        !scanText ||
        !results ||
        !planetName
    ) {
        console.error("Erreur : éléments du scanner introuvables.");
        return;
    }


    /*
     * Désactivation du bouton pendant le scan
     */

    button.disabled = true;

    results.classList.remove("active");

    progress.style.width = "0%";

    percent.textContent = "0%";


    /*
     * Récupération du vrai nom de la planète
     * depuis le <h1> de ta page PHP
     */

    const pagePlanetName =
        document.querySelector(".wiki h1");

    if (pagePlanetName) {

        planetName.textContent =
            pagePlanetName.textContent.trim();

    } else {

        planetName.textContent = "INCONNUE";

    }


    /*
     * Génération des coordonnées dimensionnelles
     */

    const coordX = document.getElementById("coordX");
    const coordY = document.getElementById("coordY");
    const coordZ = document.getElementById("coordZ");

    if (coordX) {
        coordX.textContent =
            Math.floor(Math.random() * 999);
    }

    if (coordY) {
        coordY.textContent =
            Math.floor(Math.random() * 999);
    }

    if (coordZ) {
        coordZ.textContent =
            Math.floor(Math.random() * 999);
    }


    /*
     * Texte affiché pendant le scan
     */

    const steps = [

        "> Connexion au réseau interdimensionnel...",

        "> Recherche de la signature planétaire...",

        "> Analyse de l'atmosphère...",

        "> Recherche de formes de vie...",

        "> Calcul de la stabilité dimensionnelle...",

        "> Évaluation du niveau de danger...",

        "> Analyse terminée."

    ];


    /*
     * Réinitialisation du terminal
     */

    scanText.innerHTML =
        "> Initialisation du scanner...";


    /*
     * Variables de progression
     */

    let progressValue = 0;

    let stepIndex = 0;


    /*
     * Animation du scan
     */

    const interval = setInterval(() => {

        progressValue++;


        /*
         * Barre de progression
         */

        progress.style.width =
            progressValue + "%";


        /*
         * Pourcentage
         */

        percent.textContent =
            progressValue + "%";


        /*
         * Affichage des différentes étapes
         */

        if (
            progressValue % 14 === 0 &&
            stepIndex < steps.length
        ) {

            scanText.innerHTML +=
                "<br>" + steps[stepIndex];

            stepIndex++;

        }


        /*
         * Scan terminé
         */

        if (progressValue >= 100) {

            clearInterval(interval);

            generateResults();

            button.disabled = false;

        }

    }, 35);


    /*
     * Génération des résultats
     */

    function generateResults() {


        /*
         * Atmosphères possibles
         */

        const atmospheres = [

            "OXYGÈNE",
            "MÉTHANE",
            "TOXIQUE",
            "INCONNUE",
            "AZOTE"

        ];


        const atmosphereValue =
            atmospheres[
                Math.floor(
                    Math.random() * atmospheres.length
                )
            ];


        /*
         * Population
         */

        const populationValue =
            Math.floor(
                Math.random() * 9000000
            );


        /*
         * Formes de vie
         */

        const lifeValue =
            Math.floor(
                Math.random() * 500
            );


        /*
         * Stabilité dimensionnelle
         */

        const stabilityValue =
            Math.floor(
                Math.random() * 100
            );


        /*
         * Niveau de danger
         */

        const dangerValue =
            Math.floor(
                Math.random() * 100
            );


        /*
         * Affichage des résultats
         */

        if (atmosphere) {

            atmosphere.textContent =
                atmosphereValue;

        }


        if (population) {

            population.textContent =
                populationValue.toLocaleString("fr-FR");

        }


        if (lifeforms) {

            lifeforms.textContent =
                lifeValue;

        }


        if (stability) {

            stability.textContent =
                stabilityValue + "%";

        }


        if (danger) {

            danger.textContent =
                dangerValue + "%";

        }


        /*
         * Affichage du bloc de résultats
         */

        results.classList.add("active");


        /*
         * Message final
         */

        scanText.innerHTML +=
            "<br><br>> SCAN TERMINÉ." +
            "<br>> Données récupérées avec succès.";


    }

}
