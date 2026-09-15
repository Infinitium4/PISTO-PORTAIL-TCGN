#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <HardwareSerial.h>
#include <DFRobotDFPlayerMini.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define JOY_X 34
#define JOY_Y 35
#define JOY_SW 32
#define BTN 33
#define LED_PIN 25

const int MAX_DIMENSIONS = 20;
String dimensions[MAX_DIMENSIONS];
int NB_DIMENSIONS = 0;
int currentDimension = 0;

// ---------- CONFIG LED ----------
const int LED_BASE = 50;    // intensité de base en continu (0-255)
const int LED_BOOST = 255;  // intensité max pendant le boost
const unsigned long boostDuration = 5000; // durée du boost en ms
bool ledBoosting = false;
unsigned long boostStartTime = 0;

// ---------- CONFIG WIFI & MQTT ----------
const char* ssid = "WIFI_LABO";
const char* password = "EpsiWis2018!";
const char* mqtt_server = "172.16.89.41";
const int mqtt_port = 1883;
const char* mqtt_user = "monuser";
const char* mqtt_password = "TCGN";
const char* mqtt_topic = "ricklab/dimensions";
const char* serverUrl = "http://172.16.89.41:3000/api/dimensions";

WiFiClient espClient;
PubSubClient client(espClient);

LiquidCrystal_I2C lcd(0x27, 16, 2);

HardwareSerial mySoftwareSerial(2);
DFRobotDFPlayerMini myDFPlayer;

void chargerDimensionsDepuisServeur() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(serverUrl);

  int code = http.GET();

  if (code == HTTP_CODE_OK) {
    String payload = http.getString();

    JsonDocument doc;
    DeserializationError err = deserializeJson(doc, payload);

    if (!err && doc.is<JsonArray>()) {
      NB_DIMENSIONS = 0;

      for (JsonVariant v : doc.as<JsonArray>()) {
        if (NB_DIMENSIONS < MAX_DIMENSIONS) {
          dimensions[NB_DIMENSIONS] = v.as<String>();
          NB_DIMENSIONS++;
        }
      }
    }
  } else {
    Serial.printf("Erreur HTTP : %d\n", code);
  }

  http.end();
}

void connectWiFi() {
  Serial.print("Connexion WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connecte, IP: " + WiFi.localIP().toString());
}

void connectMQTT() {
  client.setServer(mqtt_server, mqtt_port);

  while (!client.connected()) {
    Serial.print("Connexion MQTT... ");

    if (client.connect("ESP32_Client", mqtt_user, mqtt_password)) {
      Serial.println("connecte !");
    } else {
      Serial.print("Erreur, rc=");
      Serial.print(client.state());
      Serial.println(" nouvelle tentative dans 2s");
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(BTN, INPUT_PULLUP);
  pinMode(JOY_SW, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);

  analogWrite(LED_PIN, LED_BASE); // LED allumée en continu à intensité de base

  Wire.begin(21, 22);   

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Batterie : 86% ");

  connectWiFi();
  connectMQTT();

  mySoftwareSerial.begin(9600, SERIAL_8N1, 16, 17);

  if (!myDFPlayer.begin(mySoftwareSerial)) {
    Serial.println("Erreur: DFPlayer non detecte !");
    while (true) {
      delay(1000);
    }
  }

  myDFPlayer.volume(30);
}

void loop() {

  if (!client.connected()) {
    connectMQTT();
  }
  client.loop();

  // ---------- GESTION DU BOOST LED (non bloquant) ----------
  if (ledBoosting && millis() - boostStartTime > boostDuration) {
    analogWrite(LED_PIN, LED_BASE); // retour à l'intensité normale
    ledBoosting = false;
  }

  int x = analogRead(JOY_X);
  int sw = digitalRead(JOY_SW);

  if (sw == LOW) {
    lcd.clear();
    lcd.print("Synchronisation");

    chargerDimensionsDepuisServeur();

    lcd.clear();
    lcd.print("Maj : ");
    lcd.print(NB_DIMENSIONS);
    lcd.setCursor(0,1);
    lcd.print("dimensions");

    delay(500);

    while (digitalRead(JOY_SW) == LOW) {
      delay(10);
    }
  }

  if (x == 0){
    lcd.clear();
    currentDimension = (currentDimension - 1 + NB_DIMENSIONS) % NB_DIMENSIONS;
    lcd.setCursor(0, 0);
    lcd.print("DIMENSION :");
    lcd.setCursor(0, 1);
    lcd.print(dimensions[currentDimension]);
    
    while (digitalRead(JOY_X) == 0) {
      delay(10);
    }
  }
  
  if (x == 4095){
    lcd.clear();
    currentDimension = (currentDimension + 1 + NB_DIMENSIONS) % NB_DIMENSIONS;
    lcd.setCursor(0, 0);
    lcd.print("DIMENSION :");
    lcd.setCursor(0, 1);
    lcd.print(dimensions[currentDimension]);

    while (digitalRead(JOY_X) == 4095) {
      delay(10);
    }
  }

  if (digitalRead(BTN) == LOW){
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Ouverture du");
    lcd.setCursor(0, 1);
    lcd.print("portail ...");

    // ---------- DECLENCHEMENT DU BOOST LED ----------
    analogWrite(LED_PIN, LED_BOOST);
    ledBoosting = true;
    boostStartTime = millis();

    myDFPlayer.play(1);

    delay(2000);

    client.publish(mqtt_topic, dimensions[currentDimension]);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Portail ouvert");
    lcd.setCursor(0, 1);
    lcd.print("avec succes !");
    delay(500);
  }

  delay(100);
}