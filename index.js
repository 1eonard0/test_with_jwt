const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { signIn, welcome, refresh } = require('./handlers');

const PORT = process.env.PORT || 5000;
const app =  express();

app.use(bodyParser.json());//convert body request to json
app.use(cookieParser());//insert all headers information into req.cookies variables.


app.post('/signin', signIn);
app.get('/welcome', welcome);
app.post('/refresh', refresh);


app.listen(PORT, () => {
    console.log(`Server running on port number ${PORT}`);
});


