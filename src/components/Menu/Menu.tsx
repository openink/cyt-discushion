import styles from "./Menu.module.css";

export default function Menu(){
    return(<div className={styles.outer}>
        <button>新建</button>
        <button>主页</button>
        <button>通知</button>
        <button>设置</button>
        <button>回收站</button>
    </div>);
}