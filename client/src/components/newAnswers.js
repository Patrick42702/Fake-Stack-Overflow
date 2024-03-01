import React from "react";
const useAnswerData = require('../data/answerData');


function handleNewText(text){
  const bracketRegex = /\[(.*?)\]/g;
  const parenthesisRegex = /\(((https:|http:).*?)\)/g;
  // const regex = /\[(.*?)\]\((((https:|http:).*?)|)\)/gm;
  const regex = /\[(.*?)\]\(((.*?)|)\)/gm;
  const matches = text.match(regex);

  if(matches === null){
    return true;
  }
  // make it so that it returns false if no match

  for(let match of matches){
    let linkName = match.match(bracketRegex)[0];
    linkName = linkName.substring(1, linkName.length - 1); // This is name
    let href = match.match(parenthesisRegex);
    if (href === null){
      return false;
    } else{
      
    }
    
  }
  return true
}




class NewAnswerForm extends React.Component { 
    constructor(props){
        super(props);
        this.handlePostAnswer = this.handlePostAnswer.bind(this);
      }

    postNewAnswer = async (answerData) => {
      try {
        await useAnswerData.postAnswer(this.props.currentQues._id, answerData, document.cookie);
        this.props.handleQuestionState("quesAns");
      } catch (error) {
        console.error("Error retreiving questions data")
        this.setState({ error, loading: false });
      }
    }

    handlePostAnswer() { // Might want to split this up into multiple
        let username = document.getElementById("username");
        let text = document.getElementById("text");

        let usernameWarning = document.getElementById("username-warning");
        let answerWarning = document.getElementById("answer-warning");

        if(username.value === ""){
            usernameWarning.innerHTML = "Need to enter a valid username";
        } else{
            usernameWarning.innerHTML = "";
        }

        let originalText = text.value; 

        if(text.value === ""){
        answerWarning.innerHTML = "Need to enter valid text";
        } else if(handleNewText(originalText) === false){
          answerWarning.innerHTML = "Invalid use of hyperlink";
        }
        else{
        answerWarning.innerHTML = "";
        }

  
        const bracketRegex = /\[(.*?)\]/g;
        const parenthesisRegex = /\(((https:|http:).*?)\)/g;
        // const regex = /\[(.*?)\]\((((https:|http:).*?)|)\)/gm;
        const regex = /\[(.*?)\]\(((.*?)|)\)/gm;
        const matches = originalText.match(regex);

        if(matches !== null) {
          for(let match of matches){
            let linkName = match.match(bracketRegex)[0];
            linkName = linkName.substring(1, linkName.length - 1); // This is name
            let hrefText = match.match(parenthesisRegex);
            // href = href.substring(1, href.length-1);
            if (hrefText === null){
            } else{
              hrefText = hrefText[0];
              hrefText = hrefText.substring(1, hrefText.length-1);
            }
            var hyperlink = `<a href= ${hrefText} target=”_blank”> ${linkName}</a>`;

            originalText = originalText.replace(match, hyperlink);
          }
      
          // originalText = originalText.replace(regex, "replaced"); // put in a tag instead of replaced and do it for each mathch in a for loop
        }

        if(usernameWarning.innerHTML === "" &&  answerWarning.innerHTML === ""){
            // this.props.model.addNewAnswer(this.props.currentQues, username.value, originalText);
            const newAnswer = {name: username.value, text: originalText};

            this.postNewAnswer(newAnswer);
            //// this.props.handleQuesAns(this.props.ques);
          } 

        };

    render() {
      return (
        <div className="answer-page-form">
            <form action="" id="answer-page-form">
                <label className="label-header">Username*</label>
                <br />
                <input type="text" className="username-input text-box" id="username"></input>
                <p id="username-warning" className="red"></p>
                <br />
                <label className="label-header">Answer Text*</label>
                <br />
                <textarea className="text-box answer-text" id="text"></textarea>
                <p id="answer-warning" className="red"></p>
                <br />
                <button className="post-btn" type="button" onClick={this.handlePostAnswer}>Post Answer</button>
                <label className="required-info">* indicated mandatory fields</label>
            </form>
        </div>
      );
    }
  }

export default class NewAnswerPage extends React.Component {
    render() {
            return (
                <div>
                    <NewAnswerForm 
                      model={this.props.model}
                      currentQues={this.props.currentQues}
                      handleQuestionState={this.props.handleQuestionState}
                      handleQuesAns={this.props.handleQuesAns}/>
                </div>
              );  
    }
}
  