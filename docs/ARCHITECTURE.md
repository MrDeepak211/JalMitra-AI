# JalMitra AI — Architecture

## Data path

Capacitive soil-moisture probe → ESP32 ADC → calibrated sensor payload → API/storage → weather + crop context → explainable advisory rules → farmer dashboard.

Community scheduling is an opt-in workflow: participating farmers record availability for a shared pump/source; the interface displays a proposed schedule and conflicts. It does not determine legal water rights.

## Current implementation status

- Frontend uses illustrative static demo data.
- ESP32 firmware starter emits serial JSON only.
- No live sensor ingestion, authentication, weather integration, database or pump control is implemented yet.
- Advisory thresholds must be crop-, soil- and growth-stage-specific and reviewed with local agronomic guidance.

## Next sequence

1. Sensor calibration and serial payload validation.
2. API service with device identity, timestamps and validation.
3. Persistent storage for readings and field profiles.
4. Weather adapter with source and observation/forecast time.
5. Rule-based advisory engine with reason codes and safe fallback.
6. Farmer accounts, field management and opt-in community schedule.
