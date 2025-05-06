import styles from './BackgroundLights.module.css'

const BackgroundLights = () => {
    return (
        <div className={styles.wrapper}>
            <img src="/decoratives/line1.svg" alt="Decorative Line 1" className={styles.line1} />
            <img src="/decoratives/Line.svg" alt="Decorative Line 2" className={styles.line2} />
        </div>
    )
}

export default BackgroundLights;
