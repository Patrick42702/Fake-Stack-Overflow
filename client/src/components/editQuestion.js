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



class EditQuestionForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleUpdateQuestion = this.handleUpdateQuestion.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this)
    // const question = props.currentQues;
    this.state = {
        title: "",
        text: "",
        tags: "",
      };
  }

  postNewQuestion = async (questionData, email) => {
    try {
      await useQuestionData.postQuestion(questionData, email);
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

  handleUpdateQuestion = async() => {
    

    // const question = this.props.currentQues;
    // console.log(question.title)

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
      const question = this.props.currentQues;
      // console.log("test")
      // console.log(question);
    //   const que = {id: question._id};
      const updatedQuestion = {title: title.value, text: originalText, tags: tags.value, username: username, id: question._id};
      
      console.log(updatedQuestion)
    //   this.postNewQuestion(newQuestion, email);
    await useQuestionData.updateQuestion(updatedQuestion, document.cookie)
    this.props.handleQuestionState("Profile");

    }

  };

  handleDeleteQuestion = async() => {

    let cookie = document.cookie;
    const user = cookie.slice(4)

    const user_data = await get_user_data(user);
    // console.log(user_data.username);
    const username = user_data.username
    const email = user_data.email;
    // console.log(email);

    const question = this.props.currentQues;
    const id = question._id;

    const deleteInfo = {email: email, id: id};

    // await to backend
    await useQuestionData.deleteQuestion(deleteInfo, document.cookie);
    this.props.handleQuestionState("Profile");



  }

  handleTest = async() => {
    const question = this.props.currentQues;
    // console.log("test")
    // console.log(question);
    const que = {id: question._id};
    const result = await useQuestionData.populateQuestion(que, document.cookie);
    const title = result.title;
    const text = result.text;

    const tags = result.tags;
    let tagText = ""
    tags.forEach((tag) => {
        console.log(tag.name)
        tagText = tagText + " " + tag.name
    })
    tagText = tagText.slice(1)

    // console.log(tagText);
    // console.log(result);
    // console.log("Title: ", title)
    // console.log("Test: ", text)
    // console.log(tags);

  }

//   handleInputChange = (event) => {
//     this.setState({
//         title: title,
//         text: text,
//         tags: tagText,
//       });
//   };

  handleTitleChange = (event) => {
    this.setState({
        title: event.target.value
    })
  }

  handleTextChange = (event) => {
    this.setState({
        text: event.target.value
    })
  }

  handleTagChange = (event) => {
    this.setState({
        tags: event.target.value
    })
  }

  async componentDidMount() {
    try {
        const question = this.props.currentQues;
        // console.log("test")
        // console.log(question);
        const que = {id: question._id};
        const result = await useQuestionData.populateQuestion(que, document.cookie);
        const title = result.title;
        const text = result.text;
    
        const tags = result.tags;
        let tagText = ""
        tags.forEach((tag) => {
            console.log(tag.name)
            tagText = tagText + " " + tag.name
        })
        tagText = tagText.slice(1)
    
      this.setState({
        title: title,
        text: text,
        tags: tagText,
      });

    } catch (error) {
      this.setState({
        error,
        loading: false,
      });
    }
  }

  render() {
    const { title, text, tags } = this.state;

    return (
      <div className="new-question-page">
        <form action="" id="new-question-form">
          <label htmlFor="" className="label-header">Question Title*</label>
          <br />
          <label htmlFor="" className="label-details">Limit title to 100 characters or less</label>
          <br />
          <input className="text-box" id="question-title" type="text" value={title} onChange={this.handleTitleChange} />
          <br />
          <p id="title-warning" className="red"></p>
          <br />
          <label htmlFor="" className="label-header">Question Text*</label>
          <br />
          <label htmlFor="" className="label-details">Add details</label>
          <br />
          <textarea className="text-box" name="" id="question-text" value={text}  onChange={this.handleTextChange}></textarea>
          <br />
          <p id="text-warning" className="red"></p>
          <br />
          <label htmlFor="" className="label-header">Tags*</label>
          <br />
          <label htmlFor="" className="label-details">Add keywords separated by whitespace</label>
          <br />
          <input className="text-box" id="question-tags" type="text" value={tags}  onChange={this.handleTagChange} />
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
          <button onClick={this.handleUpdateQuestion} className="post-btn" id="p-btn" type="button" value="Post Question">Update Question</button>
          <button onClick={this.handleDeleteQuestion} className="post-btn" id="p-btn" type="button" value="Post Question">Delete Question</button>
          <label className="required-info">* indicates mandatory fields</label>
        </form>
      </div>
    );
  }
}

export default class EditQuestionsPage extends React.Component {
  render() {
    return (
      <div>
        <EditQuestionForm
          model={this.props.model}
          handleQuestionState={this.props.handleQuestionState} 
          currentQues={this.props.currentQues}/>
      </div>
    );
  }
}
