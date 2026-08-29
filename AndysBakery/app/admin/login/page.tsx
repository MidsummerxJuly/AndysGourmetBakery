"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";


export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") || "/admin/orders";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed.");
      }

      router.push(from);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <p className={styles.eyebrow}>Admin Access</p>

        <h1>Andy&apos;s Bakery Orders</h1>

        <p className={styles.intro}>
          Sign in to view customer orders, payment status, requested dates, and
          order notes.
        </p>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>

          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}