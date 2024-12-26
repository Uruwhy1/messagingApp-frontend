import { Loader2 } from "lucide-react";
import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.container}>
      <Loader2 size={"1em"} strokeWidth={3} className={styles.svg} />
    </div>
  );
}
