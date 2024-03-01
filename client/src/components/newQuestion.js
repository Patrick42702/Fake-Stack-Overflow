import React from 'react';
const useQuestionData = require('../data/questionData');
const {
  get_username,
} = require("../data/user");

const {
  get_user_data,
} = require("../data/user");



function checkTags(tagsArr) { // Might want to put into the model.js
  for (let i = 0; i < tagsArr.length; i++) {
    if (tagsArr[i].length > 10) {
      let tagWarning = document.getElementById("tag-warning");
      tagWarning.innerHTML = "Tags cannot be more than 10 characters long";
      // alert("Tags cannot be more than 10 characters long");
      return true;
    }
  }
  return false;
}

function handleNewText(text){
  const bracketRegex = /\[(.*?)\]/g;
  const parenthesisRegex = /\(((https:|http:).*?)\)/g;
  // const regex = /\[(.*?)\]\((((https:|http:).*?)|)\)/gm;
  const regex = /\[(.*?)\]\(((.*?)|)\)/gm;
  const matches = text.match(regex);

  if(matches == null){
    return true;
  }
  // make it so that it returns false if no match

  for(let match of matches){
    let linkName = match.match(bracketRegex)[0];
    linkName = linkName.substring(1, linkName.length - 1); // This is name
    let href = match.match(parenthesisRegex);
    // href = href.substring(1, href.length-1);
    if (href == null){
      return false;
    } else{
      
    }
    
  }
  return true
}



class NewQuestionForm extends React.Component {

  constructor(props) {
    super(props);
    this.handlePostQuestion = this.handlePostQuestion.bind(this);
  }

  postNewQuestion = async (questionData, email) => {
    try {
      await useQuestionData.postQuestion(questionData, email, document.cookie);
      this.props.handleQuestionState("Newest");
    } catch (error) {
        console.error("Error retreiving questions data")
      this.setState({ error, loading: false });
    }
  };

  getUsername = async (user_token) => {
    try{
      const result = await get_user_data(user_token);
      // console.log(result.username);
      return result.username
    } catch(error){
      console.error("Error retreiving username")
    }
  }

  handlePostQuestion = async() => {
    // Instead of having a username field get users username and use that as the username being posted


    let title = document.getElementById("question-title");
    let text = document.getElementById("question-text");
    let tags = document.getElementById("question-tags");
    // let username = document.getElementById("username");

    let titleWarning = document.getElementById("title-warning");
    let textWarning = document.getElementById("text-warning");
    let tagWarning = document.getElementById("tag-warning");
    // let usernameWarning = document.getElementById("user-warning");

    let cookie = document.cookie;
    const user = cookie.slice(4)

    if (title.value === "") {
      titleWarning.innerHTML = "Need to enter a title";
    } else {
      if (title.value.length > 100) {
        titleWarning.innerHTML = "Title too long";
      } else {
        titleWarning.innerHTML = "";
      }
    }
    let originalText = text.value; 

    if (text.value === "") {
      textWarning.innerHTML = "Question Text cannot be empty";
    } else if(handleNewText(originalText) === false){
      textWarning.innerHTML = "Invalid use of hyperlink";
    } else {
      textWarning.innerHTML = "";
    }
    if (tags.value === "") {
      tagWarning.innerHTML = "Must enter a tag";
    } else {
      const tagsArr = tags.value.split(" ");
      if (tagsArr.length > 5) {
        tagWarning.innerHTML = "Cannot enter more than 5 tags";
      } else if (checkTags(tagsArr) === true) {

      } else {
        tagWarning.innerHTML = "";
      }
    }
    // if (username.value === "") {
    //   usernameWarning.innerHTML = "Must enter a username";
    // } else {
    //   usernameWarning.innerHTML = "";
    // }
  
    const bracketRegex = /\[(.*?)\]/g;
    const parenthesisRegex = /\(((https:|http:).*?)\)/g;
    // const regex = /\[(.*?)\]\((((https:|http:).*?)|)\)/gm;
    const regex = /\[(.*?)\]\(((.*?)|)\)/gm;
    const matches = originalText.match(regex);

    if(matches != null) {
      for(let match of matches){
        let linkName = match.match(bracketRegex)[0];
        linkName = linkName.substring(1, linkName.length - 1); // This is name
        let hrefText = match.match(parenthesisRegex);
        // href = href.substring(1, href.length-1);
        if (hrefText == null){
        } else{
          hrefText = hrefText[0];
          hrefText = hrefText.substring(1, hrefText.length-1);
        }
        var hyperlink = `<a href= ${hrefText} target=”_blank”> ${linkName}</a>`;

        originalText = originalText.replace(match, hyperlink);
      }
  
    }

   


    if (titleWarning.innerHTML === "" && textWarning.innerHTML === "" && tagWarning.innerHTML === "") {


      const user_data = await get_user_data(user);
      console.log(user_data.username);
      const username = user_data.username
      const email = user_data.email;
      console.log(email);

      // const username = this.getUsername(user)
      // console.log(username)
      const newQuestion = {title: title.value, text: originalText, tags: tags.value, username: username};
      this.postNewQuestion(newQuestion, email);

    }

  };

  render() {
    return (
      <div className="new-question-page">
        <form action="" id="new-question-form">
          <label htmlFor="" className="label-header">Question Title*</label>
          <br />
          <label htmlFor="" className="label-details">Limit title to 100 characters or less</label>
          <br />
          <input className="text-box" id="question-title" type="text" />
          <br />
          <p id="title-warning" className="red"></p>
          <br />
          <label htmlFor="" className="label-header">Question Text*</label>
          <br />
          <label htmlFor="" className="label-details">Add details</label>
          <br />
          <textarea className="text-box" name="" id="question-text"></textarea>
          <br />
          <p id="text-warning" className="red"></p>
          <br />
          <label htmlFor="" className="label-header">Tags*</label>
          <br />
          <label htmlFor="" className="label-details">Add keywords separated by whitespace</label>
          <br />
          <input className="text-box" id="question-tags" type="text" />
          <br />
          <p id="tag-warning" className="red"></p>
          <br />
          {/* <label htmlFor="" className="label-header">Username*</label>
          <br />
          <input className="text-box" id="username" type="text" />
          <br />
          <p id="user-warning" className="red"></p>
          <br /> */}
          {/* <input  onClick={this.handlePostQuestion} className="post-btn" id="p-btn" type="submit" value="Post Question"></input> */}
          <button onClick={this.handlePostQuestion} className="post-btn" id="p-btn" type="button" value="Post Question">Post Question</button>
          <label className="required-info">* indicates mandatory fields</label>
        </form>
      </div>
    );
  }
}

export default class NewQuestionsPage extends React.Component {
  render() {
    return (
      <div>
        <NewQuestionForm
          model={this.props.model}
          handleQuestionState={this.props.handleQuestionState} />
      </div>
    );
  }
}
