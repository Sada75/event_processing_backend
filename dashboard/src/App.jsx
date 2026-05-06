import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const socket = io('http://localhost:3000');

function App() {
  const [metrics, setMetrics] = useState({
    total: 0,
    activeUsers: 0,
    topUsers: [],
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    socket.on('metrics', (data) => {
      setMetrics(data);

      setChartData(prev => {
        const updated = [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            total: data.total,
          },
        ];

        return updated.slice(-20);
      });
    });

    return () => {
      socket.off('metrics');
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 Real-Time Analytics Dashboard</h1>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <h2>Total Events</h2>
          <p>{metrics.total}</p>
        </div>

        <div>
          <h2>Active Users</h2>
          <p>{metrics.activeUsers}</p>
        </div>
      </div>

      <h2>📈 Events Over Time</h2>

      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#8884d8" />
      </LineChart>

      <h2>🔥 Top Users</h2>

      <ul>
        {metrics.topUsers.map((user, idx) => (
          <li key={idx}>
            {user.user} — {user.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;