const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {auth} = require('./middlewares/authMiddleware');

const app = express();
const {PORT, DB_URL} = require('./constants');
const routes = require('./router');

app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(auth);

app.engine('hbs', handlebars.engine({extname: "hbs"}));
app.set('view engine', 'hbs');
app.set('views', 'src/views');

async function dbConnect(){
    await mongoose.connect(DB_URL);
};

dbConnect()
.then(() => console.log('Succesfully connected to the DB!'))
.catch((err) => console.log(`Error while connecting to the DB: ${err}`));

app.use(routes)

app.listen(PORT, ()=> console.log(`Server is listening on port: ${PORT}...`));