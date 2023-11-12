"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
const pg_1 = require("pg");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
function calculateSessionId(secretKey) {
    const combinedData = secretKey + Date.now().toString();
    const sessionId = (0, crypto_1.createHash)('sha256').update(combinedData).digest('hex');
    return sessionId;
}
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
const connectionString = 'postgres://lab1_2ogu_user:dbmIgmAjmXUAU7ZNBx3F5u3SO50O9hyB@dpg-ckv3c5mb0mos73ectqn0-a.oregon-postgres.render.com/lab1_2ogu';
const secretKey = 'KfKYwe1zx4P1wxyGgLdj9hIaqEAeFBKk';
const pool = new pg_1.Pool({
    connectionString: connectionString,
    ssl: true,
});
const globalMiddleware = [
    body_parser_1.default.urlencoded({ extended: false }),
    body_parser_1.default.json(),
    (0, cors_1.default)({ origin: true, credentials: true }),
    (0, cookie_parser_1.default)()
    /* session({
        secret: secretKey,
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 24 * 60 * 60 * 1000, secure: false}
    }) */
];
app.use(...globalMiddleware);
app.get('/', (req, res) => {
    const sessionId = calculateSessionId(secretKey);
    res.json({ message: 'SessionId set!', sessionId: sessionId });
});
app.post('/auth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var username = req.body.username;
    var password = req.body.password;
    try {
        //console.clear();
        //console.log(`SELECT * FROM users WHERE username = '${username}' AND pass = '${password}'`);
        //const result = await pool.query('SELECT * FROM users WHERE username = $1 AND pass = $2',[username, password]);
        //console.log(typeof(username) , typeof(password));
        const result = yield pool.query(`SELECT * FROM users WHERE username = '${username}' AND pass = '${password}'`);
        //console.log(result.rows)
        if (result.rows.length > 0) {
            var userId = result.rows[0].user_id;
            var userName = result.rows[0].username;
            var passWord = result.rows[0].pass;
            res.json({ success: true, userId: userId, userName: userName, passWord: passWord });
        }
        else {
            res.json({ success: false, message: 'Neuspješna prijava. Provjeri korisničko ime i šifru.' });
        }
    }
    catch (error) {
        console.error('Greška pri autentifikaciji:', error);
        res.status(500).json({ success: false, message: 'Greška pri autentifikaciji.' });
    }
}));
app.post('/authStrong', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var username = req.body.username;
    var password = req.body.password;
    if (typeof username != "string" || typeof password != "string") {
        res.status(500).json({ success: false, message: 'Neispravni ulazni parametri.' });
        return;
    }
    try {
        const result = yield pool.query('SELECT * FROM users WHERE username = $1 AND pass = $2', [username, password]);
        if (result.rows.length > 0) {
            res.json({ success: true });
        }
        else {
            res.json({ success: false, message: 'Neuspješna prijava. Provjeri korisničko ime i šifru.' });
        }
    }
    catch (error) {
        console.error('Greška pri autentifikaciji:', error);
        res.status(500).json({ success: false, message: 'Greška pri autentifikaciji.' });
    }
}));
app.post('/authCookie', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var username = req.body.username;
    var password = req.body.password;
    if (typeof username != "string" || typeof password != "string") {
        res.status(500).json({ success: false, message: 'Neispravni ulazni parametri.' });
        return;
    }
    try {
        const result = yield pool.query('SELECT * FROM users WHERE username = $1', [username]);
        //console.log(result.rows[0].pass);
        if (result.rows.length > 0) {
            if (result.rows[0].pass === password) {
                res.json({ success: true });
                return;
            }
            res.json({ success: false, message: 'Neuspješna prijava. Lozinka nije ispravna.' });
            return;
        }
        else {
            res.json({ success: false, message: 'Neuspješna prijava. Korisničko ime nije ispravno.' });
        }
    }
    catch (error) {
        console.error('Greška pri autentifikaciji:', error);
        res.status(500).json({ success: false, message: 'Greška pri autentifikaciji.' });
    }
}));
app.post('/authCookieStrong', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var username = req.body.username;
    var password = req.body.password;
    var sessionId = req.body.sessionId;
    //console.log(sessionId, "tutue");
    if (typeof username != "string" || typeof password != "string") {
        res.status(500).json({ success: false, message: 'Neispravni ulazni parametri.' });
        return;
    }
    try {
        const result = yield pool.query('SELECT * FROM users WHERE username = $1 AND pass = $2', [username, password]);
        if (result.rows.length > 0) {
            res.json({ success: true });
        }
        else {
            res.json({ success: false, message: 'Neuspješna prijava. Provjeri korisničko ime i šifru.' });
        }
    }
    catch (error) {
        console.error('Greška pri autentifikaciji:', error);
        res.status(500).json({ success: false, message: 'Greška pri autentifikaciji.' });
    }
}));
app.listen(port, () => {
    console.log(`Server je pokrenut na http://localhost:${port}`);
});
