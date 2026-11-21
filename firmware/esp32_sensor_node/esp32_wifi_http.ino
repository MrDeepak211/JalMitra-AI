/*
 * JalMitra AI — ESP32 Wi-Fi → prototype API sender
 *
 * Bench/demo use only. Set Wi-Fi credentials and API_HOST to a computer
 * running the JalMitra API on the SAME trusted local network.
 * Do not expose the prototype API to the public internet.
 *
 * Sensor calibration is pending: this sends raw ADC values only.
 */
#include <WiFi.h>
#include <HTTPClient.h>

const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* API_HOST = "192.168.1.10"; // Replace with backend computer's LAN IP
const uint16_t API_PORT = 4000;
const char* DEVICE_ID = "JM-01";
const char* PLOT_ID = "PLOT-001";
const int SOIL_PIN = 34;
const int SAMPLE_COUNT = 10;
const unsigned long SEND_INTERVAL_MS = 30000;
unsigned long lastSend = 0;

int readSoilRaw() {
  long total = 0;
  for (int i = 0; i < SAMPLE_COUNT; i++) {
    total += analogRead(SOIL_PIN);
    delay(10);
  }
  return (int)(total / SAMPLE_COUNT);
}

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  unsigned long started = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - started < 20000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("Connected. ESP32 IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("Wi-Fi connection timed out; will retry.");
  }
}

void postReading(int raw) {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    if (WiFi.status() != WL_CONNECTED) return;
  }

  HTTPClient http;
  String url = String("http://") + API_HOST + ":" + String(API_PORT) + "/api/readings";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  String payload = String("{\"device_id\":\"") + DEVICE_ID +
                   "\",\"plot_id\":\"" + PLOT_ID +
                   "\",\"raw_adc\":" + String(raw) + "}";

  int status = http.POST(payload);
  Serial.print("POST status: ");
  Serial.println(status);
  if (status > 0) {
    Serial.println(http.getString());
  } else {
    Serial.println("Request failed. Check API host, port and LAN firewall.");
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  pinMode(SOIL_PIN, INPUT);
  connectWiFi();
}

void loop() {
  if (millis() - lastSend >= SEND_INTERVAL_MS || lastSend == 0) {
    lastSend = millis();
    const int raw = readSoilRaw();
    Serial.print("Raw soil ADC: ");
    Serial.println(raw);
    postReading(raw);
  }
  delay(50);
}
