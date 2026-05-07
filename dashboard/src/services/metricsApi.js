import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const SOCKET_URL = API_BASE_URL;

export async function fetchRideMetrics() {
  const [active, completed, cancelled, topAreas, surgeAreas, cityDemand] = await Promise.all([
    client.get('/metrics/active-rides'),
    client.get('/metrics/completed-rides'),
    client.get('/metrics/cancelled-rides'),
    client.get('/metrics/top-areas'),
    client.get('/metrics/surge-areas'),
    client.get('/metrics/city-demand'),
  ]);

  return {
    activeRides: active.data.activeRides,
    completedRides: completed.data.completedRides,
    cancelledRides: cancelled.data.cancelledRides,
    topAreas: topAreas.data,
    surgeAreas: surgeAreas.data,
    cityDemand: cityDemand.data,
  };
}
