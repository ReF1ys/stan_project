// app/page.tsx
'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Sidebar from '@/components/sidebar/Sidebar';
import WorkshopDashboard from '@/components/dashboard/WorkshopDashboard';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  ChartType,
  Plugin,
  Chart
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

// Define period type to avoid TypeScript errors
type PeriodType = 'week' | 'month' | 'year';
type TabType = 'production' | 'defects' | 'load';

export default function DashboardPage() {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeWorkshop, setActiveWorkshop] = useState<number | undefined>(undefined);
  const [activePeriod, setActivePeriod] = useState<PeriodType>('month');
  const [topChartPeriod, setTopChartPeriod] = useState<PeriodType>('month');
  const [activeTab, setActiveTab] = useState<TabType>('production');

  // Workshop data - different data for each workshop
  const workshopData = {
    1: {
      stats: [
        { 
          value: '89', 
          percentage: '21.01%', 
          label: 'Наработка часов', 
          trend: 'up' as const,
          color: '#6a33f8',
          trendData: [40, 35, 60, 75, 45, 65, 55]
        },
        { 
          value: '10', 
          percentage: '', 
          label: 'Станков в ремонте', 
          trend: 'down' as const,
          color: '#ff4d6d',
          trendData: [25, 20, 32, 18, 29, 15, 25]
        },
        { 
          value: '20%', 
          percentage: '7.5%', 
          label: 'Простаивает', 
          trend: 'down' as const,
          color: '#aaaaaa',
          trendData: [30, 28, 35, 40, 38, 30, 34]
        },
        { 
          value: '73%', 
          percentage: '2%', 
          label: 'Загрузка цеха', 
          trend: 'up' as const,
          color: '#0bcdff',
          trendData: [60, 65, 70, 68, 72, 75, 73]
        }
      ],
      production: {
        labels: ['25.02', '26.02', '27.02', '28.02', '29.02', '01.03', '02.03'],
        datasets: [
          {
            label: 'План',
            data: [100, 120, 150, 180, 200, 220, 210],
            borderColor: '#4caf50',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
          },
          {
            label: 'Факт',
            data: [80, 100, 130, 170, 160, 190, 185],
            borderColor: '#673ab7',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
          }
        ]
      },
      downtime: {
        labels: ['25.02', '26.02', '27.02', '28.02', '29.02'],
        datasets: [
          {
            label: 'Простои',
            data: [20, 75, 50, 85, 30, 60, 40],
            borderColor: '#ff4d6d',
            borderDash: [5, 5],
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
          }
        ]
      },
      operations: [
        { label: 'Выполнено заказов', count: 250 },
        { label: 'Сменено инструментов', count: 20 },
        { label: 'Ошибки ЧПУ', count: 12 },
        { label: 'Забракованные партии', count: 12 }
      ]
    },
    2: {
      stats: [
        { 
          value: '92', 
          percentage: '18.5%', 
          label: 'Наработка часов', 
          trend: 'up' as const,
          color: '#6a33f8',
          trendData: [50, 55, 60, 65, 70, 80, 92]
        },
        { 
          value: '5', 
          percentage: '', 
          label: 'Станков в ремонте', 
          trend: 'down' as const,
          color: '#ff4d6d',
          trendData: [15, 12, 10, 8, 7, 6, 5]
        },
        { 
          value: '15%', 
          percentage: '10.5%', 
          label: 'Простаивает', 
          trend: 'down' as const,
          color: '#aaaaaa',
          trendData: [35, 30, 25, 20, 18, 16, 15]
        },
        { 
          value: '85%', 
          percentage: '5%', 
          label: 'Загрузка цеха', 
          trend: 'up' as const,
          color: '#0bcdff',
          trendData: [65, 70, 75, 78, 80, 82, 85]
        }
      ],
      production: {
        labels: ['25.02', '26.02', '27.02', '28.02', '29.02', '01.03', '02.03'],
        datasets: [
          {
            label: 'План',
            data: [150, 160, 170, 180, 190, 200, 210],
            borderColor: '#4caf50',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
          },
          {
            label: 'Факт',
            data: [145, 155, 175, 165, 180, 195, 205],
            borderColor: '#673ab7',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
          }
        ]
      },
      downtime: {
        labels: ['25.02', '26.02', '27.02', '28.02', '29.02'],
        datasets: [
          {
            label: 'Простои',
            data: [15, 20, 10, 25, 18, 12, 8],
            borderColor: '#ff4d6d',
            borderDash: [5, 5],
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
          }
        ]
      },
      operations: [
        { label: 'Выполнено заказов', count: 315 },
        { label: 'Сменено инструментов', count: 28 },
        { label: 'Ошибки ЧПУ', count: 8 },
        { label: 'Забракованные партии', count: 5 }
      ]
    },
    3: {
      stats: [
        { 
          value: '76', 
          percentage: '12.8%', 
          label: 'Наработка часов', 
          trend: 'down' as const,
          color: '#6a33f8',
          trendData: [85, 80, 75, 80, 78, 74, 76]
        },
        { 
          value: '18', 
          percentage: '', 
          label: 'Станков в ремонте', 
          trend: 'up' as const,
          color: '#ff4d6d',
          trendData: [10, 12, 14, 15, 16, 18, 18]
        },
        { 
          value: '32%', 
          percentage: '8.2%', 
          label: 'Простаивает', 
          trend: 'up' as const,
          color: '#aaaaaa',
          trendData: [20, 22, 25, 28, 30, 31, 32]
        },
        { 
          value: '64%', 
          percentage: '6%', 
          label: 'Загрузка цеха', 
          trend: 'down' as const,
          color: '#0bcdff',
          trendData: [75, 72, 70, 68, 66, 65, 64]
        }
      ],
      production: {
        labels: ['25.02', '26.02', '27.02', '28.02', '29.02', '01.03', '02.03'],
        datasets: [
          {
            label: 'План',
            data: [180, 180, 180, 180, 180, 180, 180],
            borderColor: '#4caf50',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
          },
          {
            label: 'Факт',
            data: [160, 155, 140, 130, 125, 120, 115],
            borderColor: '#673ab7',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
          }
        ]
      },
      downtime: {
        labels: ['25.02', '26.02', '27.02', '28.02', '29.02'],
        datasets: [
          {
            label: 'Простои',
            data: [40, 45, 50, 55, 60, 65, 70],
            borderColor: '#ff4d6d',
            borderDash: [5, 5],
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
          }
        ]
      },
      operations: [
        { label: 'Выполнено заказов', count: 120 },
        { label: 'Сменено инструментов', count: 35 },
        { label: 'Ошибки ЧПУ', count: 28 },
        { label: 'Забракованные партии', count: 22 }
      ]
    }
  };

  const handleNavigation = (page: string, workshop?: number) => {
    setActivePage(page);
    setActiveWorkshop(workshop);
  };

  // Данные для верхнего графика (Станки)
  const getMachineDataByPeriod = () => {
    switch(topChartPeriod) {
      case 'week':
        return {
          labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
          datasets: [
            {
              label: 'Рабочие станки',
              data: [250, 300, 320, 280, 290, 150, 100],
              backgroundColor: 'rgba(255,255,255,1)',
              borderRadius: 4,
              categoryPercentage: 0.2,
              barThickness: 2,
            },
          ],
        };
      case 'year':
        return {
          labels: ['Янв', 'Апр', 'Июл', 'Окт', 'Янв', 'Апр', 'Июл', 'Окт', 'Янв', 'Апр'],
          datasets: [
            {
              label: 'Рабочие станки',
              data: [700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150],
              backgroundColor: 'rgba(255,255,255,1)',
              borderRadius: 4,
              categoryPercentage: 0.2,
              barThickness: 2,
            },
          ],
        };
      default: // month
        return {
          labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт'],
          datasets: [
            {
              label: 'Рабочие станки',
              data: [900, 800, 1000, 1100, 700, 600, 1000, 1100, 700, 600],
              backgroundColor: 'rgba(255,255,255,1)',
              borderRadius: 6,
              categoryPercentage: 0.2,
              barThickness: 6,
            },
          ],
        };
    }
  };

  // Данные для графиков нижней секции
  const weeklyProductionData = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    datasets: [
      {
        label: 'Выпущено, тыс.',
        data: [20, 28, 32, 25, 30, 15, 10],
        fill: false,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: 'white',
        pointBorderWidth: 2,
        pointBorderColor: '#6a33f8',
        borderColor: '#6a33f8',
        backgroundColor: 'white',
      },
    ],
  };

  const productionData = {
    labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'],
    datasets: [
      {
        label: 'Выпущено, тыс.',
        data: [150, 120, 140, 180, 160, 160],
        fill: false,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: 'white',
        pointBorderWidth: 2,
        pointBorderColor: '#6a33f8',
        borderColor: '#6a33f8',
        backgroundColor: 'white',
      },
    ],
  };

  const yearlyProductionData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Выпущено, тыс.',
        data: [800, 950, 900, 1100, 1300, 1200],
        fill: false,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: 'white',
        pointBorderWidth: 2,
        pointBorderColor: '#6a33f8',
        borderColor: '#6a33f8',
        backgroundColor: 'white',
      },
    ],
  };

  // Данные о браке
  const defectRateData: Record<PeriodType, any> = {
    week: {
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      datasets: [
        {
          label: 'Процент брака, %',
          data: [3.2, 2.8, 3.5, 4.0, 3.0, 3.3, 2.9],
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: 'white',
          pointBorderWidth: 2,
          pointBorderColor: '#ff6b6b',
          borderColor: '#ff6b6b',
          backgroundColor: 'white',
        },
      ],
    },
    month: {
      labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'],
      datasets: [
        {
          label: 'Процент брака, %',
          data: [4.5, 3.8, 4.2, 3.5, 3.0, 2.8],
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: 'white',
          pointBorderWidth: 2,
          pointBorderColor: '#ff6b6b',
          borderColor: '#ff6b6b',
          backgroundColor: 'white',
        },
      ],
    },
    year: {
      labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
      datasets: [
        {
          label: 'Процент брака, %',
          data: [5.2, 4.8, 4.5, 4.0, 3.6, 3.2],
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: 'white',
          pointBorderWidth: 2,
          pointBorderColor: '#ff6b6b',
          borderColor: '#ff6b6b',
          backgroundColor: 'white',
        },
      ],
    },
  };

  const equipmentLoadData: Record<PeriodType, any> = {
    week: {
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      datasets: [
        {
          label: 'Загрузка, %',
          data: [75, 82, 88, 85, 80, 60, 45],
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: 'white',
          pointBorderWidth: 2,
          pointBorderColor: '#4caf50',
          borderColor: '#4caf50',
          backgroundColor: 'white',
        },
      ],
    },
    month: {
      labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'],
      datasets: [
        {
          label: 'Загрузка, %',
          data: [72, 68, 75, 82, 80, 78],
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: 'white',
          pointBorderWidth: 2,
          pointBorderColor: '#4caf50',
          borderColor: '#4caf50',
          backgroundColor: 'white',
        },
      ],
    },
    year: {
      labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
      datasets: [
        {
          label: 'Загрузка, %',
          data: [65, 70, 68, 75, 80, 82],
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: 'white',
          pointBorderWidth: 2,
          pointBorderColor: '#4caf50',
          borderColor: '#4caf50',
          backgroundColor: 'white',
        },
      ],
    },
  };

  // Выбор данных в зависимости от периода и вкладки
  const getChartDataByPeriodAndTab = () => {
    switch(activeTab) {
      case 'defects':
        return defectRateData[activePeriod];
      case 'load':
        return equipmentLoadData[activePeriod];
      default: 
        switch(activePeriod) {
          case 'week':
            return weeklyProductionData;
          case 'year':
            return yearlyProductionData;
          default:
            return productionData;
        }
    }
  };

  const getChartColor = () => {
    switch(activeTab) {
      case 'defects':
        return '#ff6b6b';
      case 'load':
        return '#4caf50';
      default: 
        return '#6a33f8';
    }
  };

  const downtimeDaysData = {
    labels: ['Пон', 'Вт', 'Ср'],
    datasets: [
      {
        data: [20, 5, 30],
        backgroundColor: ['rgba(200,200,255,0.8)', 'rgba(200,200,255,0.8)', '#6a33f8'],
        barThickness: 16,
        borderRadius: 4,
      },
    ],
  };

  const commonOpts = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 20, right: 0, bottom: 0, left: 0 },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#3a3541' },
      },
      y: {
        beginAtZero: true,
        max: 1200,
        ticks: { 
          stepSize: 400,
          color: '#3a3541' 
        },
        grid: { display: false },
        border: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const dataLabelsPlugin: Plugin<'line'> = {
    id: 'dataLabels',
    afterDatasetsDraw(chart: Chart) {
      const { ctx } = chart;
      const chartColor = getChartColor();
      
      chart.data.datasets.forEach((dataset: any, i: number) => {
        const meta = chart.getDatasetMeta(i);
        if (!meta.hidden) {
          meta.data.forEach((element: any, index: number) => {
            const position = element.getCenterPoint();
            const value = dataset.data[index];
            
            ctx.fillStyle = chartColor;
            ctx.beginPath();
            const textWidth = ctx.measureText(`${value} ${activeTab === 'production' ? 'тыс.' : '%'}`).width;
            const bubbleWidth = textWidth + 20;
            const bubbleHeight = 40;
            const radius = 8; 
            
            ctx.beginPath();
            ctx.moveTo(position.x - bubbleWidth/2 + radius, position.y - 40);
            ctx.lineTo(position.x + bubbleWidth/2 - radius, position.y - 40);
            ctx.quadraticCurveTo(position.x + bubbleWidth/2, position.y - 40, position.x + bubbleWidth/2, position.y - 40 + radius);
            ctx.lineTo(position.x + bubbleWidth/2, position.y - 40 + bubbleHeight - radius);
            ctx.quadraticCurveTo(position.x + bubbleWidth/2, position.y - 40 + bubbleHeight, position.x + bubbleWidth/2 - radius, position.y - 40 + bubbleHeight);
            ctx.lineTo(position.x - bubbleWidth/2 + radius, position.y - 40 + bubbleHeight);
            ctx.quadraticCurveTo(position.x - bubbleWidth/2, position.y - 40 + bubbleHeight, position.x - bubbleWidth/2, position.y - 40 + bubbleHeight - radius);
            ctx.lineTo(position.x - bubbleWidth/2, position.y - 40 + radius);
            ctx.quadraticCurveTo(position.x - bubbleWidth/2, position.y - 40, position.x - bubbleWidth/2 + radius, position.y - 40);
            ctx.closePath();
            ctx.fill();
            
            // Рисуем текст
            ctx.fillStyle = 'white';
            ctx.font = '12px Lato, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${value} ${activeTab === 'production' ? 'тыс.' : '%'}`, position.x, position.y - 20);
            
            ctx.strokeStyle = chartColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(position.x, position.y - 0);
            ctx.lineTo(position.x, position.y - 5);
            ctx.stroke();
          });
        }
      });
    },
  };

  // Rendering the main dashboard
  function renderMainDashboard() {
    return (
      <>
        <header className={styles.header}>
          <h1 className={styles.title}>Дашборд</h1>
          <form className={styles.search} role="search">
            <label htmlFor="searchInput" className={styles.visuallyHidden}>Поиск по сайту</label>
            <input id="searchInput" type="text" placeholder="Search anything here..." />
          </form>
        </header>

        <section className={styles.topSection}>
          <div className={styles.mainContent}>
            <article className={styles.cardLarge}>
              <header className={styles.cardHeader}>
                <h2>Станки</h2>
                <div className={styles.controls}>
                  <label htmlFor="periodSelect" className={styles.visuallyHidden}>Выберите период</label>
                  <select 
                    id="periodSelect" 
                    value={topChartPeriod}
                    onChange={(e) => setTopChartPeriod(e.target.value as PeriodType)}
                  >
                    <option value="week">Неделя</option>
                    <option value="month">Месяц</option>
                    <option value="year">Год</option>
                  </select>
                  <button aria-label="Дополнительные действия">⋯</button>
                </div>
              </header>
              <div className={styles.cardBody}>
                <div className={styles.currentCount}>
                  <p className={styles.number}>300</p>
                  <p className={styles.labelSmall}>Станков сейчас <br/>в работе</p>
                </div>
                <div className={styles.chart}>
                  <Bar data={getMachineDataByPeriod()} options={commonOpts} />
                </div>
              </div>
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <div className={styles.titlestat}>
                    <img src="/images/all.svg" alt="machine" />
                    <h3>Всего станков</h3>
                  </div>
                  <p className={styles.statValue}>400</p>
                  <div className={`${styles.progressBar} ${styles.progressBarFull}`}>
                    <div className={`${styles.progress} ${styles.progressFull}`} aria-label="100% filled"></div>
                  </div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.titlestat}>
                    <img src="/images/all2.svg" alt="machine" />
                    <h3>Простаивает</h3>
                  </div>
                  <p className={styles.statValue}>60</p>
                  <div className={`${styles.progressBar} ${styles.progressBarIdle}`}>
                    <div className={`${styles.progress} ${styles.progressIdle}`} aria-label="15% filled"></div>
                  </div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.titlestat}>
                    <img src="/images/all3.svg" alt="machine" />
                    <h3>Аварии</h3>
                  </div>
                  <p className={styles.statValue}>40</p>
                  <div className={`${styles.progressBar} ${styles.progressBarAccident}`}>
                    <div className={`${styles.progress} ${styles.progressAccident}`} aria-label="10% filled"></div>
                  </div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.titlestat}>
                    <img src="/images/all4.svg" alt="machine" />
                    <h3>Всего станков</h3>
                  </div>
                  <p className={styles.statValue}>68</p>
                  <div className={`${styles.progressBar} ${styles.progressBarUsage}`}>
                    <div className={`${styles.progress} ${styles.progressUsage}`} aria-label="68% filled"></div>
                  </div>
                </div>
              </div>
            </article>

            <article className={styles.cardLarge}>
              <header className={styles.cardHeader}>
                <nav className={styles.tabs} aria-label="Вкладки графика">
                  <button 
                    className={activeTab === 'production' ? styles.activeTab : ''} 
                    onClick={() => setActiveTab('production')}
                  >
                    Выпущено деталей
                  </button>
                  <button 
                    className={activeTab === 'defects' ? styles.activeTab : ''} 
                    onClick={() => setActiveTab('defects')}
                  >
                    Процент брака
                  </button>
                  <button 
                    className={activeTab === 'load' ? styles.activeTab : ''} 
                    onClick={() => setActiveTab('load')}
                  >
                    Загрузка оборудования
                  </button>
                </nav>
                <div className={styles.controls}>
                  <label htmlFor="periodSelect2" className={styles.visuallyHidden}>Выберите период</label>
                  <select 
                    id="periodSelect2" 
                    value={activePeriod}
                    onChange={(e) => setActivePeriod(e.target.value as PeriodType)}
                    className={styles.periodSelect}
                  >
                    <option value="week">Неделя</option>
                    <option value="month">Месяц</option>
                    <option value="year">Год</option>
                  </select>
                  <button aria-label="Дополнительные действия">⋯</button>
                </div>
              </header>
              <div className={styles.lineChart}>
                <Line 
                  data={getChartDataByPeriodAndTab()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: { top: 60, right: 40, bottom: 10, left: 40 },
                    },
                    scales: { 
                      x: { 
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: '#3a3541' }
                      }, 
                      y: { 
                        display: false,
                        grid: { display: false },
                        border: { display: false },
                        ticks: { display: false },
                        beginAtZero: true,
                      } 
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: false },
                    },
                    elements: {
                      line: {
                        tension: 0.4,
                        borderWidth: 2,
                      },
                      point: {
                        radius: 6,
                        borderWidth: 2,
                      }
                    }
                  }}
                  plugins={[dataLabelsPlugin]}
                />
              </div>
            </article>
          </div>

          <div className={styles.sideCards}>
            <section className={styles.cardSmall} aria-labelledby="costs-title">
              <h2 id="costs-title" className={styles.smallTitle}>Общие затраты <br/>на обслуживание:</h2>
              <p className={styles.bigNumber}>241 000</p>
              <button className={styles.btn}>Вывести все расходы</button>
            </section>

            <section className={styles.cardSmall} aria-labelledby="reasons-title">
              <h2 id="reasons-title" className={styles.smallTitle}>Простои по причинам</h2>
              <ul className={styles.reasonList}>
                <li><span>Ошибка ПО</span></li>
                <li><span>Поломка оборудования</span></li>
                <li><span>Нехватка материала</span></li>
              </ul>
            </section>

            <section className={styles.cardSmall} aria-labelledby="days-title">
              <h2 id="days-title" className={styles.smallTitle}>Простои по дням</h2>
              <div className={styles.tinyChart}>
                <Bar 
                  data={downtimeDaysData} 
                  options={{
                    ...commonOpts,
                    scales: {
                      x: { 
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: '#3a3541' }
                      },
                      y: { 
                        grid: { display: false },
                        border: { display: false },
                        ticks: { display: false },
                        beginAtZero: true,
                        max: 40,
                      }
                    }
                  }} 
                />
              </div>
            </section>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar 
        activePage={activePage} 
        activeWorkshop={activeWorkshop}
        onPageChange={handleNavigation} 
      />

      <main className={styles.main}>
        {activePage === 'machines' && activeWorkshop ? (
          <WorkshopDashboard 
            workshopId={activeWorkshop} 
            workshopData={workshopData[activeWorkshop as keyof typeof workshopData]}
          />
        ) : (
          renderMainDashboard()
        )}
      </main>
    </div>
  );
}