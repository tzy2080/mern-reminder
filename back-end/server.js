// Packages
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Express
const app = express();
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routing files
const reminderRoute = require('./routes/reminder');
const userRoute = require('./routes/user');

// API routes
app.use('/reminder', reminderRoute);
app.use('/auth', userRoute);

// Server
const port = process.env.PORT || 5000;
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
    .catch(error => console.log(error.message));

// Server restart handling
const reminderHandler = require('./utils/reminderHandler');
reminderHandler.serverRestartRecovery();