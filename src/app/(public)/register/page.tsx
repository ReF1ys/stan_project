"use client";
import { useState } from "react";
import { FaGoogle, FaVk, FaTelegram } from "react-icons/fa";
import { Modal } from '@mantine/core';
import styles from "./RegisterModal.module.css";

interface RegisterModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export function RegisterModal({ opened, onClose, onOpenLogin }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    acceptedTerms: false,
  });

  // Функция для обработки изменений в инпутах
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Функция отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Форма отправлена", formData);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Регистрация"
      classNames={{
        content: styles.modalContent,
        header: styles.modalHeader,
        title: styles.modalTitle,
      }}
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Электронная почта</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            className={styles.input}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Пароль</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            className={styles.input}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>Повторите пароль</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            className={styles.input}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>Никнейм</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            className={styles.input}
            onChange={handleChange}
          />
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="acceptedTerms"
            id="acceptedTerms"
            checked={formData.acceptedTerms}
            onChange={handleChange}
          />
          <label htmlFor="acceptedTerms">
            Я прочитал Правила Сайта и принимаю их
          </label>
        </div>
        <button type="submit" className={styles.submitButton}>
          ЗАРЕГИСТРИРОВАТЬСЯ
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
          Уже есть аккаунт?{' '}
          <button 
            type="button"
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className={styles.switchButton}
          >
            Войти
          </button>
        </p>
      </form>
    </Modal>
  );
}