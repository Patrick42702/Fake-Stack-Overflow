import React from "react";

export function formatTwoDigits(num) {
  // Convert the number to a string
  let strnum = num.toString();

  // Add a leading zero if the number is less than 10
  if (num < 10) {
    strnum = "0" + strnum;
  }

  return strnum;
}

export function getTime(currDate, questionDate) {
  return Math.floor((currDate.getTime() - questionDate.getTime()) / 1000);
}

export function prompt(timeInSeconds, questionDate) {
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currMonth = MONTHS[questionDate.getMonth()];
  const MINUTE = 60;
  const HOUR = 3600;
  const DAY = 86400;
  const YEAR = 31536000;
  const currHours = formatTwoDigits(questionDate.getHours());
  const currMinutes = formatTwoDigits(questionDate.getMinutes());
  const currentDate = questionDate.getDate();
  const currentYear = questionDate.getFullYear();
  switch (true) {
    case timeInSeconds < MINUTE:
      return `${timeInSeconds} seconds ago`;
    case timeInSeconds < HOUR:
      return `${Math.floor(timeInSeconds / MINUTE)} mins. ago`;
    case timeInSeconds < DAY:
      return `${Math.floor(timeInSeconds / HOUR)} hours ago`;
    case timeInSeconds < YEAR:
      return `${currMonth} ${currentDate} at ${currHours}:${currMinutes}`;
    default:
      return `${currMonth} ${currentDate}, ${currentYear} at ${currHours}:${currMinutes}`;
  }
}

class StatsContainer extends React.Component {
  render() {
    const question = this.props.ques;
    return (
      <div className="stats-container">
        <p>{`${question.views} views`}</p>
        <p>{`${question.answers.length} answers`}</p>
      </div>
    );
  }
}

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.displayQuestionAnswers = this.displayQuestionAnswers.bind(this);
  }

  displayQuestionAnswers() {
    this.props.handleQuesAns(this.props.ques);
    // console.log(this.props.ques);
    this.props.handleQuestionState("quesAns");
  }


  render() {
    const question = this.props.ques;
    return (
      <a href="#0" onClick={this.displayQuestionAnswers} className="title">
        {`${question.title}`}
      </a>
    );
  }
}

class UserTimeCont extends React.Component {
  render() {
    const question = this.props.ques;
    return (
      <div className="user-and-time-container">
        <span id="user" className="red">{`${question.asked_by} `}</span>
        {`asked ${prompt(getTime(new Date(), new Date(question.ask_date_time)), new Date(question.ask_date_time))}`}
      </div>
    );
  }
}

class Tags extends React.Component {

  render() {
    const tags = this.props.tags;
    const finalTags = [];
    tags.forEach(tag => {
      finalTags.push(<p className="tag" key={tag.name}>{`${tag.name}`}</p>)
    });

    return (
      <div className="tag-container">
        {finalTags}
      </div>
    );
  }
}

class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.handleActive = this.handleActive.bind(this);
    this.handleNewest = this.handleNewest.bind(this);
    this.handleUnanswered = this.handleUnanswered.bind(this);
  }

  handleNewest() {
    this.props.handleQuestionState("Newest");
  }

  handleActive() {
    this.props.handleQuestionState("Active");
  }

  handleUnanswered() {
    this.props.handleQuestionState("Unanswered");
  }

  render() {
    return (
      <div className="question-buttons">
        <button onClick={this.handleNewest} id="newest">Newest</button>
        <button onClick={this.handleActive} id="active">Active</button>
        <button onClick={this.handleUnanswered} id="unanswered">Unanswered</button>
      </div>
    );
  }
}

class HeaderTop extends React.Component {

  constructor(props) {
    super(props);
    this.handleNewQuestion = this.handleNewQuestion.bind(this);
  }

  handleNewQuestion() {
    this.props.handleQuestionState("NewQuestion");
  }

  render() {
    // const user = this.props.user;

    let cookie = document.cookie;
    const user = cookie.slice(4)
    // console.log(user);

    if(user === ""){
      return (
        <div className="all-questions">
          <h3 id="all-q-text">All Questions</h3>
        </div>
      );
    } else{
      return (
        <div className="all-questions">
          <h3 id="all-q-text">All Questions</h3>
          <button onClick={this.handleNewQuestion} id="ask-question-btn" className="ask-question-btn">Ask Question</button>
        </div>
      );
    }
  }
}

class HeaderBottom extends React.Component {
  render() {
    const numOfQuestions = this.props.numOfQuestions;
    return (
      <div className="question-types">
        <p>{`${numOfQuestions} Questions`}</p>
        <Buttons
          handleNumQues={this.props.handleNumQues}
          handleQuestionState={this.props.handleQuestionState} />
      </div>
    );
  }
}

export class QuestionHeader extends React.Component {
  render() {
    const model = this.props.model;
    return (
      <div id="q-head" className="question-header">
        <HeaderTop
          handleQuestionState={this.props.handleQuestionState} />
        <HeaderBottom
          model={model}
          contentState={this.props.contentState}
          numOfQuestions={this.props.numOfQuestions}
          handleNumQues={this.props.handleNumQues}
          handleQuestionState={this.props.handleQuestionState} />
      </div>
    );
  }
}

class NextAndPreviousButtons extends React.Component {
  constructor(props) {
    super(props);
    // this.handleActive = this.handleActive.bind(this);
    // this.handleNewest = this.handleNewest.bind(this);
    // this.handleUnanswered = this.handleUnanswered.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
  }


  handleNext() {
    // this.props.handleQuestionState("Newest");
    console.log("Go to next set of Questions")
    this.props.incrementQuestions()
  }

  handlePrevious(){
    console.log("Go to previous set of Questions")
    this.props.decrementQuestions()
  }
 
  render() {
    // if(this.props.start)
    // console.log(this.props.start)
    // console.log(this.props.end)

    const pageNum = this.props.page

    if(this.props.start === 0){
      return (
        <div className="page-numbers">
          <button id="previous">Previous</button>
          <span className="pageNum">Page {pageNum}</span>
          <button onClick={this.handleNext} id="next">Next</button>
        </div>
      );
    } else{

      return (
        <div className="page-numbers">
          <button onClick={this.handlePrevious} id="previous">Previous</button>
          <span className="pageNum">Page {pageNum}</span>
          <button onClick={this.handleNext} id="next">Next</button>
        </div>
      );
    }
   
  }
}

export class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.incrementQuestions = this.incrementQuestions.bind(this);
    this.decrementQuestions = this.decrementQuestions.bind(this);
    this.resetQuestions = this.resetQuestions.bind(this);
    this.state = {
      start: 0,
      end: 5,
      page: 1
    };
  }

  incrementQuestions(){
    this.setState({start: this.state.start + 5, end: this.state.end + 5, page: this.state.page + 1})
    // console.log(this.state)
  }

  decrementQuestions(){
    this.setState({start: this.state.start - 5, end: this.state.end - 5, page: this.state.page - 1})
  }

  resetQuestions(){
    this.setState({start: 0, end: 5, page: 1})
  }

  render() {

    const start = this.state.start
    const page = this.state.page

    const questions = [];
    const modelQs = this.props.modelQs;
    if (modelQs.length === 0) {
      return <h4> No Questions Found</h4>
    }
    modelQs.forEach((question) => {
      // console.log(question);
      questions.push(
        <div key={question._id} className="question">
          <div id="main-question-info">
            <StatsContainer ques={question} />
            <div id="title-and-tags">
              <Title
                ques={question}
                handleQuestionState={this.props.handleQuestionState}
                handleQuesAns={this.props.handleQuesAns} />
              <Tags tags={question.tags} />
            </div>

            <UserTimeCont ques={question} />
          </div>
        </div>
      );
    });
    // console.log(questions.length)
    //only display 5 at a time

    if(start > questions.length){
      this.resetQuestions()
    }

    if(questions.length > 5){
      const firstFive = questions.slice(this.state.start, this.state.end);
      return <div id="question-container">{firstFive}
      <NextAndPreviousButtons
      incrementQuestions = {this.incrementQuestions}
      decrementQuestions = {this.decrementQuestions}
      start = {start}
      page = {page}/>  
      </div>;
      

    } else{
      return <div id="question-container">{questions}</div>;   
    }
   
  }
}
