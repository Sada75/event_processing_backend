import {
  FaChartLine,
  FaCircleNodes,
  FaFire,
  FaGaugeHigh,
  FaMapLocationDot,
} from 'react-icons/fa6';

export const navItems = [
  { id: 'overview', label: 'Overview', icon: FaGaugeHigh },
  { id: 'ride-activity', label: 'Ride Activity', icon: FaChartLine },
  { id: 'surge-zones', label: 'Surge Zones', icon: FaFire },
  { id: 'demand-map', label: 'Demand Map', icon: FaMapLocationDot },
  { id: 'streams', label: 'Streams', icon: FaCircleNodes },
];
