import PropTypes from "prop-types";
import { User2 } from "lucide-react";
import styles from "./UserPicture.module.css";

const UserPicture = ({ user }) => {
  return (
    <div className={styles.picture}>
      {user.picture ? (
        <img className={styles.full} src={user.picture}></img>
      ) : (
        <User2 className={styles.default} strokeWidth="1.5" />
      )}
    </div>
  );
};

UserPicture.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserPicture;
