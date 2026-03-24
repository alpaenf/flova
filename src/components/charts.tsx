'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#2563EB', '#7C3AED', '#F59E0B', '#EF4444', '#22C55E', '#06B6D4', '#EC4899']

interface StageBarChartProps {
  data: { stage: string; avgDuration: number; count: number }[]
  bottleneckStage?: string
}

export function StageBarChart({ data, bottleneckStage }: StageBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="stage"
          tick={{ fontSize: 12, fill: '#94A3B8' }}
          axisLine={{ stroke: '#E2E8F0' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#94A3B8' }}
          axisLine={{ stroke: '#E2E8F0' }}
          label={{ value: 'Menit', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            fontSize: 13,
          }}
          formatter={(value: any) => [`${Number(value).toFixed(1)} menit`, 'Rata-rata']}
        />
        <Bar dataKey="avgDuration" radius={[8, 8, 0, 0]} maxBarSize={50}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.stage === bottleneckStage ? '#EF4444' : '#2563EB'}
              opacity={entry.stage === bottleneckStage ? 1 : 0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

interface HourlyLineChartProps {
  data: { hour: string; count: number }[]
}

export function HourlyLineChart({ data }: HourlyLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 12, fill: '#94A3B8' }}
          axisLine={{ stroke: '#E2E8F0' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#94A3B8' }}
          axisLine={{ stroke: '#E2E8F0' }}
        />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            fontSize: 13,
          }}
          formatter={(value: any) => [value, 'Layanan']}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#2563EB"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface StagePieChartProps {
  data: { stage: string; percentage: number }[]
}

export function StagePieChart({ data }: StagePieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="percentage"
          nameKey="stage"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={55}
          paddingAngle={3}
          label={(props: any) => `${props.stage} (${Number(props.percentage).toFixed(0)}%)`}
          labelLine={{ stroke: '#94A3B8' }}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            fontSize: 13,
          }}
          formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Kontribusi']}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#94A3B8' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

interface DurationBreakdownChartProps {
  data: { stage: string; totalDuration: number; avgDuration: number; count: number }[]
}

export function DurationBreakdownChart({ data }: DurationBreakdownChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          type="number"
          tick={{ fontSize: 12, fill: '#94A3B8' }}
          axisLine={{ stroke: '#E2E8F0' }}
          label={{ value: 'Total Menit', position: 'insideBottom', offset: -5, fill: '#94A3B8', fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="stage"
          tick={{ fontSize: 12, fill: '#94A3B8' }}
          axisLine={{ stroke: '#E2E8F0' }}
          width={80}
        />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            fontSize: 13,
          }}
          formatter={(value: any) => [`${Number(value).toFixed(1)} menit`, 'Total Durasi']}
        />
        <Bar dataKey="totalDuration" radius={[0, 8, 8, 0]} maxBarSize={30}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
