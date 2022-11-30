import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import draftToHtml from 'draftjs-to-html';
import Navbar from './Navbar';
import "../css/ReminderList.css";

const ReminderList = () => {
    // State hooks
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mount
    useEffect(() => {
        axios.get('http://localhost:5000/reminder/')
            .then((res) => {
                setReminders(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
        
    },[]);

    // Custom tag
    const Reminder = props => (
        <tr>
            <td className="table-item align-middle py-4 pl-md-4"><p>{props.reminder.taskName}</p></td>
            <td className="table-item align-middle py-1"><div dangerouslySetInnerHTML={{__html: draftToHtml(JSON.parse(props.reminder.taskDescription))}}></div></td>
            <td className="table-item align-middle py-1">{new Date(props.reminder.taskCreateDate).toString()}</td>
            <td className="table-item align-middle py-1">{new Date(props.reminder.taskExpireDate).toString()}</td>
            <td className="text-center align-middle py-1">
                <Link className="btn btn-success size btn-sm mb-1 rounded-pill" to={"/edit/" + props.reminder._id}>Edit</Link> <button type="button" className="btn btn-danger size btn-sm rounded-pill" onClick={() => {props.deleteReminder(props.reminder._id)}}>Delete</button>
            </td>
        </tr>
    )

    // Function for deleting exercise
    function deleteReminder(id) {
        axios.delete('http://localhost:5000/reminder/' + id)
            .then(res => console.log(res.data));
        
        setReminders(reminders.filter(el => el._id !== id))
    }

    // Function for generating the exercise list
    function reminderList() {
        return reminders.map(currentreminder => {
            return <Reminder reminder={currentreminder} deleteReminder={deleteReminder} key={currentreminder._id}/>;
        });
    }

    // Function for generating loading spinner
    function loadingSpinner() {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary text-center"></div>
            </div>
        );
    }

    return ( 
        <div className="wrapper">
            <Navbar />
            <div className="row px-2 mx-0 justify-content-center">
                <div className="card shadow-lg px-0 px-md-4 list-card pb-5">
                    <div className="row mx-0 pt-4">
                        <div className="col text-center">
                            <h1 className="add-card-heading">Reminders</h1>
                            <hr className="divider mt-3 mb-4"></hr>
                        </div> 
                    </div>
                    <div className="row mx-0">
                        <div className="col-12 px-1 px-md-3">
                            {/* If there is no reminder display this following block */}
                            { reminders.length == 0 && 
                                <div className='row mt-4 justify-content-center'>
                                    <div className='col-8 text-center'>
                                        <p className='text'>No reminders. Click the <strong>Create reminder </strong>link in the navigation bar to create a reminder.</p>
                                    </div>
                                </div>
                            }
                            {/* If there is reminder display the reminders in a table */}
                            {   reminders.length != 0 &&
                                <div className="table-responsive shadow table-outline">
                                    <table className="table">
                                        <thead className="table-header">
                                            <tr>
                                                <th className="table-heading align-middle pl-md-4">Name</th>
                                                <th className="table-heading align-middle description-col">Description</th>
                                                <th className="table-heading align-middle">Create Date</th>
                                                <th className="table-heading align-middle">Remind Date</th>
                                                <th className="table-heading text-center align-middle">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { !loading && reminderList() }
                                        </tbody>
                                    </table>
                                </div>

                            }
                            { loading && loadingSpinner() }
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default ReminderList;