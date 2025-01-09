import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./NewConversation.module.css";

const NewConversation = ({ setAdding }) => {
  const [exiting, setExiting] = useState(false);

  const handleExitClick = () => {
    setExiting(true);
    setTimeout(() => {
      setAdding(false);
    }, 750); // this should match var(--sliding-view-transition)
  };

  return (
    <div
      onClick={handleExitClick}
      className={`${exiting ? "hide" : "show"} ${
        styles.newConversationContainer
      }`}
    >
      h1
    </div>
  );
};

NewConversation.propTypes = {
  setAdding: PropTypes.func.isRequired,
};

export default NewConversation;
