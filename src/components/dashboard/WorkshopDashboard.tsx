'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './WorkshopDashboard.module.css';
import StatCard from './StatCard';
import MachineCard, { MachineStatus } from '../machines/MachineCard';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartEvent,
  Plugin,
  Chart,
  ChartType,
  ChartTypeRegistry,
  TooltipItem,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Machine = {
  id: string;
  status: MachineStatus;
  orderNumber: string;
};

type WorkshopDashboardProps = {
  workshopId: number;
  workshopData?: {
    stats: {
      value: string;
      percentage: string;
      label: string;
      trend: 'up' | 'down';
      color: string;
      trendData: number[];
    }[];
    production: ChartData<'line'>;
    downtime: ChartData<'line'>;
    operations: {
      label: string;
      count: number;
    }[];
  };
};

type MachineDetails = {
  model: string;
  currentStatus: string;
  operator: string;
  product: string;
  part: string;
  techOperation: string;
  setupProgram: string;
  orderRouteSheet: string;
  progress: {
    plan: number;
    fact: number;
  };
};

type MachineDetailMap = {
  [key: string]: MachineDetails;
};

export default function WorkshopDashboard({ workshopId, workshopData }: WorkshopDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<'plan' | 'defects'>('plan');
  

  const [markerIndex, setMarkerIndex] = useState<number>(3); 
  const chartRef = useRef<any>(null);
  const isDraggingRef = useRef<boolean>(false);
  const downtimeChartRef = useRef<any>(null);
  const [downtimeMarkerIndex, setDowntimeMarkerIndex] = useState<number | null>(null);


  const defaultStats = [
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
  ];


  const defaultProductionData: ChartData<'line'> = {
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
  };


  const defaultDowntimeData: ChartData<'line'> = {
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
  };

 
  const defaultOperations = [
    { label: 'Выполнено заказов', count: 250 },
    { label: 'Сменено инструментов', count: 20 },
    { label: 'Ошибки ЧПУ', count: 12 },
    { label: 'Забракованные партии', count: 12 }
  ];

  const stats = workshopData?.stats || defaultStats;
  const productionData = workshopData?.production || defaultProductionData;
  const downtimeData = workshopData?.downtime || defaultDowntimeData;
  const operations = workshopData?.operations || defaultOperations;


  const ageRangeData = [
    { range: '15-17', count: 20 },
    { range: '18-24', count: 35 },
    { range: '25-34', count: 45 },
    { range: '35-44', count: 30 },
    { range: '45-54', count: 25 },
    { range: '55-64', count: 15 }
  ];


  const machines: Machine[] = [
    { id: 'C-20-315', status: 'working', orderNumber: 'Заказ №333/3' },
    { id: 'TOS-135', status: 'idle', orderNumber: 'Заказ №427/1' },
    { id: 'DMU-50', status: 'working', orderNumber: 'Заказ №401/7' },
    { id: 'STC-2000', status: 'error', orderNumber: 'Заказ №380/4' },
    { id: 'HAAS-VF3', status: 'working', orderNumber: 'Заказ №412/2' },
    { id: 'CNC-500', status: 'idle', orderNumber: 'Заказ №395/5' },
    { id: 'TL-1000', status: 'working', orderNumber: 'Заказ №430/8' },
    { id: 'VMC-850', status: 'maintenance', orderNumber: 'Заказ №418/6' }
  ];

  const filteredMachines = machines.filter(machine => 
    machine.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMachineClick = (id: string) => {
    setSelectedMachine(id);
    // Here you would typically fetch detailed data for the selected machine
  };

  // Демонстрационные данные для станков
  const machineDetails: MachineDetailMap = {
    'C-20-315': {
      model: 'Coburg 20-10GM',
      currentStatus: 'Наладка',
      operator: 'Антонов В.А.',
      product: '003 ТВП ОКР',
      part: 'Патрубок 52.10.5.101',
      techOperation: '55 Фрез ЧПУ',
      setupProgram: '55',
      orderRouteSheet: '333 Заказ № 333/3 Изготовление патрубков',
      progress: {
        plan: 3.49,
        fact: 71.26
      }
    },
    'TOS-135': {
      model: 'TOS FCW 150',
      currentStatus: 'Ожидание материала',
      operator: 'Степанов И.К.',
      product: '005 КД ВТ',
      part: 'Корпус 38.21.3.205',
      techOperation: '28 Токарная ЧПУ',
      setupProgram: '28-A',
      orderRouteSheet: '427 Заказ № 427/1 Корпусные детали',
      progress: {
        plan: 25.00,
        fact: 0.00
      }
    },
    'DMU-50': {
      model: 'DMU 50 Evolution',
      currentStatus: 'В работе',
      operator: 'Кузнецов А.Р.',
      product: '001 РСУ МТ',
      part: 'Фланец 61.17.2.304',
      techOperation: '42 Фрез ЧПУ',
      setupProgram: '42-B',
      orderRouteSheet: '401 Заказ № 401/7 Изготовление фланцев',
      progress: {
        plan: 65.80,
        fact: 62.45
      }
    },
    'STC-2000': {
      model: 'STC 2000 HD',
      currentStatus: 'Ошибка ЧПУ',
      operator: 'Морозов Д.А.',
      product: '008 БЛК СТ',
      part: 'Вал 45.12.8.107',
      techOperation: '35 Токарно-фрезерная',
      setupProgram: '35-C',
      orderRouteSheet: '380 Заказ № 380/4 Обработка валов',
      progress: {
        plan: 42.30,
        fact: 28.75
      }
    },
    'HAAS-VF3': {
      model: 'HAAS VF-3',
      currentStatus: 'В работе',
      operator: 'Соколов М.П.',
      product: '012 ПРБ ВЗ',
      part: 'Кронштейн 72.14.6.501',
      techOperation: '60 Фрез ЧПУ',
      setupProgram: '60-A',
      orderRouteSheet: '412 Заказ № 412/2 Изготовление кронштейнов',
      progress: {
        plan: 48.20,
        fact: 51.30
      }
    },
    'CNC-500': {
      model: 'CNC 500 Power',
      currentStatus: 'Подготовка инструмента',
      operator: 'Попов К.Е.',
      product: '007 ТНП РК',
      part: 'Крышка 31.05.4.205',
      techOperation: '25 Фрез ЧПУ',
      setupProgram: '25-B',
      orderRouteSheet: '395 Заказ № 395/5 Крышки редукторов',
      progress: {
        plan: 15.70,
        fact: 0.00
      }
    },
    'TL-1000': {
      model: 'TL 1000 PRO',
      currentStatus: 'В работе',
      operator: 'Зайцев А.В.',
      product: '010 СТМ КБ',
      part: 'Ступица 48.23.7.402',
      techOperation: '38 Токарная ЧПУ',
      setupProgram: '38-D',
      orderRouteSheet: '430 Заказ № 430/8 Обработка ступиц',
      progress: {
        plan: 78.40,
        fact: 80.15
      }
    },
    'VMC-850': {
      model: 'VMC 850 CNC',
      currentStatus: 'Техническое обслуживание',
      operator: 'Лебедев С.К.',
      product: '006 ВЛК ПС',
      part: 'Втулка 41.08.2.103',
      techOperation: '20 Токарно-фрезерная',
      setupProgram: '20-C',
      orderRouteSheet: '418 Заказ № 418/6 Изготовление втулок',
      progress: {
        plan: 30.50,
        fact: 17.80
      }
    }
  };

  // Custom plugin for interactive marker
  const interactiveMarkerPlugin: Plugin<'line'> = {
    id: 'interactiveMarker',
    afterDatasetsDraw(chart, args, options) {
      const { ctx, chartArea, scales } = chart;
      
      if (!chartArea) return;
      if (!productionData.labels) return;

      // Save current canvas state
      ctx.save();
      
      // Get x-coordinate of the marker
      const dataPointIndex = markerIndex;
      const xPosition = scales.x.getPixelForValue(dataPointIndex);
      
      // Draw vertical line
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(xPosition, chartArea.top);
      ctx.lineTo(xPosition, chartArea.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#6a33f8';
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Get datasets values at the marker position
      const planValue = productionData.datasets[0]?.data[dataPointIndex];
      const factValue = productionData.datasets[1]?.data[dataPointIndex];
      
      if (planValue === undefined || factValue === undefined) return;
      
      // Draw plan point
      const planYPosition = scales.y.getPixelForValue(planValue as number);
      ctx.beginPath();
      ctx.arc(xPosition, planYPosition, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#4caf50';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      
      // Draw fact point
      const factYPosition = scales.y.getPixelForValue(factValue as number);
      ctx.beginPath();
      ctx.arc(xPosition, factYPosition, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#673ab7';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      
      // Draw label bubbles - offset plan bubble to prevent overlap
      // Plan bubble - position it above and to the left
      const planBubbleWidth = 80;
      const planBubbleHeight = 30;
      const planRadius = 4;
      
      // Draw plan bubble - offset to the left
      ctx.beginPath();
      const planBubbleX = xPosition - 50; // Offset to the left
      ctx.moveTo(planBubbleX - planBubbleWidth/2 + planRadius, planYPosition - 45);
      ctx.lineTo(planBubbleX + planBubbleWidth/2 - planRadius, planYPosition - 45);
      ctx.arcTo(planBubbleX + planBubbleWidth/2, planYPosition - 45, planBubbleX + planBubbleWidth/2, planYPosition - 45 + planRadius, planRadius);
      ctx.lineTo(planBubbleX + planBubbleWidth/2, planYPosition - 45 + planBubbleHeight - planRadius);
      ctx.arcTo(planBubbleX + planBubbleWidth/2, planYPosition - 45 + planBubbleHeight, planBubbleX + planBubbleWidth/2 - planRadius, planYPosition - 45 + planBubbleHeight, planRadius);
      ctx.lineTo(planBubbleX - planBubbleWidth/2 + planRadius, planYPosition - 45 + planBubbleHeight);
      ctx.arcTo(planBubbleX - planBubbleWidth/2, planYPosition - 45 + planBubbleHeight, planBubbleX - planBubbleWidth/2, planYPosition - 45 + planBubbleHeight - planRadius, planRadius);
      ctx.lineTo(planBubbleX - planBubbleWidth/2, planYPosition - 45 + planRadius);
      ctx.arcTo(planBubbleX - planBubbleWidth/2, planYPosition - 45, planBubbleX - planBubbleWidth/2 + planRadius, planYPosition - 45, planRadius);
      ctx.closePath();
      ctx.fillStyle = '#4caf50';
      ctx.fill();

      // Connect line from bubble to point
      ctx.beginPath();
      ctx.moveTo(planBubbleX, planYPosition - 45 + planBubbleHeight);
      ctx.lineTo(xPosition, planYPosition - 8);
      ctx.strokeStyle = '#4caf50';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Plan bubble text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${planValue} шт`, planBubbleX, planYPosition - 30);
      
      // Fact bubble - position it above and to the right
      const factBubbleWidth = 80;
      const factBubbleHeight = 30;
      const factRadius = 4;
      
      // Draw fact bubble - offset to the right
      ctx.beginPath();
      const factBubbleX = xPosition + 50; // Offset to the right
      ctx.moveTo(factBubbleX - factBubbleWidth/2 + factRadius, factYPosition - 45);
      ctx.lineTo(factBubbleX + factBubbleWidth/2 - factRadius, factYPosition - 45);
      ctx.arcTo(factBubbleX + factBubbleWidth/2, factYPosition - 45, factBubbleX + factBubbleWidth/2, factYPosition - 45 + factRadius, factRadius);
      ctx.lineTo(factBubbleX + factBubbleWidth/2, factYPosition - 45 + factBubbleHeight - factRadius);
      ctx.arcTo(factBubbleX + factBubbleWidth/2, factYPosition - 45 + factBubbleHeight, factBubbleX + factBubbleWidth/2 - factRadius, factYPosition - 45 + factBubbleHeight, factRadius);
      ctx.lineTo(factBubbleX - factBubbleWidth/2 + factRadius, factYPosition - 45 + factBubbleHeight);
      ctx.arcTo(factBubbleX - factBubbleWidth/2, factYPosition - 45 + factBubbleHeight, factBubbleX - factBubbleWidth/2, factYPosition - 45 + factBubbleHeight - factRadius, factRadius);
      ctx.lineTo(factBubbleX - factBubbleWidth/2, factYPosition - 45 + factRadius);
      ctx.arcTo(factBubbleX - factBubbleWidth/2, factYPosition - 45, factBubbleX - factBubbleWidth/2 + factRadius, factYPosition - 45, factRadius);
      ctx.closePath();
      ctx.fillStyle = '#673ab7';
      ctx.fill();

      // Connect line from bubble to point
      ctx.beginPath();
      ctx.moveTo(factBubbleX, factYPosition - 45 + factBubbleHeight);
      ctx.lineTo(xPosition, factYPosition - 8);
      ctx.strokeStyle = '#673ab7';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Fact bubble text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${factValue} шт`, factBubbleX, factYPosition - 30);
      
      // Draw date bubble at the bottom
      const dateBubbleWidth = 70;
      const dateBubbleHeight = 25;
      const dateRadius = 4;
      
      ctx.beginPath();
      ctx.moveTo(xPosition - dateBubbleWidth/2 + dateRadius, chartArea.bottom + 10);
      ctx.lineTo(xPosition + dateBubbleWidth/2 - dateRadius, chartArea.bottom + 10);
      ctx.arcTo(xPosition + dateBubbleWidth/2, chartArea.bottom + 10, xPosition + dateBubbleWidth/2, chartArea.bottom + 10 + dateRadius, dateRadius);
      ctx.lineTo(xPosition + dateBubbleWidth/2, chartArea.bottom + 10 + dateBubbleHeight - dateRadius);
      ctx.arcTo(xPosition + dateBubbleWidth/2, chartArea.bottom + 10 + dateBubbleHeight, xPosition + dateBubbleWidth/2 - dateRadius, chartArea.bottom + 10 + dateBubbleHeight, dateRadius);
      ctx.lineTo(xPosition - dateBubbleWidth/2 + dateRadius, chartArea.bottom + 10 + dateBubbleHeight);
      ctx.arcTo(xPosition - dateBubbleWidth/2, chartArea.bottom + 10 + dateBubbleHeight, xPosition - dateBubbleWidth/2, chartArea.bottom + 10 + dateBubbleHeight - dateRadius, dateRadius);
      ctx.lineTo(xPosition - dateBubbleWidth/2, chartArea.bottom + 10 + dateRadius);
      ctx.arcTo(xPosition - dateBubbleWidth/2, chartArea.bottom + 10, xPosition - dateBubbleWidth/2 + dateRadius, chartArea.bottom + 10, dateRadius);
      ctx.closePath();
      ctx.fillStyle = '#6a33f8';
      ctx.fill();
      
      // Date bubble text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const dateLabel = productionData.labels[dataPointIndex];
      if (dateLabel) {
        ctx.fillText(dateLabel.toString(), xPosition, chartArea.bottom + 22);
      }
      
      // Draw draggable handle indicator
      ctx.beginPath();
      ctx.arc(xPosition, chartArea.bottom - 15, 8, 0, Math.PI * 2);
      ctx.fillStyle = isDraggingRef.current ? '#5529cc' : '#6a33f8';
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(xPosition - 3, chartArea.bottom - 18);
      ctx.lineTo(xPosition - 3, chartArea.bottom - 12);
      ctx.moveTo(xPosition, chartArea.bottom - 18);
      ctx.lineTo(xPosition, chartArea.bottom - 12);
      ctx.moveTo(xPosition + 3, chartArea.bottom - 18);
      ctx.lineTo(xPosition + 3, chartArea.bottom - 12);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Restore canvas
      ctx.restore();
    }
  };

  // Custom plugin for downtime chart interactive marker
  const downtimeMarkerPlugin: Plugin<'line'> = {
    id: 'downtimeMarker',
    afterDatasetsDraw(chart, args, options) {
      if (downtimeMarkerIndex === null) return;
      
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) return;
      if (!downtimeData.labels) return;

      // Save current canvas state
      ctx.save();
      
      // Get x-coordinate of the marker
      const dataPointIndex = downtimeMarkerIndex;
      const xPosition = scales.x.getPixelForValue(dataPointIndex);
      
      // Draw vertical line
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(xPosition, chartArea.top);
      ctx.lineTo(xPosition, chartArea.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff4d6d';
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Get dataset value at the marker position
      const downtimeValue = downtimeData.datasets[0]?.data[dataPointIndex];
      
      if (downtimeValue === undefined) return;
      
      // Draw point
      const downtimeYPosition = scales.y.getPixelForValue(downtimeValue as number);
      ctx.beginPath();
      ctx.arc(xPosition, downtimeYPosition, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#ff4d6d';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      
      // Draw bubble for downtime value
      const bubbleWidth = 80;
      const bubbleHeight = 30;
      const bubbleRadius = 4;
      
      ctx.beginPath();
      ctx.moveTo(xPosition - bubbleWidth/2 + bubbleRadius, downtimeYPosition - 45);
      ctx.lineTo(xPosition + bubbleWidth/2 - bubbleRadius, downtimeYPosition - 45);
      ctx.arcTo(xPosition + bubbleWidth/2, downtimeYPosition - 45, xPosition + bubbleWidth/2, downtimeYPosition - 45 + bubbleRadius, bubbleRadius);
      ctx.lineTo(xPosition + bubbleWidth/2, downtimeYPosition - 45 + bubbleHeight - bubbleRadius);
      ctx.arcTo(xPosition + bubbleWidth/2, downtimeYPosition - 45 + bubbleHeight, xPosition + bubbleWidth/2 - bubbleRadius, downtimeYPosition - 45 + bubbleHeight, bubbleRadius);
      ctx.lineTo(xPosition - bubbleWidth/2 + bubbleRadius, downtimeYPosition - 45 + bubbleHeight);
      ctx.arcTo(xPosition - bubbleWidth/2, downtimeYPosition - 45 + bubbleHeight, xPosition - bubbleWidth/2, downtimeYPosition - 45 + bubbleHeight - bubbleRadius, bubbleRadius);
      ctx.lineTo(xPosition - bubbleWidth/2, downtimeYPosition - 45 + bubbleRadius);
      ctx.arcTo(xPosition - bubbleWidth/2, downtimeYPosition - 45, xPosition - bubbleWidth/2 + bubbleRadius, downtimeYPosition - 45, bubbleRadius);
      ctx.closePath();
      ctx.fillStyle = '#ff4d6d';
      ctx.fill();
      
      // Bubble text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${downtimeValue} ч`, xPosition, downtimeYPosition - 30);
      
      // Draw date bubble at the bottom
      const dateBubbleWidth = 70;
      const dateBubbleHeight = 25;
      const dateRadius = 4;
      
      ctx.beginPath();
      ctx.moveTo(xPosition - dateBubbleWidth/2 + dateRadius, chartArea.bottom + 10);
      ctx.lineTo(xPosition + dateBubbleWidth/2 - dateRadius, chartArea.bottom + 10);
      ctx.arcTo(xPosition + dateBubbleWidth/2, chartArea.bottom + 10, xPosition + dateBubbleWidth/2, chartArea.bottom + 10 + dateRadius, dateRadius);
      ctx.lineTo(xPosition + dateBubbleWidth/2, chartArea.bottom + 10 + dateBubbleHeight - dateRadius);
      ctx.arcTo(xPosition + dateBubbleWidth/2, chartArea.bottom + 10 + dateBubbleHeight, xPosition + dateBubbleWidth/2 - dateRadius, chartArea.bottom + 10 + dateBubbleHeight, dateRadius);
      ctx.lineTo(xPosition - dateBubbleWidth/2 + dateRadius, chartArea.bottom + 10 + dateBubbleHeight);
      ctx.arcTo(xPosition - dateBubbleWidth/2, chartArea.bottom + 10 + dateBubbleHeight, xPosition - dateBubbleWidth/2, chartArea.bottom + 10 + dateBubbleHeight - dateRadius, dateRadius);
      ctx.lineTo(xPosition - dateBubbleWidth/2, chartArea.bottom + 10 + dateRadius);
      ctx.arcTo(xPosition - dateBubbleWidth/2, chartArea.bottom + 10, xPosition - dateBubbleWidth/2 + dateRadius, chartArea.bottom + 10, dateRadius);
      ctx.closePath();
      ctx.fillStyle = '#ff4d6d';
      ctx.fill();
      
      // Date bubble text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const dateLabel = downtimeData.labels[dataPointIndex];
      if (dateLabel) {
        ctx.fillText(dateLabel.toString(), xPosition, chartArea.bottom + 22);
      }
      
      // Restore canvas
      ctx.restore();
    }
  };

  // Handle chart click to move marker
  const handleChartClick = (event: ChartEvent) => {
    const chart = chartRef.current;
    if (!chart) return;

    const points = chart.getElementsAtEventForMode(
      event.native as Event,
      'nearest',
      { intersect: false },
      false
    );
    
    if (points.length) {
      const index = points[0].index;
      setMarkerIndex(index);
    }
  };

  // Handle downtime chart click
  const handleDowntimeChartClick = (event: ChartEvent) => {
    const chart = downtimeChartRef.current;
    if (!chart) return;

    const points = chart.getElementsAtEventForMode(
      event.native as Event,
      'nearest',
      { intersect: false },
      false
    );
    
    if (points.length) {
      const index = points[0].index;
      setDowntimeMarkerIndex(index);
    }
  };

  // Set up mouse event handlers for dragging
  useEffect(() => {
    const chartElement = document.getElementById('production-chart');
    if (!chartElement) return;

    // Mouse down event to start dragging
    const handleMouseDown = (e: MouseEvent) => {
      if (!chartRef.current) return;
      const rect = chartElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if the click is on the drag handle
      const { chartArea, scales } = chartRef.current;
      const markerX = scales.x.getPixelForValue(markerIndex);
      const dragHandleY = chartArea.bottom - 15;
      
      // Check if click is within the drag handle
      if (Math.sqrt((x - markerX)**2 + (y - dragHandleY)**2) <= 10) {
        isDraggingRef.current = true;
      }
    };

    // Mouse move event for dragging
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !chartRef.current) return;
      
      const rect = chartElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      
      // Convert x position to data index
      const { scales } = chartRef.current;
      const labels = productionData.labels || [];
      const dataPoints = labels.length;
      
      // Find closest index based on mouse position
      let minDistance = Infinity;
      let closestIndex = 0;
      
      for (let i = 0; i < dataPoints; i++) {
        const pointX = scales.x.getPixelForValue(i);
        const distance = Math.abs(x - pointX);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      
      setMarkerIndex(closestIndex);
    };

    // Mouse up event to stop dragging
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Mouse leave event to stop dragging if cursor leaves chart
    const handleMouseLeave = () => {
      isDraggingRef.current = false;
    };

    // Touch start event for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      if (!chartRef.current || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      const rect = chartElement.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // Check if the touch is on the drag handle
      const { chartArea, scales } = chartRef.current;
      const markerX = scales.x.getPixelForValue(markerIndex);
      const dragHandleY = chartArea.bottom - 15;
      
      // Check if touch is within the drag handle or anywhere on the chart
      if (Math.sqrt((x - markerX)**2 + (y - dragHandleY)**2) <= 20) {
        isDraggingRef.current = true;
        e.preventDefault(); // Prevent scrolling while dragging
      } else if (y >= chartArea.top && y <= chartArea.bottom) {
        // If touching anywhere on the chart area, move marker to that position
        let minDistance = Infinity;
        let closestIndex = 0;
        
        const labels = productionData.labels || [];
        for (let i = 0; i < labels.length; i++) {
          const pointX = scales.x.getPixelForValue(i);
          const distance = Math.abs(x - pointX);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
          }
        }
        
        setMarkerIndex(closestIndex);
      }
    };

    // Touch move event for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !chartRef.current || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      const rect = chartElement.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      
      // Convert x position to data index
      const { scales } = chartRef.current;
      const labels = productionData.labels || [];
      const dataPoints = labels.length;
      
      // Find closest index based on touch position
      let minDistance = Infinity;
      let closestIndex = 0;
      
      for (let i = 0; i < dataPoints; i++) {
        const pointX = scales.x.getPixelForValue(i);
        const distance = Math.abs(x - pointX);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      
      setMarkerIndex(closestIndex);
      e.preventDefault(); // Prevent scrolling while dragging
    };

    // Touch end event for mobile devices
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    // Add event listeners
    chartElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    chartElement.addEventListener('mouseleave', handleMouseLeave);
    
    // Add touch event listeners
    chartElement.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    // Cleanup event listeners
    return () => {
      chartElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      chartElement.removeEventListener('mouseleave', handleMouseLeave);
      
      chartElement.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [markerIndex, productionData.labels]);

  // Similar touch support for downtime chart
  useEffect(() => {
    const downtimeChartElement = document.getElementById('downtime-chart');
    if (!downtimeChartElement) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (!downtimeChartRef.current || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      const rect = downtimeChartElement.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      
      // Find closest data point
      const { scales } = downtimeChartRef.current;
      let minDistance = Infinity;
      let closestIndex = 0;
      
      const labels = downtimeData.labels || [];
      for (let i = 0; i < labels.length; i++) {
        const pointX = scales.x.getPixelForValue(i);
        const distance = Math.abs(x - pointX);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      
      setDowntimeMarkerIndex(closestIndex);
    };

    // Add touch event listener
    downtimeChartElement.addEventListener('touchstart', handleTouchStart);

    // Cleanup
    return () => {
      downtimeChartElement.removeEventListener('touchstart', handleTouchStart);
    };
  }, [downtimeData.labels]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleChartClick,
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      tooltip: {
        enabled: false // Disable default tooltips as we use custom ones
      },
      legend: {
        display: false // Hide default legend, we use custom one
      }
    },
    hover: {
      mode: 'nearest' as const,
      intersect: false
    }
  };

  const downtimeChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleDowntimeChartClick,
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      tooltip: {
        enabled: false // Disable default tooltips as we use custom ones
      },
      legend: {
        display: false
      }
    },
    hover: {
      mode: 'nearest' as const,
      intersect: false
    }
  };

  // Initial setup to show markers on first render
  useEffect(() => {
    // Set a default marker at index 3 for production chart
    setMarkerIndex(3);
    
    // Set a default marker for downtime chart too
    setDowntimeMarkerIndex(2);
  }, []);

  return (
    <div className={styles.workshopDashboard}>
      <h1 className={styles.title}>Цех {workshopId}</h1>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            value={stat.value}
            percentage={stat.percentage}
            label={stat.label}
            trend={stat.trend}
            color={stat.color}
            trendData={stat.trendData}
          />
        ))}
      </div>

      {/* Main content section */}
      <div className={styles.mainSection}>
        {/* Production Chart */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <h2>Выпуск деталей</h2>
            <div className={styles.chartControls}>
              <button 
                className={`${styles.chartButton} ${activeChart === 'plan' ? styles.active : ''}`}
                onClick={() => setActiveChart('plan')}
              >
                План
              </button>
              <button 
                className={`${styles.chartButton} ${activeChart === 'defects' ? styles.active : ''}`}
                onClick={() => setActiveChart('defects')}
              >
                Факт
              </button>
            </div>
          </div>
          <div className={styles.chart}>
            <Line 
              id="production-chart"
              ref={chartRef}
              data={productionData} 
              options={chartOptions}
              plugins={[interactiveMarkerPlugin]} 
            />
          </div>
          <div className={styles.chartFooter}>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#4caf50' }}></span>
                План
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#673ab7' }}></span>
                Факт
              </span>
            </div>
            <div className={styles.chartInfo}>
              Нажмите или перетащите маркер для просмотра данных
            </div>
          </div>
        </div>

        {/* Operations Panel */}
        <div className={styles.operationsPanel}>
          <div className={styles.operationsHeader}>
            <h2>Операции</h2>
            <span className={styles.operationsIndicator}>5</span>
          </div>
          <ul className={styles.operationsList}>
            {operations.map((op, index) => (
              <li key={index} className={styles.operationItem}>
                <span className={styles.operationLabel}>{op.label}</span>
                <span className={styles.operationCount}>{op.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom section */}
      <div className={styles.bottomSection}>
        {/* Downtime Graph */}
        <div className={styles.downtimeChart}>
          <div className={styles.chartHeader}>
            <h2>График простоев</h2>
            <button className={styles.infoButton}>?</button>
          </div>
          <div className={styles.chart}>
            <Line 
              id="downtime-chart"
              ref={downtimeChartRef}
              data={downtimeData} 
              options={downtimeChartOptions} 
              plugins={[downtimeMarkerPlugin]}
            />
          </div>
          <div className={styles.chartFooter}>
            <div className={styles.chartInfo}>
              Нажмите на точку графика для просмотра данных
            </div>
          </div>
        </div>

        {/* Machine Status Grid */}
        <div className={styles.machinesSection}>
          <div className={styles.machineHeader}>
            <h2>Станки</h2>
            <div className={styles.machineSearch}>
              <input
                type="text"
                placeholder="Поиск станка..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.machineGrid}>
            {filteredMachines.map(machine => (
              <MachineCard
                key={machine.id}
                id={machine.id}
                status={machine.status}
                orderNumber={machine.orderNumber}
                onClick={handleMachineClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Machine Detail Section */}
      {selectedMachine && (
        <div className={styles.machineDetail}>
          <h2>Станок №{selectedMachine}</h2>
          <div className={styles.machineDetailStats}>
            {machineDetails[selectedMachine] ? (
              <div className={styles.machineDetailGrid}>
                <div className={styles.machineInfoCard}>
                  <h3>Информация о станке</h3>
                  <ul className={styles.machineInfoList}>
                    <li><strong>Станок:</strong> {machineDetails[selectedMachine].model}</li>
                    <li><strong>Текущее состояние:</strong> {machineDetails[selectedMachine].currentStatus}</li>
                    <li><strong>Оператор:</strong> {machineDetails[selectedMachine].operator}</li>
                    <li><strong>Изделие:</strong> {machineDetails[selectedMachine].product}</li>
                    <li><strong>Деталь:</strong> {machineDetails[selectedMachine].part}</li>
                    <li><strong>Тех. операция:</strong> {machineDetails[selectedMachine].techOperation}</li>
                    <li><strong>Установ/УП:</strong> {machineDetails[selectedMachine].setupProgram}</li>
                    <li><strong>Заказ/Маршрутный лист:</strong> {machineDetails[selectedMachine].orderRouteSheet}</li>
                    <li>
                      <strong>Прогресс:</strong> 
                      <div className={styles.progressInfo}>
                        План = {machineDetails[selectedMachine].progress.plan.toFixed(2)}%; 
                        Факт = {machineDetails[selectedMachine].progress.fact.toFixed(2)}%
                      </div>
                      <div className={styles.progressBarContainer}>
                        <div className={styles.progressBarPlan} style={{width: `${machineDetails[selectedMachine].progress.plan}%`}}></div>
                        <div className={styles.progressBarFact} style={{width: `${machineDetails[selectedMachine].progress.fact}%`}}></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <p>Нет информации для станка №{selectedMachine}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 