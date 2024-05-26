import Header from '../components/Header/Menu.jsx';
import Slides from '../components/Slides/Slides.jsx';
import Footer from '../components/Footer/Footer.jsx';
import Scroll from '../components/Scroll/Scroll.jsx';
import  Card from '../components/Card/Card2.jsx';
import SobreNosV from './sobreNosV.jsx';
import '../App.css';

 function sobreNos(){
  return  (
    <>
      <Header/>
      <Slides/>
      <SobreNosV/>
      
      <Scroll/>
      <Footer/>
      

    </>
  
  );
}

export default sobreNos;