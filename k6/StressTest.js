import http from 'k6/http';
import { check, sleep } from 'k6';
//Como rodar o teste com o relatório: k6 run --out json=StressTest.json StressTest.js

export let options = {
  stages: [
    { duration: '1m', target: 100 }, // ramp up to 100 users
    { duration: '2m', target: 100 }, // stay at 100 users
    { duration: '1m', target: 0 }, // ramp down to 0 users
  ],
  thresholds: {
    // 95% of requests must complete below 500ms
    'http_req_duration': ['p(95)<500'],
    // 99% of static asset requests must complete below 200ms
    'http_req_duration{staticAsset:yes}': ['p(99)<200'],
    // 99% of dynamic requests must complete below 500ms
    'http_req_duration{staticAsset:no}': ['p(99)<500'],
    // at least 100 requests per second
    http_reqs: ['rate>100'],
  },
};

export default function() {
  let res = http.get('https://moodle.poa.ifrs.edu.br/login/index.php');
  check(res, { 'status is 200': (r) => r.status === 200 });

  sleep(Math.random() * 3); // random sleep between 0-3 seconds

 // res = http.get('https://moodle.poa.ifrs.edu.br/assets/styles.css');
//  check(res, {
 //   'status is 200': (r) => r.status === 200,
 //   'content type is CSS': (r) => r.headers['Content-Type'] === 'text/css',
 // });

  sleep(Math.random() * 2); // random sleep between 0-2 seconds
}