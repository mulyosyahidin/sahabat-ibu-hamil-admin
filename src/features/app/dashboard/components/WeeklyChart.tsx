import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@/theme/ThemeProvider';

interface ChartData {
    day: string;
    date: string;
    count: number;
}

interface WeeklyChartsProps {
    data: ChartData[];
}

export default function WeeklyCharts({ data }: WeeklyChartsProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [chartOptions, setChartOptions] = useState({});

    const gridColor = isDark ? '#334155' : '#e5e7eb';
    const axisColor = isDark ? '#9ca3af' : '#9ca3af';

    useEffect(() => {
        if (!data || data.length === 0) return;

        setChartOptions({
            chart: {
                type: 'area',
                toolbar: {
                    show: false,
                },
                sparkline: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
                width: 2,
                colors: ['#db2777'],
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.4,
                    opacityTo: 0.01,
                    stops: [0, 100],
                    colorStops: [
                        {
                            offset: 0,
                            color: '#ec4899',
                            opacity: 0.4,
                        },
                        {
                            offset: 100,
                            color: '#ec4899',
                            opacity: 0.01,
                        },
                    ],
                },
            },
            xaxis: {
                categories: data.map((d) => d.day),
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: axisColor,
                        fontSize: '12px',
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: axisColor,
                        fontSize: '12px',
                    },
                },
            },
            grid: {
                borderColor: gridColor,
                padding: {
                    left: 0,
                    right: 30,
                    top: 10,
                    bottom: 0,
                },
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
                x: {
                    show: true,
                },
                y: {
                    formatter: (value: number) => `${value}`,
                },
                style: {
                    fontSize: '12px',
                    fontFamily: 'inherit',
                },
            },
            markers: {
                size: 4,
                strokeWidth: 0,
                colors: ['#db2777'],
                hover: {
                    size: 6,
                },
            },
        });
    }, [isDark, data]);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-80 text-gray-500">
                Tidak ada data tersedia
            </div>
        );
    }

    const series = [
        {
            name: 'Chats',
            data: data.map((d) => d.count),
        },
    ];

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <Chart
                options={chartOptions}
                series={series}
                type="area"
                height={300}
                width="100%"
            />
        </div>
    );
}