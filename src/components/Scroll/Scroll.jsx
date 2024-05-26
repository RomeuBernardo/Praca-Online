import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { Button } from 'primereact/button';
import './styles.css'; // Importa o estilo CSS

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const springProps = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(100px)',
    from: { opacity: 0, transform: 'translateY(100px)' }
  });

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // Adiciona e remove o event listener apenas no montar/desmontar do componente

  return (
    <animated.div className="scroll-to-top-button" style={springProps}>
      {isVisible && (
        <Button
          icon="pi pi-arrow-up"
          className="p-button-rounded p-button-primary p-button-lg p-shadow-12 scroll-to-top-button-animated"
          onClick={scrollToTop}
        />
      )}
    </animated.div>
  );
};

export default ScrollToTopButton;
