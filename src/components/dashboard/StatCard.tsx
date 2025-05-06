import React from 'react';
import styles from './StatCard.module.css';

type StatCardProps = {
  value: string;
  percentage: string;
  label: string;
  trend: 'up' | 'down';
  color: string;
  trendData: number[];
};

export default function StatCard({ value, percentage, label, trend, color, trendData }: StatCardProps) {
  const isPositive = trend === 'up';
  
  // Generate SVG path for the mini trend chart
  const generatePath = () => {
    if (!trendData || trendData.length < 2) return '';
    
    const max = Math.max(...trendData);
    const min = Math.min(...trendData);
    const range = max - min || 1;
    const width = 60;
    const height = 30;
    
    // Scale data points to fit the SVG viewBox
    const points = trendData.map((point, index) => {
      const x = (index / (trendData.length - 1)) * width;
      const y = height - ((point - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return `M ${points}`;
  };
  
  return (
    <div className={styles.statCard}>
        <div className={styles.statDetails}>
            <svg 
                className={styles.trendLine} 
            width="90" 
            height="60" 
            viewBox="0 0 60 30"
            >
            <path 
                d={generatePath()} 
                fill="none" 
                stroke={color} 
                strokeWidth="2"
            />
            </svg>
        </div>
        <div className={styles.statUP}>
            <div className={styles.statInfo}>
                <div className={styles.Text}>
                    <div className={styles.statValue}>{value}</div>
                    <div className={`${styles.statPercentage} ${isPositive ? styles.positive : styles.negative}`}>
                        {isPositive ? '+' : ''}{percentage}
                    </div>
                </div>
                <div className={styles.statLabel}>{label}</div>
            </div>
        </div>
    </div>
  );
} 