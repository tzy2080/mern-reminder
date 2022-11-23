import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../css/ForgotPassword.css';
import Navbar from './Navbar';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    // Error state
    const [errors, setErrors] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const forgotData = {
                email
            };

            await axios.post('http://localhost:5000/auth/forgotpassword', forgotData);
            setIsSent(true);
            setErrors(null);
            setEmail('');
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
                <div className="card mx-3 pt-4 pb-3 forgot-card text-center">
                    <br/>
                    <div className="row">
                        <div className="col text-center">
                            <h1 className="forgot-card-heading">Forgot account password</h1>
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
                                            placeholder="Enter email" 
                                            required 
                                            className="form-control addon"
                                            value = { email }
                                            onChange = { (e) => setEmail(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <p className="mb-4 mt-2 help-text"><FontAwesomeIcon icon={faExclamationCircle}/> We will send you a reset link to your account email</p>
                                <div className="form-group text-center">
                                    <input type="submit" value="Send reset link" className="btn btn-primary rounded-pill submit-btn" />
                                </div>
                                { isSent && (
                                    <div className="alert alert-success" role="alert">
                                        Reset link has been sent. Please check your email inbox!
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;