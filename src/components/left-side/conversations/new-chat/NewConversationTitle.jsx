import PropTypes from "prop-types";
import { ArrowLeft } from "lucide-react";
import styles from "./NewConversationTitle.module.css";
import SubviewHeading from "../../../reusable/SubviewHeading";

const NewConversationTitle = ({ searchTerm, setSearchTerm, exitFunc }) => {
  return (
    <div className={styles.topContainer}>
      <div className={styles.titleContainer}>
        <ArrowLeft onClick={exitFunc} />
        <SubviewHeading text="New Chat" />
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
