import React from "react";




export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.handleQuestion = this.handleQuestion.bind(this);
        this.handleTags = this.handleTags.bind(this);
        this.state = {
            quesOrTag: true,
        }
    }

    handleQuestion(){
        this.setState({quesOrTag: true});
        this.props.handleQuestionState("Newest");
    }
    
    handleTags(){
        this.setState({quesOrTag: false});
        this.props.handleQuestionState("Tags");
    }

    render() {
        const quesOrTag = this.state.quesOrTag;
        return (
            <div className="nav">
            <ul className="nav-list">
                <li id="question-area" className={quesOrTag ? "gray" : "normal"}>
                    <button className="nav-btns"
                    id="question-buttons" onClick={this.handleQuestion}>Questions</button>
                </li>
                <li id="tag-area" className={quesOrTag ? "normal" : "gray"} >
                    <button className="nav-btns"
                    id="tag-btn" onClick={this.handleTags}>Tags</button>
                </li>
            </ul>
        </div>
        );
    }
}