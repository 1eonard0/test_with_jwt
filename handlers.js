const jwt = require('jsonwebtoken');

const JWT_KEY = 'secretKey';
const JWT_EXPIRY_SECONDS = 300;

//user testing
const users = {
    user1: 'pass1',
    user2: 'pass2'
};

const signIn = ( req, res ) =>{
    //user from body request. the fields are equal to json fields
    const { username, password } = req.body;


    if ( !username || !password || users[username] !== password ) {
        return res.status(401).end();
    }

    //sign the token. this is formed by username, JWT_KEY 
    //and finally the algorithm and time of expiration.
    const token = jwt.sign({ username }, JWT_KEY, {
        algorithm: 'HS256',
        expiresIn: JWT_EXPIRY_SECONDS
    });

    //print the token string
    console.log('token signin:', token);

    //store the token into cookie in the response.
    res.cookie('token', token, { maxAge: JWT_EXPIRY_SECONDS * 1000});
    res.end();
};

const welcome = ( req, res ) => {
    //get token from cookies object in request variable.
    const token = req.cookies.token;

    //if this not exist, return a 401 unauthorized
    if(!token){
        return res.status(401).end();
    }

    var payload;
    try{
        //anotherwise, verify if the token is valid.
        payload = jwt.verify(token, JWT_KEY);

    }catch(e){

        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end(); //unauthorized requested
        }

        //otherwise, return a bad request
        return res.status(400).end();
    }

    //print a welcome username!.
    res.send(`Welcome ${ payload.username }!`);
};

const refresh = ( req, res) => {
    
    const token = req.cookies.token;

    if(!token){
        return res.status(401).end();
    }

    var payload;
    try{
        payload = jwt.verify(token, JWT_KEY);
    }catch(e){
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end();
        }
        return res.status(400).end();
    }


    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);

    if(payload.exp - nowUnixSeconds > 30){
        return res.status(400).end();
    }

    const newToken = jwt.sign({ username: payload.username }, JWT_KEY, {
        algorithm: 'HS256',
        expiresIn: JWT_EXPIRY_SECONDS
    });

    console.log('token refresh:', token);

    res.cookie('token', newToken, {maxAge: JWT_EXPIRY_SECONDS * 1000});
    res.end();
}

module.exports = {
    signIn,
    welcome,
    refresh
};