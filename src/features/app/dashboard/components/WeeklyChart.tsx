import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@/theme/useTheme';
import { CHART_CONFIG, CHART_COLORS } from '../constants/dashboard.constants';

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

    const gridColor = isDark ? CHART_COLORS.DARK.GRID : CHART_COLORS.LIGHT.GRID;
    const axisColor = isDark ? CHART_COLORS.DARK.AXIS : CHART_COLORS.LIGHT.AXIS;

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
                width: CHART_CONFIG.STROKE_WIDTH,
                colors: [CHART_CONFIG.STROKE_COLOR],
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: CHART_CONFIG.GRADIENT_OPACITY_FROM,
                    opacityTo: CHART_CONFIG.GRADIENT_OPACITY_TO,
                    stops: CHART_CONFIG.GRADIENT_STOPS,
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
                size: CHART_CONFIG.MARKER_SIZE,
                strokeWidth: CHART_CONFIG.MARKER_STROKE_WIDTH,
                colors: [CHART_CONFIG.MARKER_COLOR],
                hover: {
                    size: 6,
                },
            },
        });
    }, [isDark, data, axisColor, gridColor]);

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
