import { useState } from "react";
import styles from "./AuthView.module.css";
import LoginMain from "../svgs/LoginMain";
import Form from "./Form";

const AuthForm = ({ mode, setView }) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <LoginMain />
      </div>
      <div className={styles.right}>
        <Form mode={mode} setView={setView} />
      </div>
    </div>
  );
};

export default AuthForm;
