import { useState } from "react";
import { 
 
  RefreshCw,
  Download,
 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
const chartData = [
  { month: 'Jan', totalEmployee: 15000000, totalProjects: 12000000, attendanceRate: 8000000 },
  { month: 'Feb', totalEmployee: 18000000, totalProjects: 14000000, attendanceRate: 9000000 },
  { month: 'Mar', totalEmployee: 16000000, totalProjects: 13000000, attendanceRate: 7000000 },
  { month: 'Apr', totalEmployee: 20000000, totalProjects: 16000000, attendanceRate: 11000000 },
  { month: 'May', totalEmployee: 17000000, totalProjects: 15000000, attendanceRate: 10000000 },
  { month: 'Jun', totalEmployee: 22000000, totalProjects: 18000000, attendanceRate: 14000000 },
  { month: 'Jul', totalEmployee: 25000000, totalProjects: 20000000, attendanceRate: 16000000 }
];

export const ChartSection = () => {
  const [activeTab, setActiveTab] = useState('Current Week');
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Welcome Back Fayyaz !</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-8 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
          <span className="text-sm font-medium">Current Week</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Previous Week</span>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000000}M`}
            />
            <Tooltip 
              formatter={(value) => [value.toLocaleString(), '']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="totalEmployee" 
              stroke="#1F2937" 
              strokeWidth={3}
              dot={{ fill: '#1F2937', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#1F2937' }}
            />
            <Line 
              type="monotone" 
              dataKey="totalProjects" 
              stroke="#9CA3AF" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="attendanceRate" 
              stroke="#60A5FA" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

