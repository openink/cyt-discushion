import styles from "./Menu.module.css";
import tStyles from "./TopMenu.module.css";

export default function TopMenu(){
    return(<div className={`${styles.outer} ${tStyles.outer}`}>
        <button className={styles.button}>主页</button>
        <button className={styles.button}>通知</button>
        <button className={styles.button}>设置</button>
    </div>);
}