import { useState } from "react";
import styles from "./Login.module.css";
import AuthForm from "./AuthView";
import LoginMain from "../svgs/LoginMain";

const Login = () => {
  const [view, setView] = useState(null);

  return (
    <div className={styles.loginContainer}>
      {view && <AuthForm mode={view} setView={setView} />}
      {!view && (
        <>
          <LoginMain />
          <div className={styles.buttons}>
            <button onClick={() => setView("log")}>Log In</button>
            <a onClick={() => setView("sign")} target="_blank">
              Sign Up
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
