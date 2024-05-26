import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import React from 'react';
import Header from '../components/Header/Menu.jsx';
import Card from '../components/Card/index.jsx';
import Footer from '../components/Footer/Footer.jsx';
import Slides from '../components/Slides/Slides.jsx';

// import Header from './components/Header/Header.jsx';
import { FaShoppingCart } from 'react-icons/fa'; // Importando o ícone FaShoppingCartimport { FaBuilding } from 'react-icons/fa'; // Importando o ícone FaBuilding
 import a from '../imagens/m1.jpg';
 import '../App.css';
import Scroll from '../components/Scroll/Scroll.jsx';
 import Animacao from '../components/Animacao/Animacao.jsx';
 import Sugestao from './Sugestao';
 function Home() {
   return (
    <> 
        <Animacao/>
        <Header/>

        <Slides />
         {/*<div className='teste'>
            <h2>Minha Imagem</h2>
            <img src={a} alt="Descrição da imagem" />
        </div>*/}
         <div className="mostre">
             <h1>Serviços</h1>
             <p>Apostamos na excelência para execução dos nossos serviços.Amamos ajudar pessoas e negócios a crescerem.</p>
         </div>
          {/* chamando o components  Card*/}
                  
        <section className="projectos">
          <h2>Aplicações e Sistemas </h2>  
          <section className= "lista">
              <Card
              link = "/Ir_a_Praca"
              />
            
          </section>  
        </section> 
        
        <Scroll/>
         <Footer />

  </>   
   );
 }    
 
 export default Home;
 