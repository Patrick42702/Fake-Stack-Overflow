import { parseCookie } from "../data/user";
import { upvote, downvote } from "../data/vote";

const { useState, useEffect, useRef } = require("react")


export function Votebtns(props){
    const [upvotes, setUpvotes] = useState(props.upvotes);
    const [downvotes, setDownvotes] = useState(props.downvotes);
    const [isUpvoted, setIsupvoted] = useState(false)
    const [isDownvoted, setIsdownvoted] = useState(false)
    const upvoteWarning = useRef(null);
    const downvoteWarning = useRef(null);


    useEffect(() => {
        const upvoted = async() =>{
            try {
                let post_info = {
                    post_type: props.post_type,
                    post_id: props.post_id,
                    user: props.user
                }
                const res = await upvote(post_info, parseCookie(document.cookie));
                console.log(res)
                const textwarning = upvoteWarning.current;
                if (res === "Not enough reputation to vote!"){
                    textwarning.textContent = "Not enough reputation to vote!"
                }
                else if(res === "same user"){
                    textwarning.textContent = "You cannot vote on your own posts!"
                }
                else{
                    setUpvotes(upvotes+1);
                    textwarning.textContent = ""
                }
            }
            catch(err){
                console.log("Error in upvoting question");
            }
        }
        const downvoted = async() =>{
            try {
                console.log(props)
                let post_info = {
                    post_type: props.post_type,
                    post_id: props.post_id,
                    user: props.user
                }
                const res = await downvote(post_info, parseCookie(document.cookie));
                console.log(res)
                const textwarning = downvoteWarning.current;
                if (res === "Not enough reputation to vote!"){
                    textwarning.textContent = "Not enough reputation to vote!"
                }
                else if(res === "same user"){
                    textwarning.textContent = "You cannot vote on your own posts!"
                }
                else{
                    setDownvotes(downvotes+1);
                    textwarning.textContent = ""
                }
            }
            catch(err){
                console.log("Error in upvoting question");
            }
        }
        if (isUpvoted){
            upvoted();
            setIsupvoted(false);
        }
        if (isDownvoted){
            downvoted();
            setIsdownvoted();
        }
    }, [isUpvoted, isDownvoted])

    function handleUpvote(){
        setIsupvoted(true);
    }

    function handleDownvote(){
        setIsdownvoted(true);
    }

    return (
    <div id="vote-btn-containers">
        <button id="upvote" className="vote" onClick={handleUpvote}>Upvote</button>
        <div id="upvotes">{upvotes}</div>
        <p ref={upvoteWarning} id="upvote-rep-warning" className="red"></p>
        <button id="downvote" className="vote" onClick={handleDownvote}>Downvote</button>
        <div id="downvotes">{downvotes}</div>
        <p ref={downvoteWarning}id="downvote-rep-warning" className="red"></p>
    </div>)
}