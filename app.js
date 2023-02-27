const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


// const helmet = require('helmet'); // to secure http headers
// const morgan = require('morgan'); // to configure logg
// const https = require('https');

const path = require('path');
const fs = require('fs');
const sequelize = require('./util/database');
// routes

const getExpenseroute = require('./routes/expenseAdded')
const getUser = require('./routes/user')
const buyPremium = require('./routes/purchase')
const premium = require('./routes/premium');
const resetPassword = require('./routes/password');

// models
const User = require('./model/user');
const Expenses = require('./model/expense');
const Order = require('./model/orders');
const forgotPassword = require('./model/forgotpassword');
const urlList = require('./model/url');

const accessLog = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags:'a'});



// console.log(process.env)
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

// app.use(helmet());
// app.use(morgan('combined', {stream: accessLog}))

app.use(bodyparser.json({extended:false}))
app.use(cors());

app.use('/',getExpenseroute);
app.use('/',getUser);
app.use('/',buyPremium);
app.use('/premium', premium);
app.use('/password', resetPassword);
// app.use('/',(req,res,next)=>{
// console.log(req.url)
//     res.sendFile(path.join(__dirname, `views/views/index.html`))    
// })
app.use((req, res)=>{
    console.log(req.url)
    res.sendFile(path.join(__dirname, `view/${req.url}`))
})

User.hasMany(Expenses);
Expenses.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(forgotPassword);
forgotPassword.belongsTo(User);
User.hasMany(urlList);
urlList.belongsTo(User);

sequelize
// .sync({force:true})
.sync()
.then((result)=>{
    // console.log(result);
    // https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT||3000);
    app.listen(process.env.PORT||4000) 
})
.catch(err=>console.log(err));

