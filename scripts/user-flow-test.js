import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

// Custom metric trends for individual endpoint tracking
const catalogDuration = new Trend('catalog_browse_duration');
const detailDuration = new Trend('detail_view_duration');

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 15 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    'catalog_browse_duration': ['p(95)<500'],
    'detail_view_duration': ['p(95)<400'],
    'http_req_failed': ['rate<0.02'],
  },
};

export default function () {
  const BASE_URL = __ENV.TARGET_URL || 'https://test-api.k6.io';

  group('01_Browse_Catalog', () => {
    const res = http.get(`${BASE_URL}/public/crocodiles/`);
    catalogDuration.add(res.timings.duration);

    check(res, {
      'catalog status is 200': (r) => r.status === 200,
      'catalog contains records': (r) => {
        try {
          return JSON.parse(r.body).length > 0;
        } catch (e) {
          return false;
        }
      },
    });
  });

  sleep(1);

  group('02_Inspect_Single_Item', () => {
    const res = http.get(`${BASE_URL}/public/crocodiles/1/`);
    detailDuration.add(res.timings.duration);

    check(res, {
      'detail status is 200': (r) => r.status === 200,
      'correct item id returned': (r) => {
        try {
          return JSON.parse(r.body).id === 1;
        } catch (e) {
          return false;
        }
      },
    });
  });

  sleep(1);
}

// Automatically compiles test telemetry into an HTML executive summary dashboard
export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
  };
}