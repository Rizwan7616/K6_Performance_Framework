import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3,
  duration: '15s',
  thresholds: {
    // Calibrated to 500ms for stable public web routing and zero CI false alarms
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const url = __ENV.TARGET_URL || 'https://test-api.k6.io/public/crocodiles/';
  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'latency below 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}