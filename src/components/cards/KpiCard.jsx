export const KpiCard = ({ title, value, change, changeType, percentage, color }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${changeType === 'positive' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {change}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <span className="text-white text-sm font-semibold">{percentage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};