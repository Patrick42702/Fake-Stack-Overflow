// import React from 'react';
import React, { useEffect, useState } from 'react';
const {
    get_user_data,
    getAllUsers,
  } = require("../data/user");

// export default class ProfilePage extends React.Component {

//     constructor(props){
//       super(props);
//       // this.handleUser = this.handleUser.bind(this)
//     }

//     // handleUser(user) {
//     //   // this.props.handleQuestionState("Newest");
//     //   this.props.initializeUser(user)
//     // }



//     render() {
//       let cookie = document.cookie;
//       const user = cookie.slice(4)

//         return (
//           <div className="container">
//               <h1>Profile</h1>
//           </div>
//         );
//       }
//   }

  const Questions = (props) => {
    // console.log(props.questions)
   

    // questions.forEach((question) => {
    //   question_titles.push(
    //     <div>
    //       <p>{question.title}</p>
    //     </div>
    //   )
    // });
    
    return (
      <div>
        <h3>User's Questions:</h3>
        <div id="question-container">{props.questions}</div>
      </div>
    );
  }

  const QuestionTitle = (props) => {
    const title = props.title
    const id = props.id

    const editQuestion = () => {
      props.handleQuesAns(props.question);
      // console.log(props.question);
      props.handleQuestionState("EditQuestion");
    }

    return(
      <a href="#0" onClick={editQuestion}  className="title">
          {`${title}`}
      </a>
    )
  }

  const Tags = (props) => {

    const viewTags = () => {
      props.handleQuestionState("Tags");
    }

    return(
      <a href="#0"  onClick={viewTags} className="title">
         View All Tags
      </a>
    )
  }

  const UserQuestions = (props) => {

    const viewQuestions = () => {
      props.handleQuestionState("Newest");
    }

    return(
      <a href="#0"  onClick={viewQuestions} className="title">
         View User Questions
      </a>
    )
  }

  const UserTime = (props) => {
    const time = props.time;

    const timeInSec = time / 1000;
    const timeInMin = time / (1000 * 60);
    const timeInHour =  time / (1000 * 60 * 60);
    const timeInDays =  time / (24 * 60 * 60 * 1000) 

    if(timeInDays > 1.0){
      let t = timeInDays.toFixed(0)
      return(
        <p>You have been a member for {t} days</p>
      )
    } else if(timeInHour > 1.0){
      let t = timeInHour.toFixed(0)
      return(
        <p>You have been a member for {t} hours</p>
      )
    } else if(timeInMin > 1.0){
      let t = timeInMin.toFixed(0)
      return(
        <p>You have been a member for {t} minutes</p>
      )
    } else{
      let t = timeInSec.toFixed(0)
      return(
        <p>You have been a member for {t} seconds</p>
      )
    }
  }

 const AllUsers = (props) => {
  const [allUsers, setAllUsers] = useState(null)
  const name = props.username;


  useEffect(() => {

    const fetchData = async () => {
     const result = await getAllUsers()
    //  console.log(result);
     let usernames = [];
     result.forEach((user) => {
      if (user.username == name){

      } else{
        usernames.push(
          <div>
          <a href="#0" className="title">
          {`${user.username}`}
         </a>
         <button>Delete</button>
         </div>
        );
      }
     
     });
     setAllUsers(usernames);
    //  console.log(usernames);

    };

    fetchData();
  }, []); 

  return(
    <div>
      <h3>List of all Users:</h3>
      {allUsers}
    </div>
  )
 }


  const ProfilePage = (props) => {
    const [userData, setUserData] = useState(null); // userData will have all the user info that can be rendered in the profile page
    const [username, setUsername] = useState(null)
    const [reputation, setReputation] = useState(null)
    const [date_created, setDateCreated] = useState(null)
    const [questions, setQuestions] = useState(null)
    const [is_admin, setAdmin] = useState(null)
    let cookie = document.cookie;
    const user = cookie.slice(4)
    // let reputation = null;
    // console.log(reputation)

   const editQuestion = () => {
    console.log("Editing")
   }

    useEffect(() => {
      const fetchData = async () => {
        const user_data = await get_user_data(user); // use this function to get user data using the cookie
        console.log(user_data)
        // console.log(user_data.username)
        setUsername(user_data.username);
        setReputation(user_data.Reputation);

        const date = user_data.time_user_created
        const timethen = new Date(date);
        const timeNow = new Date()
        const time = timeNow - timethen
        console.log(time)
        const timeInSec = time / 1000;
        const isAdmin = user_data.admin;
        console.log(isAdmin);
        setAdmin(isAdmin);
        // console.log(timeInSec)
        const timeInMin = time / (1000 * 60);
        const timeInHour =  time / (1000 * 60 * 60);
        const timeInDays =  time / (24 * 60 * 60 * 1000) 
        setDateCreated(time)

        // setQuestions(user_data.questions)

        const questions = user_data.questions;
        const question_titles = [];
  

        questions.forEach((question) => {
          // console.log(question)
          // console.log(question._id);
          question_titles.push(
            <div key={question._id}>
              {/* <p>{question.title}</p> */}
              {/* <a href="#0" onClick={editQuestion}  className="title">
              {`${question.title}`}
              </a> */}
            <QuestionTitle 
            title = {question.title}
            question = {question}
            handleQuestionState={props.handleQuestionState}
            handleQuesAns={props.handleQuesAns} />
            </div>
          )
        });

        setQuestions(question_titles)
        // console.log(user_data.questions)
        // setUserData(user_data)
      };
  
      fetchData();
    }, []); 
    
    // console.log(reputation)


    if(is_admin == true) {
      return (
        <div>
          <h2>Admin Page:</h2>
          <UserTime 
          time = {date_created}/>
          <p>You reputation is {reputation}</p>
          <br></br>
          <AllUsers 
          username = {username}/>
        </div>
      );

    } else{
      console.log("false")
      return (
        <div>
          <h2>Profile Page:</h2>
          <p>Username: {username}</p>
          {/* <p>You have been a member for {date_created} Minutes</p> */}
          <UserTime 
          time = {date_created}/>
          {/* Change date to match based on the time inside another component */}
          <p>You reputation is {reputation}</p>
          <br></br>
          <Questions 
          questions = {questions}/>
          <br></br>
          <Tags 
           handleQuestionState={props.handleQuestionState}/>
           <br></br>
           <br></br>
          <UserQuestions 
          handleQuestionState={props.handleQuestionState}/>
          {/* {<p>{reputation}</p>} */}
          {/* {userData && <p>{userData}</p>} */}
        </div>
      );
    }


   
  };
  
  export default ProfilePage;
  