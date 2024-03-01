import React from "react";
import { useNavigate } from 'react-router-dom';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.handleEnter = this.handleEnter.bind(this);
    }

    handleEnter(e){
        if (e.key === "Enter"){
            this.props.handleStrChange(e.target.value)
            this.props.handleQuestionState("Search");
        }
    }

    render() {
        return (
            <input 
            type="text" 
            onKeyDown={this.handleEnter}
            placeholder="search" 
            id="search-bar" />
        );
    }
}

function Title() {
    return (<h1 className="header-text">Fake Stack Overflow</h1>);
}

const HomeButton = (props) => {

    let cookie = document.cookie;
    const user = cookie.slice(4)

    const navigate = useNavigate();
    const handleClick = () => {
        document.cookie = `jwt=; expires=Thu, 01 Jan 2000 00:00:00 GMT;`;
        navigate('/');
    }

    if(user === ""){
        
    } else{
        return (
            <button className='logout-btn' onClick={handleClick}>Log Out</button>
        );
    }
    
  };


const ProfilePageButton = (props) => {

    // const user = props.user;

    let cookie = document.cookie;
    const user = cookie.slice(4)
    // console.log("Cookie: " + user1)
    // if(user1 == ""){
    //     console.log("Guest");
    // } else{
    //     console.log("User");
    // }

    const navigate = useNavigate();

    const handleProfileClick = () => {
        props.handleQuestionState("Profile");
    }

    const handleSignUpClick = () => {
        navigate('/signup');
    }

    if(user === ""){
        return(
            <button className='profile-btn' onClick={handleSignUpClick}>Sign Up</button>
        )
    } else{
        return(
            <button className='profile-btn' onClick={handleProfileClick}>View Profile</button>
        )
    }

}
  
  
export default class TitleHeader extends React.Component {
    render() {
        const user = this.props.user

        return (
            <div className="header">
                <HomeButton/>
                <ProfilePageButton
                handleQuestionState={this.props.handleQuestionState}/>
                <Title />
                <Search
                handleQuestionState={this.props.handleQuestionState}
                searchstring={this.props.searchstring}
                handleStrChange={this.props.handleStrChange}/>
            </div>
        );
    }
}
