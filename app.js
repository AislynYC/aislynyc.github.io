class Header extends React.Component {
  state = {
    display: 'none'
  };

  openMenuCard = () => {
    this.setState({display: 'block'});
  };

  closeMenuCard = () => {
    this.setState({display: 'none'});
  };

  render() {
    return (
      <header className="main-header">
        <div className="header-top">
          <span className="title">Website Title / Logo</span>
          <img
            className="menu-btn"
            id="main-menu-btn"
            src="./img/iconfinder_menu_2561466.svg"
            alt="menu"
            onClick={this.openMenuCard}
          />
        </div>
        <ul className="main-nav">
          <li className="nav-item">
            <a href="./assignment1/index.html">Assignment 1</a>
          </li>
          <li className="nav-item">
            <a href="./assignment2/index.html">Assignment 2</a>
          </li>
          <li className="nav-item">
            <a href="#">Item 3</a>
          </li>
          <li className="nav-item">
            <a href="#">Item 4</a>
          </li>
        </ul>
        <div
          className="float-card"
          id="nav-card"
          style={{display: this.state.display}}>
          <img
            id="menu-close-btn"
            src="./img/iconfinder_icon-close_211652.svg"
            alt="close"
            onClick={this.closeMenuCard}
          />
          <ul id="mobile-nav">
            <li className="mobile-nav-item">
              <a href="./assignment1/index.html">Assignment 1</a>
            </li>
            <li className="mobile-nav-item">
              <a href="./assignment2/index.html">Assignment 2</a>
            </li>
            <li className="mobile-nav-item">
              <a href="#">Item 3</a>
            </li>
            <li className="mobile-nav-item">
              <a href="#">Item 4</a>
            </li>
          </ul>
        </div>
      </header>
    );
  }
}
class Banner extends React.Component {
  state = {
    welcomeMsg: 'Welcome Message'
  };

  welcome = () => {
    this.setState({welcomeMsg: 'Have a Good Time!'});
  };

  render() {
    return (
      <div className="banner" id="main-banner" onClick={this.welcome}>
        <h1 id="welcome-msg">{this.state.welcomeMsg}</h1>
      </div>
    );
  }
}

class ContentBox extends React.Component {
  state = {
    display: 'none'
  };

  addRow = () => {
    if (window.matchMedia('(min-width:500px)').matches) {
      this.setState({display: 'flex'});
    } else {
      this.setState({display: 'block'});
    }
  };

  render() {
    return (
      <div>
        <div className="section-title">
          <h2>Section Title</h2>
        </div>
        <Row />
        <Btn addRow={this.addRow} />
        <AddRow display={this.state.display} />
      </div>
    );
  }
}

const Row = () => {
  return (
    <div className="row">
      <div className="col">
        <p>Content Box 1</p>
      </div>
      <div className="col">
        <p>Content Box 2</p>
      </div>
      <div className="col">
        <p>Content Box 3</p>
      </div>
      <div className="col">
        <p>Content Box 4</p>
      </div>
    </div>
  );
};

const Btn = props => {
  return (
    <div className="btn" id="action-btn" onClick={props.addRow}>
      <span>Call to Action</span>
    </div>
  );
};

const AddRow = props => {
  return (
    <div className="row" id="additional-row" style={{display: props.display}}>
      <div className="col">
        <p>Content Box 5</p>
      </div>
      <div className="col">
        <p>Content Box 6</p>
      </div>
      <div className="col">
        <p>Content Box 7</p>
      </div>
      <div className="col">
        <p>Content Box 8</p>
      </div>
    </div>
  );
};

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Header />
        <Banner />
        <ContentBox />
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('root'));
