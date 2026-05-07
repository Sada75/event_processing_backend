import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

import {
  FaCar,
  FaFire,
  FaMapMarkedAlt,
  FaTimesCircle,
} from 'react-icons/fa';

import './App.css';

function App() {
  const [activeRides, setActiveRides] = useState(0);
  const [completedRides, setCompletedRides] = useState(0);
  const [cancelledRides, setCancelledRides] = useState(0);

  const [topAreas, setTopAreas] = useState([]);
  const [surgeAreas, setSurgeAreas] = useState([]);
  const [cityDemand, setCityDemand] = useState([]);

  const [chartData, setChartData] = useState([]);

  const fetchMetrics = async () => {
    const [
      active,
      completed,
      cancelled,
      top,
      surge,
      city,
    ] = await Promise.all([
      axios.get('http://localhost:3000/metrics/active-rides'),
      axios.get('http://localhost:3000/metrics/completed-rides'),
      axios.get('http://localhost:3000/metrics/cancelled-rides'),
      axios.get('http://localhost:3000/metrics/top-areas'),
      axios.get('http://localhost:3000/metrics/surge-areas'),
      axios.get('http://localhost:3000/metrics/city-demand'),
    ]);

    setActiveRides(active.data.activeRides);
    setCompletedRides(completed.data.completedRides);
    setCancelledRides(cancelled.data.cancelledRides);

    setTopAreas(top.data);
    setSurgeAreas(surge.data);
    setCityDemand(city.data);

    setChartData(prev => {
      const updated = [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          active: active.data.activeRides,
        },
      ];

      return updated.slice(-15);
    });
  };

  useEffect(() => {
    fetchMetrics();

    const interval = setInterval(fetchMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h1 className="title">
        🚖 Uber Ride Operations Dashboard
      </h1>

      <div className="cards">

        <div className="card">
          <FaCar className="icon blue" />
          <h2>Active Rides</h2>
          <p>{activeRides}</p>
        </div>

        <div className="card">
          <FaMapMarkedAlt className="icon green" />
          <h2>Completed</h2>
          <p>{completedRides}</p>
        </div>

        <div className="card">
          <FaTimesCircle className="icon red" />
          <h2>Cancelled</h2>
          <p>{cancelledRides}</p>
        </div>

        <div className="card">
          <FaFire className="icon orange" />
          <h2>Surge Areas</h2>
          <p>{surgeAreas.length}</p>
        </div>

      </div>

      <div className="chart-container">
        <h2>📈 Active Rides Over Time</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#333" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="active"
              stroke="#00ffcc"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bottom-grid">

        <div className="panel">
          <h2>🔥 Surge Zones</h2>

          {surgeAreas.map((area, idx) => (
            <div key={idx} className="surge-item">
              {area.city} - {area.area}
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>🏆 Top Ride Areas</h2>

          {topAreas.map((area, idx) => (
            <div key={idx} className="area-item">
              {area.area} — {area.rides}
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>🌆 City Demand</h2>

          {cityDemand.map((city, idx) => (
            <div key={idx} className="city-item">
              {city.city} — {city.requests}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;