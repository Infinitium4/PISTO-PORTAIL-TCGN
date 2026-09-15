const express = require("express");
const WebSocket = require("ws");
const mqtt = require("mqtt");

const app = express();
const PORT = 3000;

// Sert les fichiers HTML
app.use(express.static("public"));

const server = app.listen(PORT, () => {
    console.log(`Serveur web : http://0.0.0.0:${PORT}`);
});

const wss = new WebSocket.Server({ server });

// Connexion au broker MQTT
const mqttClient = mqtt.connect("mqtt://172.16.89.41:1883", {
    username: "monuser",
    password: "TCGN"
});

mqttClient.on("connect", () => {
    console.log("Connecté au broker MQTT");
    mqttClient.subscribe("ricklab/dimensions");
});

mqttClient.on("message", (topic, message) => {
    const data = JSON.stringify({
        topic,
        message: message.toString()
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
});

// Route pour l'ESP32
app.get("/api/dimensions", async (req, res) => {
    const rows = await db.query("SELECT id FROM dimensions");

    res.json(rows.map(r => r.id));
});