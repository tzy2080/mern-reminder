import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
import '../css/ResetPassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faCheck } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

const ForgotPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');

    // Error state
    const [errors, setErrors] = useState(null);

    const history = useHistory();

    // Params
    const { resetToken } = useParams();

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const resetData = {
                password,
                passwordVerify
            };

            await axios.put('http://localhost:5000/auth/resetpassword/' + resetToken, resetData);
            history.push('/login');
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
                <div className="card pt-4 pb-3 reset-card text-center">
                    <br/>
                    <div className="row">
                        <div className="col text-center">
                            <h1 className="reset-card-heading">Reset your password</h1>
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
                                                <FontAwesomeIcon icon={faKey} className="input-field-icon"></FontAwesomeIcon>
                                            </div>
                                        </div>
                                        <input type="password" 
                                            placeholder="New password" 
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
                                            placeholder="Confirm new password" 
                                            required 
                                            className="form-control addon"
                                            value = { passwordVerify }
                                            onChange = { (e) => setPasswordVerify(e.target.value) }
                                        />
                                    </div>
                                    <li className="details-info text-left pl-3 pt-2">Must match above password</li>
                                </div>
                                <div className="form-group mt-4">
                                    <input type="submit" value="Reset Password" className="btn btn-primary rounded-pill submit-btn" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;