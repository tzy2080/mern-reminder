// Packages
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tasks_Schema = new Schema({
    taskName: {type: String, required: true},
    taskDescription: String,
    taskCreateDate: {type: Date, required: true},
    taskExpireDate: {type: Date, required: true},
    jobId: {type: String},
    userId : {type: Schema.Types.ObjectId, required: true},
    sentStatus: {type: Boolean, default: false}
});

const users_Schema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

const job_Schema = new Schema({
    email: {type: String, required: true},
    taskId : {type: Schema.Types.ObjectId},
    sendDate: {type: Date, required: true},
    jobId: {type: String, required: true}
});

const ReminderUser = mongoose.model('ReminderUser', users_Schema);
const ReminderTask = mongoose.model('ReminderTask', tasks_Schema);
const ReminderJob = mongoose.model('ReminderJob', job_Schema);

module.exports = { ReminderUser, ReminderTask, ReminderJob };