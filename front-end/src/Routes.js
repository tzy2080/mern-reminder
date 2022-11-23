import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import CreateReminder from './components/CreateReminder';
import EditReminder from './components/EditReminder';
import ReminderList from './components/ReminderList';
import AuthContext from './context/AuthContext';
const Routes = () => {
    const { loggedIn } = useContext(AuthContext);

    return (  
        <Router>
            <Switch>
                <Route path="/" exact component={ Home } />
                {loggedIn === true && <Route path="/edit/:id" exact component={ EditReminder } />}

                {loggedIn === true && <Route path="/create" exact component={ CreateReminder } />}
                
                {loggedIn === true && <Route path="/reminders" exact component={ ReminderList } />}

                {loggedIn === false && <Route path="/register" exact component={ Register } />}

                {loggedIn === false && <Route path="/login" exact component={ Login } />}

                {loggedIn === false && <Route path="/forgotpassword" exact component={ ForgotPassword } />}

                {loggedIn === false && <Route path="/passwordreset/:resetToken" exact component={ ResetPassword } />}
            
                <Route path="*" component={ PageNotFound } />
            </Switch>
        </Router>
    );
}
 
export default Routes;