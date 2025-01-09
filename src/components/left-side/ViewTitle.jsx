import PropTypes from "prop-types";
import { MessageSquarePlus } from "lucide-react";
import styles from "./ViewTitle.module.css";

const ViewTitle = ({ searchTerm, setSearchTerm, view, setAdding }) => {
  return (
    <div className={styles.topContainer}>
      <div className={styles.titleContainer}>
        <h2>{view}</h2>
        <MessageSquarePlus onClick={() => setAdding(true)} />
      </div>
      <input
        type="text"
        placeholder="Search conversations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
};

ViewTitle.propTypes = {
  view: PropTypes.string.isRequired,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  setAdding: PropTypes.func,
};

export default ViewTitle;
