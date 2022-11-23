import { Link } from "react-router-dom";
import "../css/PageNotFound.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-regular-svg-icons';

const PageNotFound = () => {
    return (
        <div className="page-not-found-body">
            <div className="row justify-content-center mt-5 pt-5">
                <div className="col-10 text-center page-not-found-message">
                    <FontAwesomeIcon icon={faFrown} className="icon"></FontAwesomeIcon>
                    <h1>Error</h1>
                    <h2>Oops, This page cannot be found</h2>
                    <h5>The page that you are looking for does not exist or an error had occurred.</h5>
                    <br/>
                    <Link to='/' className="btn btn-outline btn-lg rounded-pill home-btn">Go back home</Link>
                </div>
            </div>
        </div>
    );
}
 
export default PageNotFound;