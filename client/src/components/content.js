import React from 'react';
import { HeaderTop, HeaderBottom, Answers } from "./answerPage";
import { Questions, QuestionHeader } from "./questions"
import { TagsPage } from "./tags"
import { NewCommentPage } from './newComment';
import NewQuestionsPage from './newQuestion';
import NewAnswerPage from './newAnswers';
import ProfilePage from './profilePage';
import EditQuestionsPage from './editQuestion';
const useQuestionData = require('../data/questionData');

export default class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfQuestions: undefined,
            currentQues: undefined,
            currPostType: undefined,
            currPostId: undefined,
            data: null,
        }
        this.handleNumQues = this.handleNumQues.bind(this);
        this.handleQuesAns = this.handleQuesAns.bind(this);
        this.handleCommentType = this.handleCommentType.bind(this);
    }

    handleQuesAns(e) {
        this.setState({ currentQues: e });
        // console.log(e)
    }

    handleNumQues() {
        const length = 1;
        this.setState({numOfQuestions: length}, () => {});
    }

    handleCommentType(post_type, id) {
        this.setState({ currPostType:post_type, currPostId: id})
    }

    componentDidMount(){
        this.fetchQuestionOrder();
    }

    componentDidUpdate(previousProps){
        const quesState = ["Newest", "Active", "Unanswered", "Search"];
        if (!quesState.includes(this.props.contentState)){
        }
        else if (previousProps.contentState === "Search" && this.props.contentState === "Search"){
            this.fetchQuestionOrder();
        }
        else if(this.props.contentState !== previousProps.contentState){
            this.fetchQuestionOrder();
        }
    }

    fetchQuestionOrder = async () => {
        try {
          // Assuming you have an asynchronous function to fetch data from the database
          const result = await useQuestionData.getQuestions(this.props.contentState, this.props.searchstring);
          this.setState({numOfQuestions:result.length, data: result });
        } catch (error) {
            console.error("Error retreiving questions data")
        }
      };
   

    render() {
        const contentState = this.props.contentState;
        const quesState = ["Newest", "Active", "Unanswered", "Search"];
        const quesAns = "quesAns";
        const newQues = "NewQuestion";
        const newAns = "NewAnswer";
        const tags = "Tags";
        const profile = "Profile"
        const newComment = "NewComment";
        const editQuestion = "EditQuestion"
        const {numOfQuestions, data } = this.state;
        const user = this.props.user;

        if (!data){
            return (<div></div>)
        }
        // const question = this.props.currentQues;
        // console.log(question);
        return (
            <div id="content" className='content'>
                {(quesState.includes(contentState)) &&
                    <QuestionHeader
                        contentState={this.props.contentState}
                        numOfQuestions={numOfQuestions}
                        handleNumQues={this.handleNumQues}
                        handleQuestionState={this.props.handleQuestionState}/>}
                {(quesState.includes(contentState)) &&
                    <Questions
                        handleQuestionState={this.props.handleQuestionState}
                        contentState={this.props.contentState}
                        modelQs={data}
                        handleQuesAns={this.handleQuesAns}
                        searchstring={this.props.searchstring} />}
                {(contentState === quesAns) && <div id='ques-ans-header'>
                    {(contentState === quesAns) &&
                        <HeaderTop
                            handleQuestionState={this.props.handleQuestionState}
                            currentQues={this.state.currentQues} />}
                    {(contentState === quesAns) &&
                        <HeaderBottom
                            handleQuestionState={this.props.handleQuestionState}
                            currentQues={this.state.currentQues}
                            handleCommentType={this.handleCommentType}/>}
                </div>}
                 {(contentState === quesAns) &&
                    <Answers
                        currentQues={this.state.currentQues}
                        handleQuestionState={this.props.handleQuestionState}
                        handleCommentType={this.handleCommentType}
                        user={user}/>}
                {(contentState === tags) &&
                    <TagsPage
                    contentState={this.props.contentState}
                    handleQuestionState={this.props.handleQuestionState}
                    handleStrChange={this.props.handleStrChange} />}
                {(contentState === newQues) &&
                    <NewQuestionsPage
                    contentState={this.props.contentState}
                    handleQuestionState={this.props.handleQuestionState} />}
                 {(contentState === newAns) &&
                    <NewAnswerPage
                    currentQues={this.state.currentQues}
                    contentState={this.props.contentState}
                    handleQuestionState={this.props.handleQuestionState} 
                    handleQuesAns={this.props.handleQuesAns}/>}
                 {(contentState === profile) &&
                //    <h1>Profile</h1>
                   // Add profile page component here
                   <ProfilePage 
                   handleQuestionState={this.props.handleQuestionState}
                   handleQuesAns={this.handleQuesAns}/>
                   }
                {(contentState === newComment) && 
                <NewCommentPage handleQuestionState={this.props.handleQuestionState}
                post_type={this.state.currPostType}
                post_id={this.state.currPostId}/>}
                 {(contentState === editQuestion) && 
                //  <h1>Edit Question State</h1>
                <EditQuestionsPage 
                currentQues={this.state.currentQues}
                contentState={this.props.contentState}
                handleQuestionState={this.props.handleQuestionState}/>
               }
            </div>
        );
    }
}