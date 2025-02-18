import styles from "./Manul.module.css";
import manulwebp from "./manul.webp";

type Props = {
    scale? :number;
};

export default function Manul({ scale } :Props){
    return(
        <div className={styles.outer}>
            <div className={styles.inner} style={{
            height: scale ? scale * 583 : 583,
            width: scale ? scale * 686 : 686
            }}><img src={manulwebp} className={styles.img} /></div>
        </div>
    );
}