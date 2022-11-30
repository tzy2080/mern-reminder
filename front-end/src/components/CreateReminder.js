import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Navbar from './Navbar';
import "../css/CreateReminder.css";

const CreateReminder = () => {
    // State hooks
    const [taskName, setTaskName] = useState('');
    var date = new Date();
    var dateNow = new Date();
    dateNow.setTime(date.getTime() + (1000 * 60)*1);
    const [taskExpireDate, setTaskExpireDate] = useState(dateNow);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const filterPassedTime = time => {
        const currentDate = new Date();
        currentDate.setTime(date.getTime() + (1000 * 60)*1);
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
    }

    // history
    let history = useHistory();

    // Handles submit button behavior
    const onSubmit = (e) => {
        e.preventDefault();
        const taskCreateDate = new Date();

        let taskDescription = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

        const reminder = {
            taskName,
            taskDescription,
            taskCreateDate,
            taskExpireDate
        }

        // Add reminder to server
        axios.post('http://localhost:5000/reminder/add', reminder)
            .then(res => history.push('/reminders'));
            
    }

    return ( 
        <div className="wrapper">
            <Navbar />
            <div className="row px-2 mx-0 justify-content-center">
                <div className="card shadow pb-3 add-card">
                    <br/>
                    <div className="row mx-0 pt-4">
                        <div className="col text-center">
                            <h1 className="add-card-heading">Add new reminder</h1>
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
                                    <input type="submit" value="Create reminder" className="btn btn-primary rounded-pill submit-btn" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default CreateReminder;