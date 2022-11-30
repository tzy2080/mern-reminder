import { useState, useEffect} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import PageNotFound from './PageNotFound';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import Navbar from './Navbar';
import "../css/EditReminder.css";

const EditReminder = () => {
    var date = new Date();
    var dateNow = new Date();
    dateNow.setTime(date.getTime() + (1000 * 60)*1);

    const filterPassedTime = time => {
        const currentDate = new Date();
        currentDate.setTime(date.getTime() + (1000 * 60)*1);
        const selectedDate = new Date(time);
    
        return currentDate.getTime() < selectedDate.getTime();
    }
      
    // State hook
    const [taskName, setTaskName] = useState('');
    const [taskExpireDate, setTaskExpireDate] = useState();
    const [retrieveStatus, setRetrieveStatus] = useState(false);
    const [retrieveFailure, setRetrieveFailure] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    // Params
    const { id } = useParams();

    // History
    let history = useHistory();

    // Mount
    useEffect(() => {
        axios.get('http://localhost:5000/reminder/' + id)
            .then((res) => {
                setTaskName(res.data.taskName);
                setTaskExpireDate(new Date(res.data.taskExpireDate));
                let content = convertFromRaw(JSON.parse(res.data.taskDescription));
                setEditorState(EditorState.createWithContent(content));
                setRetrieveStatus(true);
            })
            .catch(error => {
                setRetrieveFailure(true);
                console.log(error);
            })
    }, [id])
    
    // Handles submit button behavior
    const onSubmit = (e) => {
        e.preventDefault();

        let taskDescription = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

        const reminder = {
            taskName,
            taskDescription,
            taskExpireDate
        }

        // Add exercise to server
        axios.post('http://localhost:5000/reminder/update/' + id, reminder)
            .then(res => {
                history.push('/reminders');
            });
    }

    return (
        <div className="wrapper">
            <Navbar />
            { retrieveStatus && 
                <div className="row px-2 mx-0 justify-content-center">
                    <div className="card shadow pb-3 edit-card">
                        <br/>
                        <div className="row mx-0 pt-4">
                            <div className="col text-center">
                                <h1 className="edit-card-heading">Edit reminder</h1>
                                <hr className="divider mt-3 mb-5"></hr>
                            </div> 
                        </div>
                        <div className="row mx-0 justify-content-center">
                            <div className="col-10 px-0">
                                <form onSubmit={ onSubmit }>
                                    <div className="form-group label">
                                        <label>Task name: </label>
                                        <input type='text'
                                            required
                                            className="form-control input-field"
                                            value={ taskName }
                                            onChange={ (e) => setTaskName(e.target.value) }
                                        />
                                    </div>
                                    <div className="form-group label">
                                        <label>Task Description: </label>
                                        <Editor
                                            editorState={editorState}
                                            onEditorStateChange={(state) => {
                                                setEditorState(state);
                                            }}
                                            toolbar={{
                                                options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
                                            }}
                                        />
                                    </div>
                                    <div className="form-group label">
                                        <label>Remind date: </label>
                                        <div>
                                            <DatePicker
                                                selected={taskExpireDate}
                                                onChange={date => setTaskExpireDate(date)}
                                                onChangeRaw = {(e) => {e.preventDefault();}}
                                                showTimeSelect
                                                timeIntervals={1}
                                                timeCaption="time"
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                minDate={ dateNow }
                                                filterTime={filterPassedTime}
                                                className="date-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group pt-3 text-center">
                                        <input type="submit" value="Edit reminder" className="btn btn-primary rounded-pill submit-btn" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                retrieveFailure &&
                <div>
                    <PageNotFound />
                </div>
            }
        </div>
     );
}
 
export default EditReminder;