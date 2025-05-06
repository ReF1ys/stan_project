import React from 'react';
import styles from './MachineCard.module.css';

export type MachineStatus = 'working' | 'idle' | 'error' | 'maintenance';

type MachineCardProps = {
  id: string;
  status: MachineStatus;
  orderNumber: string;
  onClick: (id: string) => void;
};

export default function MachineCard({ id, status, orderNumber, onClick }: MachineCardProps) {
  // Map status to colors and labels
  const statusMap = {
    working: { 
      label: 'Состояние: работает', 
      className: styles.working 
    },
    idle: { 
      label: 'Состояние: простой', 
      className: styles.idle 
    },
    error: { 
      label: 'Состояние: авария', 
      className: styles.error 
    },
    maintenance: { 
      label: 'Состояние: ТО', 
      className: styles.maintenance 
    },
  };

  const statusInfo = statusMap[status];

  return (
    <div 
      className={`${styles.machineCard} ${statusInfo.className}`}
      onClick={() => onClick(id)}
    >
      <h3 className={styles.machineName}>Станок №{id}</h3>
      <div className={styles.cardsm}>
        <p className={styles.machineStatus}>{statusInfo.label}</p>
        <p className={styles.machineOrder}>Заказ: {orderNumber}</p>
      </div>
    </div>
  );
} 