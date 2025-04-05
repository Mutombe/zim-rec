import React from 'react';
import { useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { selectEnergyTypeStatistics } from '../../redux/selectors';
import { DataGrid } from '@mui/x-data-grid';
import { Check, X, Badge } from 'lucide-react';
import { IconButton, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const EnergyPieChart = () => {
  const data = useSelector(selectEnergyTypeStatistics);
  const theme = useTheme();

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main
  ];

  return (
    <motion.div 
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="relative"
    >
      <PieChart width={400} height={400}>
        <Pie
          data={Object.entries(data).map(([name, value]) => ({ name, value }))}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={5}
          dataKey="value"
        >
          {Object.entries(data).map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: 'none',
            borderRadius: '8px',
            boxShadow: theme.shadows[3]
          }}
        />
      </PieChart>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">
            {Object.values(data).reduce((a, b) => a + b, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total MW</div>
        </div>
      </div>
    </motion.div>
  );
};


export const StatsCard = ({ title, value, trend, percentage, unit, icon }) => {
  const getIcon = () => {
    const icons = {
      device: '⚡',
      check: '✅',
      alert: '⚠️',
      energy: '🌞'
    };
    return <span className="text-2xl">{icons[icon]}</span>;
  };

  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-lg"
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-center">
        {getIcon()}
        <div className="text-right">
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <div className="text-2xl font-bold">
            {value}{unit && <span className="text-sm ml-1">{unit}</span>}
          </div>
          {trend && (
            <span className="text-green-500 text-sm">+{trend} new</span>
          )}
          {percentage && (
            <div className="h-1 bg-gray-100 mt-2 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};



export const EnergyPieChart1 = () => {
  const data = useSelector(selectEnergyTypeStatistics);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={Object.entries(data).map(([name, value]) => ({ name, value }))}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {Object.entries(data).map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// RecentActivityList.jsx


export const RecentActivityList = ({ items, type }) => {
  const getIcon = (type) => {
    const icons = {
      device: '📱',
      request: '📨'
    };
    return icons[type];
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-xl mr-3">{getIcon(type)}</span>
            <div>
              <div className="font-medium">{item.name || item.deviceName}</div>
              <div className="text-sm text-gray-500">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const DataTable = ({ title, data, type }) => {
  const columns = {
    device: [
      { field: 'name', headerName: 'Device Name', flex: 1 },
      { field: 'type', headerName: 'Type', flex: 1 },
      { field: 'status', headerName: 'Status', flex: 1 }
    ],
    request: [
      { field: 'device', headerName: 'Device', flex: 1 },
      { field: 'production', headerName: 'Production', flex: 1 },
      { field: 'status', headerName: 'Status', flex: 1 }
    ]
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="h-96">
        <DataGrid
          rows={data}
          columns={columns[type]}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id}
          disableSelectionOnClick
        />
      </div>
    </motion.div>
  );
};


export const ApprovalQueue = ({ devicesCount, requestsCount }) => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Approval Queue</h2>
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <Badge badgeContent={devicesCount} color="error">
                <span>Devices Pending</span>
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Badge badgeContent={requestsCount} color="error">
                <span>Requests Pending</span>
              </Badge>
            </div>
          </div>
        </div>
        <Button 
          variant="contained" 
          className="!bg-white !text-blue-600 hover:!bg-gray-100"
        >
          Review Now
        </Button>
      </div>
    </motion.div>
  );
};

// EnergyTypeBarChart.jsx


export const EnergyTypeBarChart = () => {
  const data = useSelector(selectEnergyTypeStatistics);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={Object.entries(data).map(([name, value]) => ({ name, value }))}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar 
          dataKey="value" 
          fill="#3b82f6" 
          radius={[4, 4, 0, 0]}
          animationBegin={100}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};



export const AdminDataTable = ({ title, data, type }) => {
  const columns = {
    device: [
      { field: 'name', headerName: 'Device Name', flex: 1 },
      { field: 'owner', headerName: 'Owner', flex: 1 },
      { field: 'type', headerName: 'Type', flex: 1 },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: () => (
          <div className="space-x-2">
            <IconButton color="success">
              <Check />
            </IconButton>
            <IconButton color="error">
              <X />
            </IconButton>
          </div>
        )
      }
    ],
    request: [
      { field: 'device', headerName: 'Device', flex: 1 },
      { field: 'owner', headerName: 'Owner', flex: 1 },
      { field: 'production', headerName: 'Production', flex: 1 },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: () => (
          <div className="space-x-2">
            <IconButton color="success">
              <Check />
            </IconButton>
            <IconButton color="error">
              <X />
            </IconButton>
          </div>
        )
      }
    ]
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="h-96">
        <DataGrid
          rows={data}
          columns={columns[type]}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id}
          disableSelectionOnClick
        />
      </div>
    </motion.div>
  );
};