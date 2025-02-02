import styles from "./Menu.module.css";
import bStyles from "./BottomMenu.module.css";

export default function BottomMenu(){
    return(<div className={`${styles.outer} ${bStyles.outer}`}>
        <button className={styles.button}>新建</button>
        <button className={styles.button}>回收站</button>
    </div>);
}