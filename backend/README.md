# JalMitra API (prototype)

## Run

```bash
npm run api
```

Default port: 4000. Set `PORT` and `CORS_ORIGIN` as environment variables if needed.

## Endpoints

- `GET /api/health` — service status.
- `GET /api/readings` — recent in-memory sensor payloads.
- `POST /api/readings` — accepts `device_id` and integer `raw_adc` (0–4095); optional `plot_id` and `sampled_at`.
- `POST /api/advisory` — returns a safe insufficient-data response until crop stage, soil calibration and verified weather are configured.

Example:

```bash
curl -X POST http://localhost:4000/api/readings \\
  -H 'content-type: application/json' \\
  -d '{"device_id":"JM-01","plot_id":"PLOT-001","raw_adc":1830}'
```

## Prototype limitations

- Data is stored in memory and is lost when the process restarts.
- There is no authentication or device credential system; do not expose this API publicly.
- CORS is configured for one origin, defaulting to the Vite dev server.
- Raw ADC values are not moisture percentages. Site-specific calibration is required.
- This API does not control pumps, valves or other machinery.
