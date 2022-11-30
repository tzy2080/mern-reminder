import '../css/Home.css';
import sliderimage1 from '../images/home/carousel1.jpg';
import sliderimage2 from '../images/home/carousel2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faCalendarPlus, faEdit, faEnvelope, faCalendarTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

const Home = () => {
    return (
        <div>
            <Navbar />
            <div id="info-slider" className="carousel slide" data-ride="carousel">
                {/* Indicators */}
                <ul className="carousel-indicators">
                    <li data-target="#info-slider" data-slide-to="0" className="active"></li>
                    <li data-target="#info-slider" data-slide-to="1"></li>
                </ul>

                {/*  Carousel */}
                <div className="carousel-inner">
                    <div className="carousel-item active h-100" style={{backgroundImage: `url(${sliderimage1})` }}>
                        <div className="carousel-caption">
                            <h1>Keep on forgetting important tasks?</h1>
                            <p>No worries our handy reminder tool is able to remind you before the task is due</p>
                        </div>
                    </div>
                    <div className="carousel-item h-100" style={{backgroundImage: `url(${sliderimage2})` }}>
                        <div className="carousel-caption">
                            <h1>What are you waiting for?</h1>
                            <p>Sign up and use the reminder tool now</p>
                        </div>
                    </div>
                </div>

                {/* Left and right controls */}
                <a className="carousel-control-prev" href="#info-slider" data-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </a>
                <a className="carousel-control-next" href="#info-slider" data-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </a>
            </div>

            <div className="page-section text-center">
                <div className="container">
                    <h2 className="section-title">FEATURES</h2>
                    <p className="section-title-text pb-5">Features provided by our reminder tool</p>
                    <div className="row mb-5 justify-content-center">
                        <div className="col-10 col-md-4 pb-4">
                            <FontAwesomeIcon icon={faCalendarPlus} className="section-icon-feature"></FontAwesomeIcon>
                            <h1 className="section-text title mt-4">CREATE REMINDER</h1>
                            <p className="section-text paragraph">Allows users to created reminders</p>
                        </div>
                        <div className="col-10 col-md-4 pb-4">
                            <FontAwesomeIcon icon={faCalendarTimes} className="section-icon-feature"></FontAwesomeIcon>
                            <h1 className="section-text title mt-4">DELETE REMINDER</h1>
                            <p className="section-text paragraph">Reminders can be easily deleted in case it is no longer required</p>
                        </div>
                        <div className="col-10 col-md-4 pb-4">
                            <FontAwesomeIcon icon={faEnvelope} className="section-icon-feature"></FontAwesomeIcon>
                            <h1 className="section-text title mt-4">RECEIVE REMINDER</h1>
                            <p className="section-text paragraph">Receive up coming reminders through email</p>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-10 col-md-4">
                            <FontAwesomeIcon icon={faEdit} className="section-icon-feature"></FontAwesomeIcon>
                            <h1 className="section-text title mt-4">EDIT REMINDER</h1>
                            <p className="section-text paragraph">Reminders that were created can always be edited</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-section text-center">
                <div className="container">
                    <h2 className="section-title">HOW TO USE</h2>
                    <p className="section-title-text pb-5">3 simple steps to use our simple reminder tool</p>
                    <div className="row mb-5 justify-content-center">
                        <div className="col-10 col-md-4 pb-4">
                            <FontAwesomeIcon icon={faCalendarPlus} className="section-icon-use"></FontAwesomeIcon>
                            <h1 className="section-text title mt-4">1) CREATE REMINDER</h1>
                            <p className="section-text paragraph">Click at the 'Create reminder' link at the navigation bar after logging in</p>
                        </div>
                        <div className="col-10 col-md-4 pb-4">
                            <FontAwesomeIcon icon={faClipboardList} className="section-icon-use"></FontAwesomeIcon>
                            <h1 className="section-text title mt-4">2) ENTER REMINDER DETAILS</h1>
                            <p className="section-text paragraph">Fill in the reminder details</p>
                        </div>
                        <div className="col-10 col-md-4 pb-4">
                            <FontAwesomeIcon icon={faCheck} className="section-icon-use"></FontAwesomeIcon>
                            <h1 className="section-text title mt-4">3) Submit</h1>
                            <p className="section-text paragraph">Click the submit button to create the reminder</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Home;