import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./Form.module.css";
import { KeyRound, Mail, PenTool } from "lucide-react";
import { useWebSocket } from "../../contexts/WebSocketContext";

const Form = ({ mode, setView }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { fetchData } = useWebSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "sign") {
      const data = fetchData("/users/create", "POST", {
        name: name,
        email: email,
        password: password,
      });
      if (data) setView("login");
    } else {
      fetchData("/users/login", "POST", {
        email: email,
        password: password,
      });
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
      <div>
        {mode === "sign" && (
          <div className={styles.inputGroup}>
            <div>
              <PenTool size={"1em"} />
              <label htmlFor="name">Name</label>
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
        )}
        <div className={styles.inputGroup}>
          <div>
            <Mail size={"1em"} />
            <label htmlFor="email">Email</label>
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <div>
            <KeyRound size={"1em"} />
            <label htmlFor="password">Password</label>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            minLength={6}
            required
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <button type="submit" className={styles.button}>
          {mode === "log" ? "Login" : "Sign Up"}
        </button>

        {mode === "log" && (
          <a onClick={() => setView("sign")}>Sign up instead...</a>
        )}
        {mode === "sign" && (
          <a onClick={() => setView("log")}>Log in instead...</a>
        )}
      </div>
    </form>
  );
};

Form.propTypes = {
  mode: PropTypes.string,
  setView: PropTypes.func,
};

export default Form;
