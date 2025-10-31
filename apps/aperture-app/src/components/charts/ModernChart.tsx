import React, { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, PieChart, LineChart } from 'lucide-react';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartProps {
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'donut' | 'area' | 'sparkline';
  title?: string;
  subtitle?: string;
  height?: number;
  animate?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  className?: string;
}

export function ModernChart({
  data,
  type,
  title,
  subtitle,
  height = 200,
  animate = true,
  showGrid = true,
  showLabels = true,
  className = ''
}: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for retina displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw chart based on type
    switch (type) {
      case 'line':
        drawLineChart(ctx, data, rect.width, rect.height, { showGrid, animate });
        break;
      case 'bar':
        drawBarChart(ctx, data, rect.width, rect.height, { showGrid, animate });
        break;
      case 'donut':
        drawDonutChart(ctx, data, rect.width, rect.height, { animate });
        break;
      case 'area':
        drawAreaChart(ctx, data, rect.width, rect.height, { showGrid, animate });
        break;
      case 'sparkline':
        drawSparklineChart(ctx, data, rect.width, rect.height, { animate });
        break;
    }
  }, [data, type, showGrid, animate]);

  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartDataPoint[],
    width: number,
    height: number,
    options: { showGrid: boolean; animate: boolean }
  ) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    // Draw grid
    if (options.showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }

      // Vertical grid lines
      for (let i = 0; i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
      }
    }

    // Draw line with gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 1)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 1)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Create smooth curve
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (data[i].value - minValue) / range;
      const y = height - padding - normalizedValue * chartHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        // Create smooth curve using quadratic bezier
        const prevX = padding + (chartWidth / (data.length - 1)) * (i - 1);
        const prevNormalizedValue = (data[i - 1].value - minValue) / range;
        const prevY = height - padding - prevNormalizedValue * chartHeight;

        const cpX = (prevX + x) / 2;
        ctx.quadraticCurveTo(cpX, prevY, x, y);
      }
    }
    ctx.stroke();

    // Draw data points with glow effect
    data.forEach((point, i) => {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (point.value - minValue) / range;
      const y = height - padding - normalizedValue * chartHeight;

      // Glow effect
      ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 1)';
      ctx.fill();

      // Inner point
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fill();
    });
  };

  const drawBarChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartDataPoint[],
    width: number,
    height: number,
    options: { showGrid: boolean; animate: boolean }
  ) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length * 0.6;
    const barSpacing = chartWidth / data.length * 0.4;
    const maxValue = Math.max(...data.map(d => d.value));

    // Draw grid
    if (options.showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
    }

    // Draw bars with gradient
    data.forEach((point, i) => {
      const x = padding + (chartWidth / data.length) * i + barSpacing / 2;
      const barHeight = (point.value / maxValue) * chartHeight;
      const y = height - padding - barHeight;

      // Create gradient for each bar
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, point.color || 'rgba(59, 130, 246, 0.8)');
      gradient.addColorStop(1, point.color || 'rgba(59, 130, 246, 0.3)');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Add subtle border
      ctx.strokeStyle = point.color || 'rgba(59, 130, 246, 1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barWidth, barHeight);
    });
  };

  const drawDonutChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartDataPoint[],
    width: number,
    height: number,
    options: { animate: boolean }
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const innerRadius = radius * 0.6;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -Math.PI / 2;

    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(147, 51, 234, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
    ];

    data.forEach((point, i) => {
      const sliceAngle = (point.value / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();

      ctx.fillStyle = point.color || colors[i % colors.length];
      ctx.fill();

      // Add subtle stroke
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    // Center circle with glass effect
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius);
    centerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = centerGradient;
    ctx.fill();
  };

  const drawAreaChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartDataPoint[],
    width: number,
    height: number,
    options: { showGrid: boolean; animate: boolean }
  ) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    // Create gradient for area fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

    // Draw filled area
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (data[i].value - minValue) / range;
      const y = height - padding - normalizedValue * chartHeight;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line on top
    drawLineChart(ctx, data, width, height, options);
  };

  const drawSparklineChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartDataPoint[],
    width: number,
    height: number,
    options: { animate: boolean }
  ) => {
    const padding = 10;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    ctx.strokeStyle = 'rgba(59, 130, 246, 1)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (data[i].value - minValue) / range;
      const y = padding + chartHeight - normalizedValue * chartHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const getChartIcon = () => {
    switch (type) {
      case 'line': return <LineChart className="w-4 h-4 text-blue-400" />;
      case 'bar': return <BarChart3 className="w-4 h-4 text-purple-400" />;
      case 'donut': return <PieChart className="w-4 h-4 text-green-400" />;
      case 'area': return <Activity className="w-4 h-4 text-orange-400" />;
      case 'sparkline': return <TrendingUp className="w-4 h-4 text-pink-400" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTotalValue = () => {
    return data.reduce((sum, point) => sum + point.value, 0);
  };

  const getAverageValue = () => {
    return data.length > 0 ? getTotalValue() / data.length : 0;
  };

  const getTrend = () => {
    if (data.length < 2) return 'neutral';
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));

    const firstAvg = firstHalf.reduce((sum, p) => sum + p.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p.value, 0) / secondHalf.length;

    if (secondAvg > firstAvg * 1.05) return 'up';
    if (secondAvg < firstAvg * 0.95) return 'down';
    return 'neutral';
  };

  const trend = getTrend();

  return (
    <div ref={containerRef} className={`liquid-glass-sidebar rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="liquid-glass-header p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                {getChartIcon()}
              </div>
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-adaptive-primary">{title}</h3>
                )}
                {subtitle && (
                  <p className="text-sm text-adaptive-secondary">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Trend Indicator */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              trend === 'up' ? 'bg-green-500/10 text-green-400' :
              trend === 'down' ? 'bg-red-500/10 text-red-400' :
              'bg-gray-500/10 text-gray-400'
            }`}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
               trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
               <Activity className="w-3 h-3" />}
              <span className="text-xs font-medium">
                {trend === 'up' ? 'Trending Up' : trend === 'down' ? 'Trending Down' : 'Stable'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="relative p-4">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: `${height}px` }}
          className="block"
        />

        {/* Overlay Stats */}
        {type !== 'sparkline' && (
          <div className="absolute top-6 right-6 space-y-1">
            <div className="text-right">
              <div className="text-xs text-adaptive-muted">Total</div>
              <div className="text-sm font-semibold text-adaptive-primary">
                {getTotalValue().toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-adaptive-muted">Average</div>
              <div className="text-sm font-medium text-adaptive-secondary">
                {getAverageValue().toFixed(1)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {showLabels && data.length <= 6 && type !== 'sparkline' && (
        <div className="liquid-glass-section p-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2">
            {data.map((point, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: point.color || `hsl(${(i * 360) / data.length}, 70%, 60%)` }}
                />
                <span className="text-adaptive-muted truncate">{point.label}</span>
                <span className="text-adaptive-primary font-medium ml-auto">
                  {point.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}