import React from 'react';
import { useNavigate, redirect, Navigate } from 'react-router-dom';
const {
  register,
} = require("../data/user");

function Title() {
  return (<h1 className="title">Fake Stack Overflow</h1>);
}

class SignUpForm extends React.Component { 
  constructor(props){
      super(props);
      this.state = {user: null}
    }

    handleSignUp = async () => {
      try {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // Checks if username is empty
        let userWarning = document.getElementById("username-warning");
        if(username == ""){
          userWarning.innerHTML = "Username field cannot be empty";
        } else{
          userWarning.innerHTML = "";
        }


        // Checks is email is corect form or not
        let emailWarning = document.getElementById("email-warning");
        const emailRegex = /^\S+@\S+\.com$/gm;
        const matches = email.match(emailRegex);
        if(email == ""){
          emailWarning.innerHTML = "Email field cannot be empty";
        }else if(matches){
          // console.log("This is an email");
          emailWarning.innerHTML = "";
        } else{
          // console.log("This is not an email")
          // alert("Email is not of the correct form");
          emailWarning.innerHTML = "Email is not of the correct form";
          
        }
        //

        // checks if password is empy or password contains username or email
        let passwordWarning = document.getElementById("password-warning");
        if(password == ""){
          passwordWarning.innerHTML = "Password field cannot be empty";
        } else if(password.includes(username) || password.includes(email)){
          passwordWarning.innerHTML = "Password cannot contain username or email";
        } else{
          passwordWarning.innerHTML = "";
        }

        // checks if confirm password is empty and if password match
        let confirmPasswordWarning = document.getElementById("confirm-password-warning");
        if(confirmPassword == ""){
          confirmPasswordWarning.innerHTML = "Confirm Password field cannot be empty";
        }else if(password === confirmPassword){
          confirmPasswordWarning.innerHTML = "";
        } else{
          confirmPasswordWarning.innerHTML = "Passwords must be the same";
          passwordWarning.innerHTML = "Passwords must be the same";
        }
        
        // if any fields are not empty then exit the function
        if(userWarning.innerHTML != "" || confirmPasswordWarning.innerHTML != "" || passwordWarning.innerHTML != "" || emailWarning.innerHTML != ""){
          // console.log("Failed")
          return;
        } 
        
        // send user data to backend
        const userData = await register(username, email, password);
        // console.log(userData);

        if(userData == undefined){
          // alert("Email is taken")
          emailWarning.innerHTML = "Email already taken, choose another"
          userWarning.innerHTML = "";
          confirmPasswordWarning.innerHTML = "";
          passwordWarning.innerHTML = "";
          return
        }

        this.setState({user: userData});

      }
      catch (error) {
        console.error("error retreiving user_data")
      }
    }

  render() {
    let {user} = this.state;
    // console.log(this.props.state.model)
    return (
      <div className="signup-form center">
        {user && (
          <Navigate to="/login" replace={true}/>
        )}
          <h2 className='signup-header'>Sign Up</h2>
          <form action="" id="signup-form">
              <label className="label-header">Username</label>
              <br />
              <input type="text" className="username-input text-box" id="username"></input>
              <p id="username-warning" className="red"></p>
              <br />
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

              <label className="label-header">Confirm Password</label>
              <br />
              <input type="password" className="username-input text-box" id="confirm-password"></input>
              <p id="confirm-password-warning" className="red"></p>
              <br />

              <button className="home-btn" type="button" onClick={this.handleSignUp}>Sign Up</button>
              {/* <SignUpButton /> */}

              {/* <label className="required-info">* indicated mandatory fields</label> */}
          </form>
      </div>
    );
  }
}

const HomeButton = () => {

  const navigate = useNavigate();
  const handleClick = () => navigate('/');

  return (
      <button className='home-btn center' onClick={handleClick}>Home</button>
  );
};


export default class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
      }

    render() {
        return (
          <div className="container">
              {/* <h1>Sign Up Page</h1> */}
              <Title />
              <SignUpForm  />
              <HomeButton />
          </div>
        );
      }

  }