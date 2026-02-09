import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Artifact } from '../types';

// Simple CSV parser
const parseCSV = (content: string) => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return null;
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => {
            const val = values[i]?.trim();
            // Try convert to number
            const num = parseFloat(val);
            obj[h] = isNaN(num) ? val : num;
        });
        return obj;
    });
    return { headers, data };
};

interface ChartRendererProps {
    artifact: Artifact;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ artifact }) => {
    const chartData = useMemo(() => parseCSV(artifact.content), [artifact.content]);

    if (!chartData || chartData.data.length === 0) return <div className="text-aegis-500 text-xs italic">Invalid Data</div>;

    const keys = chartData.headers;
    const xKey = keys[0]; // Assume first column is X-axis (e.g. date)
    const dataKeys = keys.slice(1).filter(k => typeof chartData.data[0][k] === 'number');

    if (dataKeys.length === 0) return <div className="text-aegis-500 text-xs italic">No numeric data to chart</div>;

    // Use BarChart for few items, LineChart for many
    const ChartComponent = chartData.data.length < 20 ? BarChart : LineChart;
    const DataComponent = chartData.data.length < 20 ? Bar : Line;

    return (
        <div className="w-full h-64 mt-4 bg-aegis-800 rounded-md p-4 border border-aegis-600">
            <h4 className="text-xs font-mono text-aegis-400 mb-2">{artifact.name} Visualization</h4>
            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={chartData.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey={xKey} stroke="#71717a" fontSize={10} />
                    <YAxis stroke="#71717a" fontSize={10} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '12px' }} 
                        itemStyle={{ color: '#e4e4e7' }}
                    />
                    <Legend />
                    {dataKeys.map((key, i) => (
                         // @ts-ignore
                        <DataComponent 
                            key={key} 
                            type="monotone" 
                            dataKey={key} 
                            stroke={`hsl(${i * 60 + 200}, 70%, 50%)`} 
                            fill={`hsl(${i * 60 + 200}, 70%, 50%)`} 
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </ChartComponent>
            </ResponsiveContainer>
        </div>
    );
};