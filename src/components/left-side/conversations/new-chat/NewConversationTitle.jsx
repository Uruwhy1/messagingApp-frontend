import PropTypes from "prop-types";
import { ArrowLeft } from "lucide-react";
import styles from "./NewConversationTitle.module.css";

const NewConversationTitle = ({ searchTerm, setSearchTerm, exitFunc }) => {
  return (
    <div className={styles.topContainer}>
      <div className={styles.titleContainer}>
        <ArrowLeft onClick={exitFunc} />
        <h3>New Chat...</h3>
      </div>
      <input
        type="text"
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
};

NewConversationTitle.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  exitFunc: PropTypes.func,
};

export default NewConversationTitle;
