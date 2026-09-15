#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <HardwareSerial.h>
#include <DFRobotDFPlayerMini.h>

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

// ---------- DFPLAYER ----------
// Utilisation de l'UART2 de l'ESP32 (RX2=16, TX2=17)
HardwareSerial mySoftwareSerial(2);
DFRobotDFPlayerMini myDFPlayer;

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

  Wire.begin(21, 22);   

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Batterie : 86% ");

  connectWiFi();
  connectMQTT();

  // ---------- INITIALISATION DFPLAYER ----------
  mySoftwareSerial.begin(9600, SERIAL_8N1, 16, 17);

  Serial.println("Initialisation du DFPlayer...");

  if (!myDFPlayer.begin(mySoftwareSerial)) {
    Serial.println("Erreur: DFPlayer non detecte !");
    Serial.println("Verifiez le cablage et la carte SD.");
    while (true) {
      delay(1000);
    }
  }

  Serial.println("DFPlayer connecte avec succes !");
  myDFPlayer.volume(30); // volume de 0 (muet) a 30 (max)
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

    myDFPlayer.play(1); // joue le son 0001.mp3 au moment de l'ouverture

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