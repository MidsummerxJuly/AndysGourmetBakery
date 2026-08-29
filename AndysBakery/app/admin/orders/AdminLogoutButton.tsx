"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button className={styles.logoutButton} onClick={handleLogout}>
      Logout
    </button>
  );
}