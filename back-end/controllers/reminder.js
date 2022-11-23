// Packages
require("dotenv").config();

// Import model
const Reminders  = require('../models/reminder_model');

// Import reminder handler
const reminderHandler = require('../utils/reminderHandler');

// Get all reminder
const getReminder = async (req, res) => {
    try {
        const userId = req.user;
        // Get all reminder 
        await Reminders.ReminderTask.find({userId, sentStatus: false}, '_id taskName taskDescription taskCreateDate taskExpireDate')
            .then(tasks => res.json(tasks));

    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
};

// Create new reminder
const createReminder = async (req, res) => {
    try {
        const userId = req.user;
        const taskName = req.body.taskName;
        const taskDescription = req.body.taskDescription;
        const taskCreateDate = Date.parse(req.body.taskCreateDate);
        const taskExpireDate = Date.parse(req.body.taskExpireDate);

        // Add new reminder to database
        const newReminder = new Reminders.ReminderTask({
            taskName,
            taskDescription,
            taskCreateDate,
            taskExpireDate,
            jobId: undefined,
            userId
        });
        await newReminder.save()
            .then(() => {
                reminderHandler.quickSend(newReminder);
                res.status(200).send()});
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
};

// Get specific reminder
const getSpecificReminder = async (req, res) => {
    try {
        const userId = req.user;
        const _id = req.params.id;

        // Check if task belong to the user
        await Reminders.ReminderTask.findOne({_id})
            .then(task => {
                if (String(task.userId) !== userId){
                    res.status(500).send();
                }
                else {
                    res.json(task);
                }
            });
    } catch (error) {
        res.status(500).send();
    }
};

// Delete reminder
const deleteReminder = async (req, res) => {
    try {
        const userId = req.user;
        const _id = req.params.id;

        // Check if the task belong to the user
        await Reminders.ReminderTask.findOne({_id})
            .then(async task => {
                if (String(task.userId) !== userId){
                    res.status(500).send();
                }
                else {
                    if (task.jobId !== undefined){
                        reminderHandler.cancelSend(task.jobId);
                    }
                    await Reminders.ReminderTask.deleteOne({_id});
                }
            });
    } catch (error) {
        res.status(500).send();
    }
};

// Update reminder
const updateReminder = async (req, res) => {
    try {
        const userId = req.user;
        const _id = req.params.id;
        const taskName = req.body.taskName;
        const taskDescription = req.body.taskDescription;
        const taskExpireDate = Date.parse(req.body.taskExpireDate);

        // Check if task belong to the user
        await Reminders.ReminderTask.findOne({_id})
            .then(async task => {
                try {
                    if (String(task.userId) !== userId){
                        res.status(500).send();
                    }
                    else{
                        // Update the reminder
                        const oldTaskExpireDate = task.taskExpireDate;
                        let updatingTask = await Reminders.ReminderTask.findOneAndUpdate({_id}, {taskName, taskDescription, taskExpireDate}, {new: true});
                        await updatingTask.save()
                            .then(updatedTask => {
                                if (oldTaskExpireDate !== taskExpireDate && updatedTask.jobId !== undefined){
                                    console.log('test');
                                    reminderHandler.cancelSend(updatedTask.jobId);
                                    reminderHandler.quickSend(updatedTask);
                                } else if (oldTaskExpireDate !== taskExpireDate && updatedTask.jobId === undefined) {
                                    console.log('test1');
                                    reminderHandler.quickSend(updatedTask);
                                }
                                res.status(200).send()
                            });
                    }
                } catch (error){
                    console.log(error);
                    res.status(500).send();
                }
            });
    } catch (error) {
        res.status(500).send();
    }
};

module.exports = { createReminder, deleteReminder, getReminder, getSpecificReminder, updateReminder }