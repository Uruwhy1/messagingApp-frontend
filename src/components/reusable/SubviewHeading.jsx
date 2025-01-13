import PropTypes from "prop-types";
import styles from "./SubviewHeading.module.css";

const SubviewHeading = ({ text }) => {
  return <h3 className={styles.subviewHeading}>{text}</h3>;
};

SubviewHeading.propTypes = {
  text: PropTypes.string.isRequired,
};

export default SubviewHeading;
