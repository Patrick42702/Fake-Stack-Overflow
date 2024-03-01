import TitleHeader from './titleHeader.js';
import Nav from './nav.js';
import React from 'react';
import Content from './content.js'




export default class FakeStackOverflow extends React.Component {
  constructor(props) {
    super(props);
    this.handleStrChange = this.handleStrChange.bind(this);
    this.handleQuestionState = this.handleQuestionState.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.state = {
      searchstring: "",
      contentState: "Newest",
    };
  }

  handleStrChange(e) {
    this.setState({ searchstring: e });
  }

  handleQuestionState(e){
    this.setState({contentState: e});
  }

  handleUser(user){
    this.props.initializeUser(user);
  }
  

  render() {
    const searchstring = this.state.searchstring;
    // let cookie = document.cookie;
    // const user1 = cookie.slice(4)

    // console.log("Cookie: " + user1);
    // console.log("User cookie: " + user);
    // console.log("Cookie in web: " + test)
    return (
      <div className="container">
        <TitleHeader
          searchstring={searchstring}
          handleStrChange={this.handleStrChange}
          handleQuestionState={this.handleQuestionState}/>
        <div id="main" className='main'>
          <Nav
          searchstring={searchstring}
          handleQuestionState={this.handleQuestionState} />
          <Content 
          contentState = {this.state.contentState}
          handleQuestionState={this.handleQuestionState}
          searchstring={searchstring}
          handleStrChange={this.handleStrChange}/>
        </div>
      </div>
    );
  }
}
