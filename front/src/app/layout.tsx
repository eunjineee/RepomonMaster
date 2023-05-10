import "@/styles/globals.scss";
import "@/styles/tailwind.css";

import Header from "../components/Header";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import Loading from "./loading";
import Providers from "@/redux/provider";
import styles from "./layout.module.scss";

export const metadata = {
  title: "Repomon",
  description: "깃으로 키우는 Repomon 프로젝트",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <html lang="ko">
        <body style={{ backgroundColor: "78acde" }}>
          <Header />
          <Suspense fallback={<Loading />}>
            <div className={styles.children}>{children}</div>
          </Suspense>
          <Footer />
        </body>
      </html>
    </Providers>
  );
};

export default RootLayout;
