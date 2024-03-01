import React from "react";
const tagData = require("../data/tagData");


class TagHeader extends React.Component {

    constructor(props){
        super(props);
        this.handleNewQuestion =  this.handleNewQuestion.bind(this);
      }
    
      handleNewQuestion() {
        this.props.handleQuestionState("NewQuestion")
      }


    render() {
        const tagNum = this.props.tags.length;

        let cookie = document.cookie;
        const user = cookie.slice(4)

        if(user == ""){
          return (
            <div>
                <h3 className="tag-header">{`${tagNum}`} Tags</h3>
                <h3 className="tag-header">All Tags</h3>
            </div>
          );
        } else{
          return (
            <div>
                <h3 className="tag-header">{`${tagNum}`} Tags</h3>
                <h3 className="tag-header">All Tags</h3>
                <button className="tag-ask-q-btn" id="ask-question-btn" onClick={this.handleNewQuestion}>Ask Question</button>
            </div>
          );
        }     
    }
  }

  class QuestionNumber extends React.Component {
    render() {
      const questionNumber = this.props.questionNum;
      if(questionNumber === 1){
        return ( <p>{`${questionNumber}`} Question</p>);
     } else{
        return ( <p>{`${questionNumber}`} Questions</p>);
     } 
    }
  }

  class Tags extends React.Component {

    constructor(props){
        super(props);
        this.handleTag = this.handleTag.bind(this);
        this.state = {
          numOfQuestions: [],
          loading: true
        }
      }
    
      handleTag(e) {
        this.props.handleQuestionState("Search");
        this.props.handleStrChange(`[${e.target.textContent}]`);
      }

      componentDidMount(){
        this.getNumOfQuestions(this.props.tags);
      }

      getNumOfQuestions = async(tags) => {
        const numOfQuestionsArr = [];
        try{
          await Promise.all(tags.map(async (tag) => {
            const numOfQuestions = await tagData.getNumOfQuestions(tag._id);
            numOfQuestionsArr.push(numOfQuestions);
          }));
          this.setState({numOfQuestions: numOfQuestionsArr, loading: false});
        }
        catch(error){
          console.error("error receiving num of questions from tagData");
        }
      }
      

    render() {
      const tags = this.props.tags;
      const {numOfQuestions, loading} = this.state;
      if (loading){
        return (<p>loading</p>)
      }
      let tagsArr = [] ;
      tags.forEach((tag, index) => {
          let numberOfQuestions = numOfQuestions[index];
          tagsArr.push(
              <div key={tag.name} className="tag-block">
                  <a href="#0" className="tag-name" onClick={this.handleTag}>{`${tag.name}`}</a>
                  <QuestionNumber questionNum={numberOfQuestions} />
              </div>
          )
      });
     return(
        <div id="tags-container">{tagsArr}</div>
     );
    }
  }

export class TagsPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tags: null,
      loading: true
    }
  }

  componentDidMount(){
    this.fetchTags();
  }

  fetchTags = async() => {
    try{
      const tags = await tagData.getTags();
      console.log(tags);
      this.setState({tags: tags, loading: false});
    }
    catch (error) {
      console.error("error receiving tags from tagData");
      this.setState({loading: true})
    }
  }

  render() {
    const {tags, loading} = this.state;
    if (loading){
      return (<p>loading</p>);
    }
    return (
        <div id="tag-page">
            <TagHeader 
            tags={tags}
            handleQuestionState={this.props.handleQuestionState}/>
            <Tags 
            tags = {tags}
            handleQuestionState={this.props.handleQuestionState}
            handleStrChange={this.props.handleStrChange}/>
        </div>
      );
  }
}