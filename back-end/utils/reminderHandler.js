const Reminders  = require('../models/reminder_model');
const crypto = require('crypto');
const schedule = require('node-schedule');
const dateFormat = require("dateformat");
const sendEmail = require('../utils/sendEmail');
const draftToHtml = require('draftjs-to-html');
require("dotenv").config();

// Date convertion which seperates the year, month, day , hour and minutes
const convertDate = (date) => {
    try {
        const year = parseInt(dateFormat(date,'UTC:yyyy'));
        const month = parseInt(dateFormat(date,'UTC:m'))-1;
        const day = parseInt(dateFormat(date,'UTC:d'));
        const hour = parseInt(dateFormat(date,'UTC:H'));
        const minutes = parseInt(dateFormat(date,'UTC:M'));
        return {year, month, day, hour, minutes};
    } catch (error){
        console.log(error);
    }
}

// Calculation of Time difference which take cares of daylight saving
const timeDifference = (date1, date2) => {
    try {
        var date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds(), date1.getMilliseconds());
        var date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds(), date2.getMilliseconds());

        hour = 1000*60*60;
        differenceHours = (date2utc - date1utc)/hour;
        return differenceHours;
    } catch (error){
        console.log(error);
    }
}

// Cancel job
const cancelSend = async (jobId)=> {
    try{
        // Delete from job table
        await Reminders.ReminderJob.deleteOne({jobId});

        // Delete from scheduler 
        var scheduledReminder = schedule.scheduledJobs[jobId];
        console.log('Job with id', jobId, 'is cancelled' );
        scheduledReminder.cancel();
    } catch (error){
        console.log(error);
    }
}

// Prepare the scheduled reminder send
const scheduleSend = (job, task) => {
    try{
        var sendDate = new Date(job.sendDate);
        var sendDateUtc = Date.UTC(sendDate.getUTCFullYear(), sendDate.getUTCMonth(), sendDate.getUTCDate(), sendDate.getUTCHours(), sendDate.getUTCMinutes(), sendDate.getUTCSeconds());
        var formatedDate = convertDate(new Date(sendDateUtc));

        const rule = new schedule.RecurrenceRule();
        rule.hour = formatedDate.hour;
        rule.minute = formatedDate.minutes;
        rule.second = 0;
        rule.month = formatedDate.month;
        rule.date = formatedDate.day;
        rule.year = formatedDate.year;
        rule.tz = 'Etc/UTC';

        const scheduledJob = schedule.scheduleJob(job.jobId, rule, async function() {
            try {
                const message = `
                    <h2>Reminder: ${task.taskName}</h2>
                    <div>${draftToHtml(JSON.parse(task.taskDescription))}</div>
                `

                sendEmail({
                    to: job.email,
                    subject: "Reminder: You have one task due now",
                    text: message
                });
                console.log('Reminder sent');
                scheduledJob.cancel();
                await Reminders.ReminderJob.deleteOne({jobId:job.jobId});

                task.sentStatus = true;
                await task.save();
            } catch (error){
                console.log(error);
            }
        });
    } catch (error){
        console.log(error);
    }
}

// Create job
const createJob = async (task) => {
    try{
        const _id = task.userId;

        const jobId = crypto.randomBytes(20).toString('hex');
        var difference = timeDifference(new Date(), new Date(task.taskExpireDate));
        var sendDate;
        if (difference <= 0){
            var newSendDate = new Date();
            sendDate = newSendDate.setTime(newSendDate.getTime() + (1000 * 60));
        } else {
            sendDate = task.taskExpireDate;
        }
        const taskId = task._id;

        // Save job id to task table
        task.jobId = jobId;
        await task.save();

        // Save new job in to job table
        await Reminders.ReminderUser.findOne({_id})
            .then(async user => {
                try {
                    // Add to job table
                    const email = user.email;
                    const newJob = Reminders.ReminderJob({
                        email,
                        taskId,
                        sendDate,
                        jobId
                    });
                    await newJob.save();
                    scheduleSend(newJob, task);
                } catch (error){
                    console.log(error);
                }
            });
    } catch (error){
        console.log(error);
    }
}

// Search the task table and find for upcoming task deadlines
const searchTask = async () => {
    try{
        Reminders.ReminderTask.find({})
            .then( tasks => {
                tasks.forEach(task => {
                    difference = timeDifference(new Date(), new Date(task.taskExpireDate));
                    // If the remind time is within one hour or before the current time then
                    if (difference <= 1 && task.jobId === undefined){
                        createJob(task);
                        console.log('Reminder sent job created');
                    }
                });
            });
    } catch (error){
        console.log(error);
    }
}

// check if the task has to be send within an hour
const quickSend = task => {
    try{
        difference = timeDifference(new Date(process.env.queryLastRan), new Date(task.taskExpireDate));

        // If the remind time is within one hour and 10 minutes before last query update then
        if (difference <= 1.1){
            createJob(task);
        }
    } catch (error){
        console.log(error);
    }
}

// Run every single hour to check for upcoming deadlines
const queryTask = () => {
    try{
        var currentTime = new Date();
        var currentMinute = currentTime.getMinutes();
        var rule = `${currentMinute + 1} */1 * * *`;
        const job = schedule.scheduleJob(rule, function(){
            console.log('Hourly query', new Date());
            process.env.queryLastRan = new Date();
            searchTask();
        });
    } catch (error){
        console.log(error);
    }
}

// Server restart (search for the job table to recover)
const serverRestartRecovery = () => {
    try{
        queryTask();
        Reminders.ReminderJob.find({})
            .then(jobs => {
                console.log('Server restart initiate');
                jobs.forEach(async job => {
                    try {
                        const _id = job.taskId;

                        var difference = timeDifference(new Date(), new Date(job.sendDate));
                        if (difference <= 0){
                            var newSendDate = new Date();
                            job.sendDate = newSendDate.setTime(newSendDate.getTime() + (1000 * 30));
                            job.save();
                        }
                        await Reminders.ReminderTask.findOne({_id})
                            .then(task => scheduleSend(job, task));   
                    } catch (error){
                        console.log(error);
                    }
                });
            });
    } catch (error){
        console.log(error);
    }
}

module.exports = { cancelSend, serverRestartRecovery, queryTask, quickSend };