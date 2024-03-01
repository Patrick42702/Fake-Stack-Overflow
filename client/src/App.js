// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout.js";
import NoPage from "./components/noPage.js";
import WelcomePage from './components/welcome.js';
import SignUpPage from './components/signUp.js';
import LogInPage from './components/login.js';

function App() {
  // const [user, setUser] = useState("Guest");

  // const initializeUser = (user) => {
  //   setUser(user);
// }


  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="login" element={<LogInPage />} />
          { <Route path="home" element={<FakeStackOverflow/>} /> }
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    // <section className="fakeso">
    //   {/* <FakeStackOverflow /> */}
    // </section>
  );
}

export default App;
