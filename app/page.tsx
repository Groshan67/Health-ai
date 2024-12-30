"use client";

import React from "react";
import styles from "./page.module.css";

const Home = () => {
  // const categories = {
  //   "Basic chat": "basic-chat",
  //   "Function calling": "function-calling",
  //   "File search": "file-search",
  //   All: "all",
  // };

  const categories = {
    ['مدل 1']: "all",
    ['مدل 2']: "file-tune",
    ['مدل 3']: "completion",
  };

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
