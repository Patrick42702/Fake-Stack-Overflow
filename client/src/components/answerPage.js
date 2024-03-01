import { prompt, getTime } from './questions';
import React, { useState, useEffect, useRef } from 'react'
import { Comments } from "./comment"
import { Votebtns } from "./votebtns"
const getAnswers = require('../data/answerData');


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
        this.props.incrementAnswers()
    }

    handlePrevious() {
        this.props.decrementAnswers()
    }

    render() {
        // if(this.props.start)
        // console.log(this.props.start)
        // console.log(this.props.end)

        const pageNum = this.props.page

        if (this.props.start === 0) {
            return (
                <div className="page-numbers">
                    <button id="previous">Previous</button>
                    <span className="pageNum">Page {pageNum}</span>
                    <button onClick={this.handleNext} id="next">Next</button>
                </div>
            );
        } else {

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

function AnswerQuestionButton(props) {
    // const user = props.user;

    let cookie = document.cookie;
    const user = cookie.slice(4)

    if (user === "") {
        return (null)
    } else {
        return (
            <button onClick={props.handleAnsBtn}
                className='ans-question-btn post-btn'>Answer Question</button>
        )
    }


}

export function Answers(props) {
    const currQues = props.currentQues;
    // console.log(currQues)
    const [answers, setAnswers] = useState(null);
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(5)
    const [page, setPage] = useState(1)
    const hasMounted = useRef(false);

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                let fetchedAnswers = await getAnswers.getAnswers(currQues._id);
                setAnswers(fetchedAnswers)
                await getAnswers.increaseViews(currQues._id)
                console.log("ran")
                hasMounted.current = true;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (!hasMounted.current) {
            console.log(hasMounted.current)
            fetchAnswers();
            hasMounted.current = true
        }

    }, []);

    const incrementAnswers = () => {
        setStart(start + 5);
        setEnd(end + 5);
        setPage(page + 1);
    }

    const decrementAnswers = () => {
        setStart(start - 5);
        setEnd(end - 5);
        setPage(page - 1);
    }

    const resetAnswers = () => {
        setStart(0);
        setEnd(5);
        setPage(1);
    }

    const handlePostComment = (post_id) => {
        props.handleCommentType("answer", post_id)
        props.handleQuestionState("NewComment");
    }

    const reponsdedAns = [];
    if (answers) {
        answers.forEach(answer => {
            const text = answer.text;
            const user = answer.ans_by;
            const ansDate = answer.ans_date_time;
            const time = prompt(getTime(new Date(), new Date(ansDate)), new Date(ansDate));

            
            let cookie = document.cookie;
            const user_cookie = cookie.slice(4)

            if(user_cookie === ""){
                reponsdedAns.push(
                    <div key={answer._id} className='answer'>
                        <div className='answer-data'>
                            <div className='text' dangerouslySetInnerHTML={{ __html: text }} />
                            <div className='user-and-time'>
                                <p className='green user'>{`${user}`}</p>
                                <p className="time">{`answered ${time}`}</p>
                            </div>
                        </div>
                        {<Comments post_type="answer" post_id={`${answer._id}`} />}
                    </div>
                );
            } else{
                reponsdedAns.push(
                    <div key={answer._id} className='answer'>
                        <div className='answer-data'>
                            <div className='text' dangerouslySetInnerHTML={{ __html: text }} />
                            <div className='user-and-time'>
                                <p className='green user'>{`${user}`}</p>
                                <p className="time">{`answered ${time}`}</p>
                            </div>
                        </div>
                        {<Comments post_type="answer" post_id={`${answer._id}`} />}
                        <button id="post-comment" className='post-btn' onClick={() => handlePostComment(answer._id)}>Post Comment</button>
                        {<Votebtns
                            upvotes={answer.upvotes}
                            downvotes={answer.downvotes}
                            post_type={"answer"}
                            post_id={answer._id}
                            user={answer.user}
                        />}
                    </div>
                );
            }

           
        });
    }

    let handleAnsBtn = () => {
        props.handleQuestionState("NewAnswer");
    }

    if (!answers) {
        return (<div></div>)
    }

    if (start > reponsdedAns.length) {
        resetAnswers();
    }

    if (reponsdedAns.length > 5) {

        const firstFive = reponsdedAns.slice(start, end);
        return (
            <div id='answer-container'>
                {firstFive}
                <NextAndPreviousButtons
                    incrementAnswers={incrementAnswers}
                    decrementAnswers={decrementAnswers}
                    start={start}
                    page={page} />
                <AnswerQuestionButton
                    handleAnsBtn={handleAnsBtn} />
                {/* <button onClick={handleAnsBtn}
                    className='ans-question-btn post-btn'>Answer Question</button> */}
            </div>
        );
    } else {
        return (
            <div id='answer-container'>
                {reponsdedAns}
                <AnswerQuestionButton
                    handleAnsBtn={handleAnsBtn} />
                {/* <button onClick={handleAnsBtn}
                    className='ans-question-btn post-btn'>Answer Question</button> */}
            </div>
        );
    }

}



export function HeaderTop(props) {
    const numOfAnswers = props.currentQues.answers.length;
    const title = props.currentQues.title;

    let cookie = document.cookie;
    const user = cookie.slice(4)

    let handleQuesButton = () => {
        props.handleQuestionState("NewQuestion");
    }

    if (user === "") {
        return (
            <div id="header-top">
                <h3 className="ans-num">{`${numOfAnswers} answers`}</h3>
                <h3 className="q-title">{`${title}`}</h3>
            </div>
        );
    } else {
        return (
            <div id="header-top">
                <h3 className="ans-num">{`${numOfAnswers} answers`}</h3>
                <h3 className="q-title">{`${title}`}</h3>
                <button id="ask-question-btn" onClick={handleQuesButton}
                    className='ask-question-btn'>Ask Question</button>
            </div>
        );
    }
}


export function HeaderBottom(props) {
    const currentQues = props.currentQues;

    const handlePostComment = () => {
        console.log("post comment called")
        props.handleCommentType("question", props.currentQues._id)
        props.handleQuestionState("NewComment")
    }


    const numOfViews = currentQues.views + 1;
    const text = currentQues.text;
    const user = currentQues.asked_by;
    const askDate = currentQues.ask_date_time;
    const time = prompt(getTime(new Date(), new Date(askDate)), new Date(askDate));

    let cookie = document.cookie;
    const user_cookie = cookie.slice(4)

    if(user_cookie === ""){
        return (
            <div id="header-bottom">
                <div id="header-bottom-info">
                    <h3 id="views">{`${numOfViews} views`}</h3>
                    {/* <p id="text">{`${text}`}</p> */}
                    <div dangerouslySetInnerHTML={{ __html: text }} />
                    {/* {textInfo} */}
                    <div id='ques-user-time-cont'>
                        <p className='red' id='ques-user'>{`${user}`}</p>
                        <p id="timeAsked">{`asked ${time}`}</p>
                    </div>
                </div>
                <div id="header-bottom-comments">
                    {<Comments post_type="question" post_id={currentQues._id} />}
                </div>
            </div>
        );
    } else{
        return (
            <div id="header-bottom">
                <div id="header-bottom-info">
                    <h3 id="views">{`${numOfViews} views`}</h3>
                    {/* <p id="text">{`${text}`}</p> */}
                    <div dangerouslySetInnerHTML={{ __html: text }} />
                    {/* {textInfo} */}
                    <div id='ques-user-time-cont'>
                        <p className='red' id='ques-user'>{`${user}`}</p>
                        <p id="timeAsked">{`asked ${time}`}</p>
                    </div>
                </div>
                <div id="header-bottom-comments">
                    {<Comments post_type="question" post_id={currentQues._id} />}
                    <button id="post-comment-question" className="post-btn" onClick={handlePostComment}>Post Comment</button>
                    {<Votebtns
                        upvotes={currentQues.upvotes}
                        downvotes={currentQues.downvotes}
                        post_type={"question"}
                        post_id={currentQues._id}
                        user={currentQues.user._id} />}
                </div>
            </div>
        );
    }

   
}