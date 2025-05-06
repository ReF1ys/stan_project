"use client";

import { useState } from "react";
import Link from "next/link";
import { LoginModal } from "../app/(public)/login/page_login";
import { RegisterModal } from "../app/(public)/register/page";
import styles from "./Header.module.css";

export default function Header() {
  const [loginOpened, setLoginOpened] = useState(false);
  const [registerOpened, setRegisterOpened] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>M</div>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>Главная</Link>
        <Link href="/dashboard" className={styles.navLink}>Дашборд</Link>
        <Link href="/stats" className={styles.navLink}>Статистика</Link>
        <Link href="/settings" className={styles.navLink}>Настройки</Link>
      </nav>
      <div className={styles.buttons}>
        <button 
          className={styles.loginButton}
          onClick={() => setLoginOpened(true)}
        >
          Войти
        </button>
        <button 
          className={styles.registerButton}
          onClick={() => setRegisterOpened(true)}
        >
          Регистрация
        </button>
      </div>

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
    </header>
  );
}

