import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
const {
  login,
} = require("../data/user");

function Title() {
  return (<h1 className="title">Fake Stack Overflow</h1>);
}

class LogInForm extends React.Component { 
  constructor(props){
      super(props);
      this.state = {user: null}
      // this.handleUser = this.handleUser.bind(this)
    }

    // handleUser(user) {
    //   // this.props.handleQuestionState("Newest");
    //   this.props.handleUser(user)
    // }

    handleLogin = async () => {
      try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        console.log(password);
        console.log(email);

        let emailWarning = document.getElementById("email-warning");
        emailWarning.innerHTML = "";
        const emailRegex = /^\S+@\S+\.com$/gm;
        const matches = email.match(emailRegex);
        if(email === ""){
          emailWarning.innerHTML = "Please enter an email";
        } else if(matches){
          emailWarning.innerHTML = "";
        } else{
          emailWarning.innerHTML = "Email is not of the correct form";
        }

        let passwordWarning = document.getElementById("password-warning");
        passwordWarning.innerHTML = ""
        if(password === ""){
          passwordWarning.innerHTML = "Please enter a password";
        }

        if(emailWarning.innerHTML !== "" || passwordWarning.innerHTML !== ""){
          return
        }

        const user_data = await login(email, password);
        console.log(user_data)

        if(user_data === undefined){
          // console.log("Wrong email or password");
          emailWarning.innerHTML = "Wrong email or password";
          passwordWarning.innerHTML = "Wrong email or password";
          return;
        } else{
          console.log("Login Success");
        }

        document.cookie = `jwt=${user_data.token}`;
        // this.handleUser(user_data.token)
        this.setState({user: user_data});
      }
      catch (error) {
        console.error("error retreiving user_data")
      }
    }

  render() {
    // console.log(this.props.state.model)
    let {user} = this.state;
    return (
      <div className="login-form center">
        {user && (
          <Navigate to="/home" replace={true}/>
        )}
          <h2 className='login-header'>Log In</h2>
          <form action="" id="login-form">
              <label className="label-header">Email</label>
              <br />
              <input type="text" className="username-input text-box" id="email"></input>
              <p id="email-warning" className="red"></p>
              <br />
              <label className="label-header">Password</label>
              <br />
              <input type="password" className="username-input text-box" id="password"></input>
              <p id="password-warning" className="red"></p>
              <br />
              <button className="home-btn" type="button" onClick={this.handleLogin}>Log In</button>
          </form>
      </div>
    ); 
  }
}

const HomeButton = () => {

  const navigate = useNavigate();
  const handleClick = () => navigate('/');

  return (
      <button className='home-btn center login-home-btn' onClick={handleClick}>Home</button>
  );
};



export default class LogInPage extends React.Component {

    // handleUser(user) {
    //   // this.props.handleQuestionState("Newest");
    //   this.props.initializeUser(user)
    // }

    render() {
        return (
          <div className="container">
              {/* <h1>Log In Page</h1> */}
              <Title />
              <LogInForm/>
              <HomeButton />
          </div>
        );
      }
  }
