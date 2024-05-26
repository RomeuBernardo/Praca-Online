import React, { useState, useEffect,useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../App.css';
import { Toast } from 'primereact/toast';

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const toast = useRef(null);

  const show = (mensagem, estado) => {
      toast.current.show({ severity: estado, detail: mensagem });
  };
  useEffect(() => {
    const carregarSlides = async () => {
      try {
        const response = await fetch('http://localhost:5000/carregar_slides');
        const data = await response.json();
        if (data.success) {
          console.log(data.slides);
          setSlides(data.slides);
        } else {
          show('Erro ao carregar slides:', data.message);
        }
      } catch (error) {
        show('Erro ao carregar slides:', error);
      }
    };

    carregarSlides();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Mostra apenas uma imagem por vez
    slidesToScroll: 1, // Avança apenas uma imagem por vez
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <>
          <Toast ref={toast} style={{padding: "20px"}} />

      <div className='aumentar'>
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className='testel'>
              <img className='carousel-image' src={slide} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>
    
    </>
   
  );
};

export default Carousel;
