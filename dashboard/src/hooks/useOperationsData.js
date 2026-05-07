import { useCallback, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

import { SOCKET_URL, fetchRideMetrics } from '../services/metricsApi';

const initialMetrics = {
  activeRides: 0,
  completedRides: 0,
  cancelledRides: 0,
  topAreas: [],
  surgeAreas: [],
  cityDemand: [],
};

export function useOperationsData() {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [rideTrend, setRideTrend] = useState([]);
  const [streamTrend, setStreamTrend] = useState([]);
  const [eventFeed, setEventFeed] = useState([]);
  const [streamMetrics, setStreamMetrics] = useState({
    total: 0,
    activeUsers: 0,
    topUsers: [],
    timestamp: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [socketStatus, setSocketStatus] = useState('connecting');

  const pushFeedItem = useCallback((item) => {
    setEventFeed((current) => [item, ...current].slice(0, 18));
  }, []);

  const refreshMetrics = useCallback(async () => {
    try {
      const nextMetrics = await fetchRideMetrics();
      const now = new Date();

      setMetrics(nextMetrics);
      setRideTrend((current) => [
        ...current,
        {
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          active: nextMetrics.activeRides,
          completed: nextMetrics.completedRides,
          cancelled: nextMetrics.cancelledRides,
          surge: nextMetrics.surgeAreas.length,
        },
      ].slice(-20));

      pushFeedItem({
        id: `poll-${now.getTime()}`,
        type: 'REST_SYNC',
        title: 'Ride metrics refreshed',
        detail: `${nextMetrics.activeRides} active rides, ${nextMetrics.surgeAreas.length} surge zones`,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });

      setApiError('');
    } catch (error) {
      setApiError(error.message || 'Unable to load metrics');
      pushFeedItem({
        id: `error-${Date.now()}`,
        type: 'API_ERROR',
        title: 'Metrics API unavailable',
        detail: 'Waiting for the existing API to respond',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    } finally {
      setIsLoading(false);
    }
  }, [pushFeedItem]);

  useEffect(() => {
    const initialLoad = window.setTimeout(refreshMetrics, 0);
    const interval = window.setInterval(refreshMetrics, 2000);

    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [refreshMetrics]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 10,
      reconnectionDelay: 800,
    });

    socket.on('connect', () => {
      setSocketStatus('connected');
      pushFeedItem({
        id: `socket-connect-${Date.now()}`,
        type: 'SOCKET_ONLINE',
        title: 'Live stream connected',
        detail: 'Receiving existing Socket.IO metrics events',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    });

    socket.on('disconnect', () => {
      setSocketStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setSocketStatus('reconnecting');
    });

    socket.on('metrics', (payload) => {
      const eventTime = new Date(payload.timestamp || Date.now());
      setStreamMetrics(payload);
      setStreamTrend((current) => [
        ...current,
        {
          time: eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          events: payload.total || 0,
          activeUsers: payload.activeUsers || 0,
        },
      ].slice(-24));

      pushFeedItem({
        id: `stream-${payload.timestamp || Date.now()}`,
        type: 'LIVE_METRIC',
        title: 'Streaming metrics tick',
        detail: `${payload.total || 0} events processed, ${payload.activeUsers || 0} active users`,
        time: eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [pushFeedItem]);

  const totals = useMemo(() => {
    const rideTotal = metrics.activeRides + metrics.completedRides + metrics.cancelledRides;
    const completionRate = rideTotal ? Math.round((metrics.completedRides / rideTotal) * 100) : 0;
    const cancellationRate = rideTotal ? Math.round((metrics.cancelledRides / rideTotal) * 100) : 0;

    return {
      rideTotal,
      completionRate,
      cancellationRate,
    };
  }, [metrics.activeRides, metrics.completedRides, metrics.cancelledRides]);

  return {
    ...metrics,
    ...totals,
    rideTrend,
    streamTrend,
    eventFeed,
    streamMetrics,
    isLoading,
    apiError,
    socketStatus,
  };
}
