import React from 'react';
import { CSSTransition } from 'react-transition-group';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../../App.css';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAnimation: true
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showAnimation: false });
    }, 3000); // Tempo em milissegundos para a animação durar
  }

  render() {
    return (
      <div className="app">
        <CSSTransition
          in={this.state.showAnimation}
          timeout={1000}
          classNames="fade"
          unmountOnExit
        >
          <div className="animation-content">
            {/* Conteúdo da animação */}
            <h1>Minha Página com Animação</h1>
          </div>
        </CSSTransition>
      </div>
    );
  }
}

export default App;
