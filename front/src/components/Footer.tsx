"use client";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "./Footer.module.scss";

function Footer() {
  const pathname = usePathname();
  return (
    <>
      {!pathname.includes("repoBattle") && (
        <div className={styles.footerContainer}>
          <p className={styles.footerLogo}>RepoMon</p>
          <p className={styles.footerText}>
            Copyright ©로켓단 All right Reserved.
          </p>
        </div>
      )}
    </>
  );
}

export default Footer;
