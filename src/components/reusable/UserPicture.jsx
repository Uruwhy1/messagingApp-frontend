import PropTypes from "prop-types";
import { User2 } from "lucide-react";
import styles from "./UserPicture.module.css";

const UserPicture = ({ user }) => {
  if (!user.picture)
    return (
      <div className={styles.picture}>
        <User2 strokeWidth="1.5" />
      </div>
    );
  else return <img className={styles.full} src={user.picture}></img>;
};

UserPicture.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserPicture;
