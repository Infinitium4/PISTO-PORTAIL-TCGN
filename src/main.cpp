#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define JOY_X 34
#define JOY_Y 35
#define JOY_SW 32
#define BTN 33

const char* dimensions[] = {
  "C-131",
  "citadel",
  "C-229"
};

const int NB_DIMENSIONS = sizeof(dimensions) / sizeof(dimensions[0]);
int currentDimension = 0;

// ---------- CONFIG WIFI & MQTT ----------
const char* ssid = "WIFI_LABO";
const char* password = "EpsiWis2018!";
const char* mqtt_server = "172.16.89.41";
const int mqtt_port = 1883;
const char* mqtt_user = "monuser";
const char* mqtt_password = "TCGN";
const char* mqtt_topic = "ricklab/dimensions";

WiFiClient espClient;
PubSubClient client(espClient);

LiquidCrystal_I2C lcd(0x27, 16, 2);

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
      Serial.println("connectÃ© !");
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

  Wire.begin(21, 22);   

  lcd.init();
  lcd.backlight();

  connectWiFi();
  connectMQTT();
}

void loop() {

  if (!client.connected()) {
    connectMQTT();
  }
  client.loop();

  int x = analogRead(JOY_X);
  int sw = digitalRead(JOY_SW);

  if (x == 0){
    lcd.clear();

    currentDimension = (currentDimension - 1 + NB_DIMENSIONS) % NB_DIMENSIONS;
    lcd.setCursor(0, 0);
    lcd.print("DIMENSION :");
    lcd.setCursor(0, 1);
    lcd.print(dimensions[currentDimension]);
    delay(100);
  }
  
  if (x == 4095){
    lcd.clear();

    currentDimension = (currentDimension + 1 + NB_DIMENSIONS) % NB_DIMENSIONS;
    lcd.setCursor(0, 0);
    lcd.print("DIMENSION :");
    lcd.setCursor(0, 1);
    lcd.print(dimensions[currentDimension]);
    delay(100);
  }

  if (digitalRead(BTN) == LOW){
    lcd.clear();

    lcd.setCursor(0, 0);
    lcd.print("Ouverture du");
    lcd.setCursor(0, 1);
    lcd.print("portail ...");
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
