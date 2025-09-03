import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IncomePieChartProps {
  income: {
    benefit: number;
    employment: number;
    childSupport: number;
    otherIncome: number;
    familyTaxCredit: number;
    childDisabilityAllowance: number;
  };
  incomeLabels?: {
    benefit: string;
    employment: string;
    childSupport: string;
    otherIncome: string;
    familyTaxCredit: string;
    childDisabilityAllowance: string;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
}

const IncomePieChart: React.FC<IncomePieChartProps> = ({
  income,
  costs
}) => {
  // Prepare data for the chart - show remaining income after expenses
  const totalIncome = Object.values(income).reduce((sum, value) => sum + (value || 0), 0);
  const totalExpenses = costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);
  const remainingIncome = totalIncome - totalExpenses;

  // Don't render if no income
  if (totalIncome === 0) {
    return null;
  }

  // Create chart data showing remaining income vs expenses with detailed breakdowns
  const chartData = [];
  const chartLabels = [];
  const chartColors = [];

  // Define color palettes
  const redShades = [
    '#ef4444', // red-500
    '#dc2626', // red-600
    '#b91c1c', // red-700
    '#991b1b', // red-800
    '#7f1d1d', // red-900
    '#f87171', // red-400
  ];

  let redIndex = 0;

  // Add remaining income as a single section (if positive)
  if (remainingIncome > 0) {
    chartData.push(remainingIncome);
    chartLabels.push('Remaining Income');
    chartColors.push('#22c55e'); // Green for remaining
  }

  // Add individual expenses as separate sections
  costs.forEach((cost) => {
    if (cost.amount > 0) {
      chartData.push(cost.amount);
      chartLabels.push(cost.cost);
      chartColors.push(redShades[redIndex % redShades.length]);
      redIndex++;
    }
  });

  // If expenses exceed income (deficiency), show deficiency as a darker red section
  if (remainingIncome < 0) {
    const deficiency = Math.abs(remainingIncome);
    chartData.push(deficiency);
    chartLabels.push('Deficiency');
    chartColors.push('#7f1d1d'); // Darkest red for deficiency
  }

  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: chartColors,
        borderColor: chartColors.map(color => color + '80'), // Add transparency for border
        borderWidth: 2,
        hoverBorderColor: chartColors.map(color => color + 'CC'), // Slightly more opaque on hover
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%', // Make the donut slightly thicker by reducing the cutout percentage
    plugins: {
      legend: {
        display: false, // We'll create custom legend
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
    transitions: {
      active: {
        animation: {
          duration: 400,
        },
      },
    },
  };

  return (
    <div className="income-pie-chart-container">
      <div className="pie-chart-wrapper">
        <div className="chart-container">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default IncomePieChart;
