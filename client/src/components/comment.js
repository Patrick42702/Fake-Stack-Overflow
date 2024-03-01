const { useState, useEffect } = require("react")
const { get_comments } = require("../data/commentData");
const { upvote } = require("../data/vote")
const {parseCookie} = require("../data/user");  

function NextAndPreviousButtons(props) {
    function handleNext() {
        // this.props.handleQuestionState("Newest");
        props.incrementComments()
    }

    function handlePrevious() {
        props.decrementComments()
    }

    const pageNum = props.page;
    if (props.start === 0) {
        return (
            <div className="page-numbers">
                <button id="previous">Previous</button>
                <span className="pageNum">Page {pageNum}</span>
                <button onClick={handleNext} id="next">Next</button>
            </div>
        );
    } else {

        return (
            <div className="page-numbers">
                <button onClick={handlePrevious} id="previous">Previous</button>
                <span className="pageNum">Page {pageNum}</span>
                <button onClick={handleNext} id="next">Next</button>
            </div>
        );
    }
}

function Comment(props) {
    let text = props.text
    let user = props.user
    const [upvotes, setUpvotes] = useState(props.upvotes);
    const [upvoted, setUpvoted] = useState(false);
    useEffect(() => {
        const com_upvote = async () => {
            try{
                console.log("increase upvotes called")
                let post_info = {
                    post_type: "comment",
                    post_id: props._id,
                    user: props.user._id,
                }
                await upvote(post_info, parseCookie(document.cookie));
            }
            catch(err){
                console.log("Error trying to upvote comment")
            }
        }
        if (upvoted){
            com_upvote();
            setUpvoted(false);
        }
    }, [upvoted])

    function handleUpvote() {
        setUpvotes(upvotes + 1);
        setUpvoted(true)
    }

    let cookie = document.cookie;
    const user_cookie = cookie.slice(4);

    if(user_cookie === ""){
        return (
            <div id="comment">
                <div id="comment-text">{text}</div>
                <div id="comment-info">
                    <div id="comment-user">{user.username}</div>
                    <div id="comment-upvotes">{upvotes}</div>
                </div>
            </div>)
    } else{
        return (
            <div id="comment">
                <div id="comment-text">{text}</div>
                <div id="comment-info">
                    <div id="comment-user">{user.username}</div>
                    <div id="comment-upvotes">{upvotes}</div>
                    <button onClick={handleUpvote}>Upvote</button>
                </div>
            </div>)
    }

    
    //let upvotes = props.upvotes
   
}

export function Comments(props) {
    const post_id = props.post_id;
    const post_type = props.post_type;
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(3);
    const [page, setPage] = useState(1);
    const [comments, setComments] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const comments = await get_comments(post_type, post_id);
                setComments(comments);
            }
            catch (error) {
                console.error("error fetching data: ", error);
            }
        }
        fetchComments();
    }, [post_type, post_id]);

    const incrementComments = () => {
        setStart(start + 3);
        setEnd(end + 3);
        setPage(page + 1);
    }

    const decrementComments = () => {
        setStart(start - 3);
        setEnd(end - 3);
        setPage(page - 1);
    }

    const resetComments = () => {
        setStart(0);
        setEnd(3);
        setPage(1);
    }

    if (!comments) {
        return (<div></div>)
    }

    const formatted_comments = [];
    if (comments) {
        comments.forEach(comment => {
            const id = comment._id;
            const text = comment.text;
            const user = comment.user;
            const upvotes = comment.upvotes;
            formatted_comments.push(
                <Comment 
                key={id}
                _id={id}
                text={text}
                user={user}
                upvotes={upvotes}
                post_type={post_type}
                post_id={post_id}/>
            );
        });
    }

    if (start > formatted_comments.length) {
        resetComments();
    }

    if (formatted_comments.length > 3) {
        const firstFive = formatted_comments.slice(start, end);
        return (
            <div id='comments'>
                <p>Comments:</p>
                {firstFive}
                <NextAndPreviousButtons
                    incrementComments={incrementComments}
                    decrementComments={decrementComments}
                    start={start}
                    page={page} />

            </div>
        );
    }
    else {
        return (
            <div id="comments">
                <p>Comments:</p>
                {formatted_comments}
            </div>
        );
    }
}