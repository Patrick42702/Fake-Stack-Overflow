import React, { useEffect, useState } from 'react';

const {new_comment} = require("../data/commentData")
const {get_reputation} = require("../data/user")

function NewCommentForm(props) {
    const [rep, setRep] = useState(null);

    useEffect(() => {
        const fetchRep = async() => {
            try {
                const rep = await get_reputation(document.cookie)
                setRep(rep)
            }
            catch(err){
                console.log("error receiving reputation from backend")
            }
        };
        fetchRep();
    },)

    const postNewComment = async (commentData, token) => {
        try{
            commentData.post_type = props.post_type
            commentData.post_id = props.post_id;
            await new_comment(commentData, token);
            props.handleQuestionState("quesAns");
        }
        catch(err) {
            console.log("Error calling for posting commentData")
        }
    }

    const handlePostComment = () => {
        let text = document.getElementById('comment-text');
        let text_warning = document.getElementById('text-warning');
        console.log(rep)
        if(rep < 50){
            text_warning.innerHTML = "You don't have enough reputation!"
        }
        else if (text.value.length > 140){
            text_warning.innerHTML = "Text too long"
        }
        else if( text.value.length === 0){
            text_warning.innerHTML = "You must enter text"
        }
        else{
            text_warning.innerHTML = ""
        }
        if (text_warning.innerHTML === ""){
            const newComment = {text: text.value}
            const token = document.cookie.split('=')[1];
            postNewComment(newComment, token)
        }
    }

    return (
        <div id="new-comment-page">
            <form action="" id="new-comment-form">
                <label htmlFor="" className="label-header">Text*</label>
                <br />
                <label htmlFor="" className="label-details">Limit title to 140 characters or less</label>
                <br />
                <input className="text-box" id="comment-text" type="text" />
                <br />
                <p id="text-warning" className="red"></p>
                <br />
                <button onClick={handlePostComment} className="post=btn" id="post-comment-btn">Post Comment</button>
                <label className="required-info">* indicates mandatory fields</label>
            </form>
        </div>
    )
}

export function NewCommentPage(props){
    return (
        <div id="new-comment-page">
            <NewCommentForm
            handleQuestionState={props.handleQuestionState}
            post_type={props.post_type}
            post_id={props.post_id}
            />
        </div>  
    )
}