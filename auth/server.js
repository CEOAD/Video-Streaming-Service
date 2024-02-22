const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const winston = require('winston');
const CORS = require('cors');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
const app = express();
const PORT = 3001;
const users = JSON.parse(fs.readFileSync('user.json', 'utf8'));

app.use(CORS());
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    logger.log({
        level: 'info',
        message: 'User logged in',
        username: username
    });
    if (user) {
        const token = jwt.sign({ sub: user
            .username }, 'your_secret_key', { expiresIn: '1h' });
    }

    if (user) {
        const token = jwt.sign({ sub: user.username }, 'your_secret_key', { expiresIn: '1h' });
        res.send({ token });
    } else {
        res.status(401).send('Username or password is incorrect');
    }
});

app.listen(PORT, () => {
    console.log(`Authentication Service running on port ${PORT}`);
});