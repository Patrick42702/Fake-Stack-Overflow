// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
let userArgs = process.argv.slice(2);
if (!userArgs){
  throw new Error("You need to provide the admin username and password as username,password");
}

const dotenv = require("dotenv").config;
dotenv();

//assume name password passed as an argument 
//in the format "name,password" for admin
let credentials = userArgs[0].split(',');
let adminName = credentials[0].trim();
let adminPw = credentials[0].trim();


let Tag = require("./models/tags");
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/user');
let Comment = require('./models/comments');

let mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


let tags = [];
let answers = [];
function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

async function nukeDatabase() {
  try{
    await Tag.deleteMany({});
    await Answer.deleteMany({});
    await Question.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});
    console.log("Nuking complete!")
  }
  catch(err){
    console.log("nuking failed")
  }
}

function answerCreate(text, ans_by, ans_date_time, comments, user) {
  answerdetail = {text:text, user:user};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if (comments != false) answerdetail.comments = comments;
  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views, comments, user) {
  console.log(user)
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
    user: user
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;
  if (comments != false ) qstndetail.comments = comments;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

function userCreate(username, password, email, admin, questions, answers, comments){
    userdetail = {
        username: username,
        password: password,
        email: email,
        admin: admin,
    }
    if (answers != false) userdetail.answers = answers;
    if (questions != false) userdetail.questions = questions;
    if (comments != false) userdetail.comments = comments;
    let user = new User(userdetail);
    return user.save();
}

function commentCreate(text, user){
  commentdetail = {
    text: text,
    user: user
  }
  let comment = new Comment(commentdetail);
  return comment.save();
}

const populate = async () => {
    await nukeDatabase(); 
    let u1 = await userCreate("person1", "password", "example@gmail.com", false); //[q1], [a4, a5]
    let u2 = await userCreate("person2", "differentPassword", "differentExample@yahoo.com", false) // [q2], [a1, a2, a3]
    let u3 = await userCreate(`${adminName}`, `${adminPw}`, "admin@gmail.com", true, false, false, false);
    let t1 = await tagCreate('react');
    let t2 = await tagCreate('javascript');
    let t3 = await tagCreate('android-studio');
    let t4 = await tagCreate('shared-preferences');
    let c1 = await commentCreate('This is a good questions, could someone please answer this?', u1)  ;
    let c2 = await commentCreate('Im not sure? maybe try to do something else', u1);
    let c3 = await commentCreate('Mhm but maybe think about doing this some other way?', u3._id)
    let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', 'hamkalo', false,[c1], u1);
    let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', 'azad', false,[], u2);
    let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', 'abaya', false,[], u1);
    let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', 'alia', false,[], u2);
    let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', 'sana', false,[], u1);
    let q1 = await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], 'Joji John', false, false,[], u1);
    let q2 = await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], 'saltyPeter', false, 121, [],u2);
    await User.updateOne({_id: u1._id}, {$push: {comments: [c1, c2]}})
    await Answer.updateOne({_id: a4._id}, {$push: {comments: [c1, c2]}})
    await User.updateOne({_id: u2._id}, {$push: {comments: [c3]}})
    await Question.updateOne({_id: q2._id}, {$push: {comments: [c3]}})
    await User.updateOne({_id: u1._id}, {$push: {questions: [q1], answers: [a1,a3,a5]}})
    await User.updateOne({_id: u2._id}, {$push: {questions: [q2], answers: [a2,a4]}})

    if (db) db.close();
    console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
    });

console.log('processing ...');