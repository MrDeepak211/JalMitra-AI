/*
 * JalMitra AI — ESP32 soil moisture sensor node (starter firmware)
 *
 * Calibrate ADC readings in actual soil and at the chosen installation depth.
 * Raw ADC values are NOT universal moisture percentages.
 * This starter emits serial JSON only; no live API or pump control is implemented.
 */
#include <Arduino.h>
constexpr int SOIL_PIN = 34;
constexpr int SAMPLE_COUNT = 10;
constexpr unsigned long SAMPLE_INTERVAL_MS = 30000;
unsigned long lastSample = 0;

int readSoilRaw() {
  long total = 0;
  for (int i = 0; i < SAMPLE_COUNT; i++) { total += analogRead(SOIL_PIN); delay(10); }
  return static_cast<int>(total / SAMPLE_COUNT);
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  pinMode(SOIL_PIN, INPUT);
  delay(500);
  Serial.println("{\"device\":\"jalmitra-esp32\",\"status\":\"booted\",\"mode\":\"serial-demo\"}");
}

void loop() {
  const unsigned long now = millis();
  if (now - lastSample >= SAMPLE_INTERVAL_MS || lastSample == 0) {
    lastSample = now;
    const int raw = readSoilRaw();
    Serial.print("{\"device_id\":\"JM-01\",\"sensor\":\"soil_moisture\",\"raw_adc\":");
    Serial.print(raw);
    Serial.print(",\"sample_ms\":");
    Serial.print(now);
    Serial.println(",\"calibration\":\"pending\"}");
  }
  delay(50);
}
