import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 20 },
    { duration: '40s', target: 50 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<600'],
    http_req_failed: ['rate<0.02'],
  },
};

export default function () {
  const url = __ENV.TARGET_URL || 'https://test-api.k6.io/public/crocodiles/';
  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(0.5);
}