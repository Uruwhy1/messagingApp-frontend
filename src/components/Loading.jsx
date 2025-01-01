import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";
import styles from "./Loading.module.css";

export default function Loading({ loadingFade }) {
  return (
    <div className={`${styles.container} ${loadingFade ? styles.fading : ""}`}>
      <Loader2 size={"1em"} strokeWidth={3} className={styles.svg} />
    </div>
  );
}

Loading.propTypes = {
  loadingFade: PropTypes.bool.isRequired,
};
