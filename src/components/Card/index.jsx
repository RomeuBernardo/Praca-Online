import React, { useState, useEffect } from 'react';
import $ from 'jquery'; // Importe o jQuery aqui se ainda não tiver feito
import styles from './card.module.css';
import { FaShoppingCart } from 'react-icons/fa'; // Importe o ícone FaShoppingCart
import { BsArrowRight } from 'react-icons/bs'; // Importe o ícone BsArrowRight

function Card(props) {
    const [publications, setPublications] = useState([]);

    useEffect(() => {
        const loadPublications = () => {
            $.ajax({
                url: 'http://localhost:5000/carregar_publicacoes',
                method: 'GET',
                success: function(response) {
                    if (response.success) {
                        setPublications(response.publicacoes);
                        console.log("Publicações:", response.publicacoes);
                    } else {
                        console.error('Erro ao carregar publicações:', response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Erro ao enviar requisição:', error);
                }
            });
        };

        loadPublications();
    }, []);

    return (
        <section className={styles.cardContainer}>
            {publications.map((publication, index) => (
                <div key={index} className={styles.card}>
                    <h3>{publication.titulo}</h3>
                    <p className={styles.cardDescription}>{publication.texto}</p>
                    <div className={styles.cardFooter}>
                        <div className={styles.cardIcons}>
                            {/* Renderizar os ícones */}
                                <FaShoppingCart />
                            
                        </div>
                        
                            <button className={styles.botao}  onClick={() => window.location.href =  props.link} >
                                <BsArrowRight />
                                
                            </button>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default Card;
