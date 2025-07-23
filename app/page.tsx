"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"
import styles from "./page.module.css";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/healthai/simple")
  }, []);

  const categories = {
    ['مدل 1']: "all",
    ['مدل 2']: "file-tune",
    ['مدل 3']: "completion",
    ['مدل 4']: "voice-chat",
    ['مدل 5']: "simple",
  };

  //return null;

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        انتخاب مدل
      </div>
      <div className={styles.container}>
        {Object.entries(categories).map(([name, url]) => (
          <a key={name} className={styles.category} href={`/healthai/${url}`}>
            {name}
          </a>
        ))}
      </div>
    </main>
  );

};

export default Home;
