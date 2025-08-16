import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, BarChart, Bar, RadialBarChart, RadialBar } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color?: string;
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
}

interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

interface InteractiveChartsProps {
  type: 'donut' | 'line' | 'area' | 'bar' | 'radial' | 'bubble';
  data: ChartData[] | TimeSeriesData[];
  title?: string;
  subtitle?: string;
  height?: number;
  showTooltip?: boolean;
  interactive?: boolean;
  gradientColors?: string[];
  className?: string;
}

const InteractiveCharts: React.FC<InteractiveChartsProps> = ({
  type,
  data,
  title,
  subtitle,
  height = 300,
  showTooltip = true,
  interactive = true,
  gradientColors = ['#8B5CF6', '#A855F7', '#C084FC'],
  className = ''
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoveredData, setHoveredData] = useState<any>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Trigger animation completion after mount
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const renderCustomTooltip = (active: boolean, payload: any[], label: string) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-xl p-3 shadow-2xl"
        >
          <div className="text-white font-medium text-sm">
            {payload[0].name || label}
          </div>
          <div className="text-white/80 text-xs">
            Value: {payload[0].value}
            {payload[0].payload.percentage && (
              <span className="ml-2">({payload[0].payload.percentage}%)</span>
            )}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const renderDonutChart = () => {
    const chartData = data as ChartData[];
    const COLORS = gradientColors;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <defs>
            {COLORS.map((color, index) => (
              <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
            onMouseEnter={(data, index) => interactive && setHoveredData({ data, index })}
            onMouseLeave={() => setHoveredData(null)}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || `url(#gradient-${index % COLORS.length})`}
                stroke={hoveredData?.index === index ? '#fff' : 'transparent'}
                strokeWidth={hoveredData?.index === index ? 2 : 0}
                style={{
                  filter: hoveredData?.index === index ? 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))' : 'none',
                  transform: hoveredData?.index === index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: 'center',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={({ active, payload, label }) => renderCustomTooltip(active, payload, label)} />}
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderLineChart = () => {
    const chartData = data as TimeSeriesData[];

    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={0.8} />
              <stop offset="50%" stopColor={gradientColors[1]} stopOpacity={0.9} />
              <stop offset="100%" stopColor={gradientColors[2]} stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={{
              fill: gradientColors[1],
              strokeWidth: 2,
              stroke: '#fff',
              r: 4
            }}
            activeDot={{
              r: 6,
              fill: gradientColors[1],
              stroke: '#fff',
              strokeWidth: 2,
              style: { filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' }
            }}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          {showTooltip && <Tooltip content={({ active, payload, label }) => renderCustomTooltip(active, payload, label)} />}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderAreaChart = () => {
    const chartData = data as TimeSeriesData[];

    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={0.6} />
              <stop offset="50%" stopColor={gradientColors[1]} stopOpacity={0.3} />
              <stop offset="100%" stopColor={gradientColors[2]} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={gradientColors[0]}
            strokeWidth={2}
            fill="url(#areaGradient)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
          {showTooltip && <Tooltip content={({ active, payload, label }) => renderCustomTooltip(active, payload, label)} />}
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderBarChart = () => {
    const chartData = data as ChartData[];

    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            {chartData.map((_, index) => (
              <linearGradient key={index} id={`barGradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={gradientColors[index % gradientColors.length]} stopOpacity={0.8} />
                <stop offset="100%" stopColor={gradientColors[index % gradientColors.length]} stopOpacity={0.4} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#barGradient-${index})`}
              />
            ))}
          </Bar>
          {showTooltip && <Tooltip content={({ active, payload, label }) => renderCustomTooltip(active, payload, label)} />}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderRadialChart = () => {
    const chartData = data as ChartData[];

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={chartData}>
          <defs>
            {chartData.map((_, index) => (
              <linearGradient key={index} id={`radialGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradientColors[index % gradientColors.length]} stopOpacity={0.8} />
                <stop offset="100%" stopColor={gradientColors[index % gradientColors.length]} stopOpacity={0.4} />
              </linearGradient>
            ))}
          </defs>
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#radialGradient-${index})`}
              />
            ))}
          </RadialBar>
          {showTooltip && <Tooltip content={({ active, payload, label }) => renderCustomTooltip(active, payload, label)} />}
        </RadialBarChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'donut':
        return renderDonutChart();
      case 'line':
        return renderLineChart();
      case 'area':
        return renderAreaChart();
      case 'bar':
        return renderBarChart();
      case 'radial':
        return renderRadialChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <motion.div
      ref={chartRef}
      className={`relative bg-white/5 dark:bg-black/10 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <motion.h3
              className="text-lg font-bold text-gray-900 dark:text-white mb-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h3>
          )}
          {subtitle && (
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      {/* Chart Container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {renderChart()}

        {/* Hover overlay for additional interactivity */}
        {interactive && hoveredData && (
          <motion.div
            className="absolute top-4 right-4 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl p-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="text-white font-medium text-sm">
              {hoveredData.data.name}
            </div>
            <div className="text-white/80 text-xs">
              {hoveredData.data.value}
              {hoveredData.data.percentage && ` (${hoveredData.data.percentage}%)`}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Floating animation particles */}
      {animationComplete && type === 'donut' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default InteractiveCharts;
