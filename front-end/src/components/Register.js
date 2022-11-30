import { useContext, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useHistory } from 'react-router';
import '../css/Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEnvelope, faUserCircle, faKey, faCheck } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');

    // Error state
    const [errors, setErrors] = useState(null);

    const { getLoggedIn } = useContext(AuthContext);
    const history = useHistory();

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const registerData = {
                username,
                email,
                password,
                passwordVerify
            }

            await axios.post('http://localhost:5000/auth/', registerData);
            await getLoggedIn();
            history.push('/');
        } catch(error) {
            setErrors(error.response.data.errors);
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
            <div className="row mx-0 mt-5 justify-content-center">
                <div className="card pt-4 pb-3 register-card text-center">
                    <br/>
                    <div className="row">
                        <div className="col text-center">
                            <h1 className="register-card-heading">Register a new account</h1>
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
                                                <FontAwesomeIcon icon={faUserCircle} className="input-field-icon"></FontAwesomeIcon>
                                            </div>
                                        </div>
                                        <input type="text" 
                                            placeholder="Username" 
                                            required 
                                            className="form-control addon" 
                                            value={ username }
                                            onChange = { (e) => setUsername(e.target.value) }
                                        />
                                    </div>
                                    <li className= "details-info text-left pl-3 pt-2">Must be at least 5 characters long</li>
                                </div>
                                <div className="form-group pb-2">
                                    <div className="input-group addon">
                                        <div className="input-group-prepend addon">
                                            <div className="input-group-text addon">
                                                <FontAwesomeIcon icon={faEnvelope} className="input-field-icon"></FontAwesomeIcon>
                                            </div>
                                        </div>
                                        <input type="email" 
                                            placeholder="Email" 
                                            required 
                                            className="form-control addon" 
                                            value={ email }
                                            onChange = { (e) => setEmail(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="form-group pb-2">
                                    <div className="input-group addon">
                                        <div className="input-group-prepend addon">
                                            <div className="input-group-text addon">
                                                <FontAwesomeIcon icon={faKey} className="input-field-icon"></FontAwesomeIcon>
                                            </div>
                                        </div>
                                        <input type="password" 
                                            placeholder="Password" 
                                            required 
                                            className="form-control addon"
                                            value = { password }
                                            onChange = { (e) => setPassword(e.target.value) }
                                        />
                                    </div>
                                    <li className="details-info text-left pl-3 pt-2">Must be at least 8 characters long</li>
                                    <li className="details-info text-left pl-3 pt-2">Must contain at least one number</li>
                                    <li className="details-info text-left pl-3 pt-2">Must contain at least one lowercase letter</li>
                                    <li className="details-info text-left pl-3 pt-2">Must contain at least one uppercase letter</li>
                                    <li className="details-info text-left pl-3 pt-2">Must contain at least one special symbol</li>
                                </div>
                                <div className="form-group mb-4">
                                    <div className="input-group addon">
                                        <div className="input-group-prepend addon">
                                            <div className="input-group-text addon">
                                                <FontAwesomeIcon icon={faCheck} className="input-field-icon"></FontAwesomeIcon>
                                            </div>
                                        </div>
                                        <input type="password" 
                                            placeholder="Confirm password" 
                                            required 
                                            className="form-control addon"
                                            value = { passwordVerify }
                                            onChange = { (e) => setPasswordVerify(e.target.value) }
                                        />
                                    </div>
                                    <li className="details-info text-left pl-3 pt-2">Must match above password</li>
                                </div>
                                <div className="form-group mt-4">
                                    <input type="submit" value="Register" className="btn btn-primary rounded-pill submit-btn" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Register;