import React from 'react';
// import { Outlet, Link } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
import { useNavigate, Navigate } from 'react-router-dom';


function Title() {
    return (<h1 className="title">Fake Stack Overflow</h1>);
}

const SignUpButton = () => {

    const navigate = useNavigate();
    const handleClick = () => navigate('/signup');
  
    return (
        <button className='register-btn center' onClick={handleClick}>Register</button>
    );
  };

const LogInButton = () => {

    const navigate = useNavigate();
    const handleClick = () => navigate('/login');
  
    return (
        <button className='login-btn center'onClick={handleClick}>Log In</button>
    );
  };


  const GuestButton = () => {

    const navigate = useNavigate();
    const handleClick = () => navigate('/home');
  
    return (
        <button className='guest-btn center'onClick={handleClick}>Continue as Guest</button>
    );
  };

function Buttons(){

//   const navigate = useNavigate();
//   const handleClick = () => navigate('/signup');

    return(
        <div className='center'>
            <h2 className='center'>Welcome!</h2>
            <SignUpButton />
            <br></br>
             <LogInButton />
            <br></br>
            {/* <button className='guest-btn center'>Continue as Guest</button> */}
            <GuestButton />
        </div>
    )
}


export default class WelcomePage extends React.Component {

    render() {

      let cookie = document.cookie;
      const user = cookie.slice(4)
      
        return (
          <div className="container">
          {user !== "" && (
          <Navigate to="/home" replace={true}/>
          )}
              <Title />
              <Buttons />
          </div>
        );
      }

  }