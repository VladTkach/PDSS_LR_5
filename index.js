const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const axios = require('axios');
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const jwtCheck = auth({
    audience: 'https://dev-kce243p8clsjjppr.us.auth0.com/api/v2/',
    issuerBaseURL: 'https://dev-kce243p8clsjjppr.us.auth0.com/',
});
app.get('/', (req, res) => {
    const token = req.headers.authorization
    if (token) {
        return res.json({
            username: token,
        })
    }
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/api/login', async (req, res) => {
    const { login, password } = req.body;

    console.log(login);
    console.log(password);
    try {
        const response = await axios.post('https://dev-kce243p8clsjjppr.us.auth0.com/oauth/token', {
            grant_type: 'password',
            client_id: 'gf2Ds3aBVXT7ajWA2NkJKYaTe6if3kyy',
            client_secret: '7Okzp1lX9ek9Bc67YDjUSV3I2hPcYJ2czSWc8cAgXdezENnBJYj165lJYlNIRPmn',
            audience: 'https://dev-kce243p8clsjjppr.us.auth0.com/api/v2/',
            username: login,
            password: password,
        }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const { access_token } = response.data;

        res.json({ token: access_token });
    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        res.status(401).send();
    }
});

app.get('/api/protected', jwtCheck, function (req, res) {
    res.json({ message: `Hello, this is a protected route.` });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
