const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./db')
const userRoute = require('./routes/userRoutes')
const developerRoute = require('./routes/developerRoutes');
const passport = require('./auth')


// middleware
app.use(express.json())
dotenv.config();

const PORT = process.env.PORT || 8080;
const authmid = passport.authenticate('local', {session:false})

app.use('/api/users',userRoute);
app.use('/api/developers', developerRoute);

// testing route

app.get('/', (req,res)=>{
    res.send("This is home page")
});



app.listen(PORT, ()=> console.log(`server is runnnig on http://localhost:${PORT}`));
