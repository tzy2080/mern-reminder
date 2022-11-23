import '../css/Login.css';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Error state
    const [errors, setErrors] = useState(null);

    const { getLoggedIn } = useContext(AuthContext);
    const history = useHistory();

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const loginData = {
                email,
                password
            };

            await axios.post('http://localhost:5000/auth/login', loginData);
            getLoggedIn();
            history.push('/');
        } catch(error) {
            setErrors(error.response.data.errors);
            console.error(error);
        }
    };

    const Alert = props => (
        <div>
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                { props.error.msg }
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    );

    function errorList(){
        return errors.map(currentError => {
            return <Alert error={ currentError } key={ currentError.param}/>;
        });
    }

    return (
        <div className="page-body py-5"> 
            <Navbar />              
            <div className="row mx-0 mt-5 pt-5 justify-content-center">
                <div className="card mx-3 pt-4 pb-3 login-card text-center">
                    <br/>
                    <div className="row">
                        <div className="col text-center">
                            <h1 className="login-card-heading">Login</h1>
                            <hr className="divider mt-3 mb-5"></hr>
                        </div> 
                    </div>
                    <div className="mx-4">
                    {  errors && errorList() }
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-9 px-0">
                            <form onSubmit = { onSubmit }>
                                <div className="form-group pb-2">
                                    <div className="input-group addon">
                                        <div className="input-group-prepend addon">
                                            <div className="input-group-text addon">
                                                <FontAwesomeIcon icon={faEnvelope} className="input-field-icon"></FontAwesomeIcon>
                                            </div>
                                        </div>
                                        <input type="email" 
                                            placeholder="Type your email" 
                                            required 
                                            className="form-control addon" 
                                            value={ email }
                                            onChange = { (e) => setEmail(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group addon">
                                        <div className="input-group-prepend addon">
                                            <div className="input-group-text addon">
                                                <FontAwesomeIcon icon={faKey} className="input-field-icon"></FontAwesomeIcon>
                                            </div>
                                        </div>
                                        <input type="password" 
                                            placeholder="Type your password" 
                                            required 
                                            className="form-control addon"
                                            value = { password }
                                            onChange = { (e) => setPassword(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="help-text mt-4">
                                    <p className="mb-2">Do not have an account yet? <Link className="help-link" to="/register">Register</Link></p>
                                </div>
                                <div className="help-text">
                                    <Link className="help-link" to="/forgotpassword">Forgot password?</Link>
                                </div>
                                <div className="form-group mt-4">
                                    <input type="submit" value="Login" className="btn btn-primary rounded-pill submit-btn"/>
                                </div>
                            </form>
                        </div>
                    </div>
                    <br/>
                </div>
            </div>
        </div>
    );
}
 
export default Login;