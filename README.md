# JalMitra AI

**Affordable irrigation intelligence. Smarter shared-water decisions.**

JalMitra AI is a prototype-stage decision-support platform for small and marginal farmers. It is designed to combine field soil-moisture observations, weather context and crop-stage information into understandable irrigation guidance, with an optional community schedule for shared water resources.

> **Prototype honesty:** The first commit will provide a frontend demonstration with illustrative readings and an ESP32 firmware starting point. It is not connected to live sensors, a weather provider, or a production backend yet. No measured water savings or agronomic accuracy is claimed.

## MVP scope

- Responsive farmer dashboard
- Field moisture overview and illustrative trend
- Explainable advisory states
- Community shared-water schedule demonstration
- English / Marathi interface toggle
- ESP32 firmware starter for a capacitive moisture sensor
- Architecture and validation documentation

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Safety and agronomy

- The first prototype is advisory-only. It does not switch pumps or valves.
- Recommendations must be configured with local crop, soil, growth-stage and agronomist-reviewed thresholds.
- Farmers remain responsible for field decisions.
- Do not use demo readings as real farm measurements.

## Team

JALPIT INNOVATORS — SEVA FIRST Innovation Challenge 2026, Maharashtra Zone.

- Deepak Tandale — Team Lead
- Krushna Ingole — Hardware & electronics
- Shubham Shegukar — Software & testing
- Yogesh Chavan — Field research
- Shravani Thorat — UI/UX & documentation

Roles are proposed allocations and should be confirmed by all members.
