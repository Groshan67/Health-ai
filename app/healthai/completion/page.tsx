"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Chat from "../../components/chatComplete";



const FunctionCalling = () => {


  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FunctionCalling;
