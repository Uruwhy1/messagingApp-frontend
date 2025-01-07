import PropTypes from "prop-types";
import { MessageSquarePlus } from "lucide-react";
import styles from "./ViewTitle.module.css";

const ViewTitle = ({ searchTerm, setSearchTerm, view }) => {
  return (
    <div className={styles.topContainer}>
      <div className={styles.titleContainer}>
        <h2>{view}</h2>
        <MessageSquarePlus />
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
};

export default ViewTitle;
