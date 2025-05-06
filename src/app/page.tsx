"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { LoginModal } from '@/components/modals/LoginModal';
import { RegisterModal } from '@/components/modals/RegisterModal';

const boardImage = '/board.png';
const logo = '/logo.svg';

export default function HomePage() {
    const [loginOpened, setLoginOpened] = useState(false);
    const [registerOpened, setRegisterOpened] = useState(false);

    return (
        <main className={styles.main}>

            <header className={styles.header}>
                <div className={styles.logo}>
                    <Image
                        src={logo}
                        alt="лого"
                        width={64}
                        height={64}
                        quality={100}
                        priority
                    />
                </div>
                <nav className={styles.nav}>
                    <a href="#about">О нас</a>
                    <a href="#rules">Отрасли</a>
                    <a href="#training">Продукты</a>
                </nav>
                <button className={styles.loginButton} onClick={() => setLoginOpened(true)}>
                    Оставить запрос
                </button>
            </header>

            <section className={styles.heroSection}>
                <div className={styles.heroText}>
                    <h1>Помогаем <br />гигантам российской <br />про­мыш­лен­ности<br/></h1>
                    <h2>работать <span>эффективнее</span></h2>
                    <p>
                        Лидер* российского промтеха.
                        <br/>Создаём цифровые продукты для управления тяжёлой промышленностью.
                    </p>
                    <button className={styles.ctaButton} onClick={() => setRegisterOpened(true)}>
                        Войти
                    </button>
                </div>
                <div className={styles.heroImage}>
                    <Image
                        src={boardImage}
                        alt="Игровое поле"
                        width={600}
                        height={600}
                        quality={100}
                        priority
                    />
                </div>
            </section>

            <LoginModal
                opened={loginOpened}
                onClose={() => setLoginOpened(false)}
                onOpenRegister={() => {
                    setLoginOpened(false);
                    setRegisterOpened(true);
                }}
            />

            <RegisterModal
                opened={registerOpened}
                onClose={() => setRegisterOpened(false)}
                onOpenLogin={() => {
                    setRegisterOpened(false);
                    setLoginOpened(true);
                }}
            />
        </main>
    );
}
