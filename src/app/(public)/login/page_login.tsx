"use client";
import { useState } from "react";
import { FaGoogle, FaVk, FaTelegram } from "react-icons/fa";
import { Modal } from '@mantine/core';
import styles from "./LoginModal.module.css";

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

export function LoginModal({ opened, onClose, onOpenRegister }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt", { email, password });
    // Здесь будет логика авторизации
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Вход"
      classNames={{
        content: styles.modalContent,
        header: styles.modalHeader,
        title: styles.modalTitle,
      }}
      size="md"
      centered
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Войти
        </button>
        
        <div className={styles.socialLogin}>
          <p>Или войти через</p>
          <div className={styles.socialIcons}>
            <FaGoogle className={styles.icon} />
            <FaVk className={styles.icon} />
            <FaTelegram className={styles.icon} />
          </div>
        </div>
        
        <p className={styles.switchText}>
          Нет аккаунта?{' '}
          <button 
            type="button" 
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            className={styles.switchButton}
          >
            Зарегистрироваться
          </button>
        </p>
      </form>
    </Modal>
  );
}

