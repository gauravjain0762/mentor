"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className={styles.container}>

      {/* ── Left panel ── */}
      <div className={styles.leftPanel}>
        {/* Logo */}
        <div className={styles.logo}>
          <Image
            src="https://res.cloudinary.com/dbazlbkfj/image/upload/v1771390209/Layer_x0020_1_p5f6fs.png"
            alt="UPT"
            width={140}
            height={40}
            unoptimized
            className={styles.logoImg}
          />
        </div>

        <div className={styles.leftContent}>
          <h1 className={styles.heroTitle}>MENTOR<br/>DASHBOARD</h1>
          <p className={styles.heroSub}>
            Empowering trainers through guidance,<br/>
            performance insights &amp; operational control.
          </p>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>24+</span>
              <span className={styles.statLabel}>ACTIVE TRAINERS</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>482</span>
              <span className={styles.statLabel}>CLIENTS MANAGED</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>4.8</span>
              <span className={styles.statLabel}>AVG RATING</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrap}>

          <span className={styles.accessBadge}>MENTOR ACCESS</span>

          <h2 className={styles.welcomeTitle}>Welcome Back</h2>
          <p className={styles.welcomeSub}>Sign in to your mentor dashboard</p>

          <form className={styles.form} onSubmit={handleLogin}>

            <div className={styles.field}>
              <label className={styles.label}>EMAIL ADDRESS</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                  <polyline points="2,4 12,13 22,4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="mentor@uptgym.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>PASSWORD</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <input
                  className={styles.input}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.forgotRow}>
              <span className={styles.forgotLink}>Forgot Password?</span>
            </div>

            <button className={styles.loginBtn} type="submit">
              SIGN IN TO DASHBOARD
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}
