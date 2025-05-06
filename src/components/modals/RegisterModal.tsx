import { Modal } from '@mantine/core';
import { useState } from 'react';
import styles from './Modals.module.css';
import { FaGoogle, FaVk, FaTelegram } from "react-icons/fa";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Registration attempt", formData);
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
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Электронная почта</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword">Повторите пароль</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="username">Никнейм</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={styles.input}
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