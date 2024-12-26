import PropTypes from "prop-types";
import styles from "./AuthView.module.css";
import LoginMain from "../svgs/LoginMain";
import Form from "./Form";
import { X } from "lucide-react";

const AuthForm = ({ mode, setView }) => {
  return (
    <div className={styles.container}>
      <button onClick={() => setView(null)} className={styles.close}>
        <X />
      </button>
      <div className={styles.left}>
        <LoginMain />
      </div>
      <div className={styles.right}>
        <Form mode={mode} setView={setView} />
      </div>
    </div>
  );
};

AuthForm.propTypes = {
  mode: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
};

export default AuthForm;
