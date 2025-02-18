interface MetricCardProps {
  title: string;
  value: number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function MetricCard({ title, value, description, trend }: MetricCardProps) {
  const trendColor = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  }[trend || 'neutral'];

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {trend && (
          <span className={`${trendColor} font-medium`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 mt-2">
        {value.toFixed(2)}
      </p>
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
} 