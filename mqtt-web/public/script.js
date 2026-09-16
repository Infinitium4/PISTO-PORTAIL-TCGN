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

    button.disabled = true;

    results.classList.remove("active");

    progress.style.width = "0%";

    percent.textContent = "0%";

    /*
     * Génération d'une planète aléatoire
     */

    const prefixes = [
        "Xan",
        "Zor",
        "Blip",
        "Cron",
        "Vort",
        "Gaz",
        "Meep",
        "Kron"
    ];

    const suffixes = [
        "-42",
        "-137",
        "-7",
        "-900",
        "-B",
        "-X",
        "-Prime",
        "-666"
    ];

    const randomPrefix =
        prefixes[Math.floor(Math.random() * prefixes.length)];

    const randomSuffix =
        suffixes[Math.floor(Math.random() * suffixes.length)];

    planetName.textContent =
        randomPrefix + randomSuffix;


    /*
     * Coordonnées dimensionnelles
     */

    document.getElementById("coordX").textContent =
        Math.floor(Math.random() * 999);

    document.getElementById("coordY").textContent =
        Math.floor(Math.random() * 999);

    document.getElementById("coordZ").textContent =
        Math.floor(Math.random() * 999);


    /*
     * Étapes du scanner
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


    let progressValue = 0;

    let stepIndex = 0;


    /*
     * Animation du scan
     */

    const interval = setInterval(() => {

        progressValue++;

        progress.style.width =
            progressValue + "%";

        percent.textContent =
            progressValue + "%";


        /*
         * Changement de texte
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


        const populationValue =
            Math.floor(
                Math.random() * 9000000
            );


        const lifeValue =
            Math.floor(
                Math.random() * 500
            );


        const stabilityValue =
            Math.floor(
                Math.random() * 100
            );


        const dangerValue =
            Math.floor(
                Math.random() * 100
            );


        atmosphere.textContent =
            atmosphereValue;

        population.textContent =
            populationValue.toLocaleString("fr-FR");

        lifeforms.textContent =
            lifeValue;

        stability.textContent =
            stabilityValue + "%";

        danger.textContent =
            dangerValue + "%";


        results.classList.add("active");

    }

}

