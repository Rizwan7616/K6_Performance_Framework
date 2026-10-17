# Enterprise k6 API Performance & Load Testing Framework

A continuous performance engineering harness powered by **Grafana k6**, validating transactional Service Level Objectives (SLOs), sub-second latency percentiles, and multi-step customer workflows within automated CI/CD pipelines.

## Architecture & Workflows
- **`scripts/smoke-test.js`**: Baseline sanity check ensuring connectivity and fundamental latency bounds.
- **`scripts/stress-test.js`**: Three-stage ramp-up scaling to 50 concurrent virtual users (VUs) to test system stability under peak volume.
- **`scripts/user-flow-test.js`**: End-to-end multi-step synthetic user flow using modular groups, custom transaction trend tracking, and automated HTML report generation.

## Performance Quality Gates (SLOs)
- `http_req_failed`: Error rate strictly below **1.0%** (Smoke) and **2.0%** (Stress).
- `http_req_duration`: 95th percentile latency below **500ms**; 99th percentile below **600ms**.
- **CI Enforcement**: GitHub Actions pipeline blocks code merges if any defined SLO threshold is breached and automatically publishes visual HTML performance reports.

## Local Execution

### 1. Run Baseline Smoke Test
```bash
k6 run scripts/smoke-test.js