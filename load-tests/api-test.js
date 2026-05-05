import http from 'k6/http';
import {sleep} from 'k6';


export const options = {
    // vus : 1000,   // virtual users
    // duration : '30s',  // test duration 

    stages: [
        { duration: '10s', target: 50 },
        { duration: '10s', target: 300 }, // spike
        { duration: '10s', target: 50 },
    ],
}

export default function(){
    http.get('http://localhost:3000/metrics/total-events');
    http.get('http://localhost:3000/metrics/top-users');
    http.get('http://localhost:3000/metrics/events-per-second');

    sleep(0.1);


}