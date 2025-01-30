import PropTypes from "prop-types";
import { ArrowLeft } from "lucide-react";
import styles from "./SubViewTitleFull.module.css";
import SubviewHeading from "./SubviewHeading";

const SubViewTitleFull = ({ searchTerm, view, setSearchTerm, exitFunc }) => {
  return (
    <div className={styles.topContainer}>
      <div className={styles.titleContainer}>
        <SubviewHeading
          text={`New ${view === "Friends" ? "Friend" : "Chat"}`}
        />
        <ArrowLeft onClick={exitFunc} />
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

SubViewTitleFull.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  exitFunc: PropTypes.func,
  view: PropTypes.string,
};

export default SubViewTitleFull;
