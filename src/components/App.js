import './App.css';
import { Route, Switch } from 'react-router-dom'
import SignIn from "./auth/SignIn"
import Courses from "./courses/general/Courses"
import NewCourse from "./courses/new/NewCourse"

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path="/" component={SignIn} />
                <Route path="/courses/new" component={NewCourse} />
                <Route path="/courses" component={Courses} />
            </Switch>
        </div>
    );
}

export default App;
