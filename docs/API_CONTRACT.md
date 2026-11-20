# Sensor payload contract (planned)

This describes the future API payload; it is not currently implemented.

```json
{
  "device_id": "JM-01",
  "plot_id": "PLOT-001",
  "sampled_at": "2026-11-20T10:30:00+05:30",
  "sensor": "soil_moisture",
  "raw_adc": 1830,
  "calibrated_vwc_percent": null,
  "calibration_version": null,
  "battery_voltage": null,
  "signal_status": "serial-demo"
}
```

The calibrated field must remain null until a site- and soil-specific calibration is completed. API must validate device identity, timestamps, ranges and duplicate samples.
