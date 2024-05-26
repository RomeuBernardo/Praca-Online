import styles from './card.module.css';
import { FaHtml5 } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';

function Card({ title, description, icon, height = '300px', width = '300px', display = '', justify_content = '', align = '', text_align = '', position = 'static', right = 'auto', left = 'auto', bottom = 'auto', margin = '0', font_size = 'inherit', marginLeft = '0', marginRight = '0', marginTop = '0', marginBottom = '0' }) {
    const cardStyle = {
        height: height,
        width: width,
        display: display,
        justifyContent: justify_content,
        alignItems: align,
        textAlign: text_align,
        position: position,
        right: right,
        left: left,
        bottom: bottom,
        margin: margin,
        fontSize: font_size,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginTop: marginTop,
        marginBottom: marginBottom
    };


    return (
        <section className={styles.card} style={cardStyle}>
            <h3>{title}</h3>
            <p className={styles.card_description}>{description}</p>
            <div className={styles.card_footer}>
                <div className={styles.card_icones}>
                    {icon}
                </div>
                <button className={styles.botao}>
                    <BsArrowRight />
                </button>
            </div>
        </section>
    );
}


export default Card;
