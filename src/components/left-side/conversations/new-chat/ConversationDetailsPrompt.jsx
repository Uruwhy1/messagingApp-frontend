import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./ConversationDetailsPrompt.module.css";
import { ArrowLeft } from "lucide-react";
import SubviewHeading from "../../../reusable/SubviewHeading";
import PrimaryButton from "../../../reusable/PrimaryButton";

const ConversationDetailsPrompt = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [showIconInput, setShowIconInput] = useState(false);

  const handleSubmit = () => {
    onSubmit({ name, icon });
  };

  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.title}>
        <SubviewHeading text="New Group" />
        <ArrowLeft onClick={onCancel} />
      </div>
      <div className={styles.promptContainer}>
        <div className={styles.iconContainer}>
          {icon ? (
            <img
              onClick={() => {
                setShowIconInput(!showIconInput);
              }}
              src={icon}
              alt="Group Icon"
              className={styles.groupIcon}
            />
          ) : (
            <div
              className={styles.iconPlaceholder}
              onClick={() => {
                setShowIconInput(!showIconInput);
              }}
            >
              <span>ADD GROUP ICON</span>
            </div>
          )}

          {showIconInput && (
            <input
              type="text"
              className={styles.iconInput}
              placeholder="Enter URL..."
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          )}
        </div>
        <input
          type="text"
          className={styles.nameInput}
          placeholder="Group subject (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <PrimaryButton text="CREATE GROUP" func={handleSubmit} />
    </div>
  );
};

ConversationDetailsPrompt.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConversationDetailsPrompt;
