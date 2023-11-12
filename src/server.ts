import express, { Request, Response, RequestHandler } from 'express';
import { createHash } from 'crypto';
import { Pool } from 'pg';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

function calculateSessionId(secretKey: string): string {

  const combinedData = secretKey + Date.now().toString();

  const sessionId = createHash('sha256').update(combinedData).digest('hex');

  return sessionId;
}

dotenv.config();

const app = express();
const port = 3000;

const connectionString = 'postgres://lab1_2ogu_user:dbmIgmAjmXUAU7ZNBx3F5u3SO50O9hyB@dpg-ckv3c5mb0mos73ectqn0-a.oregon-postgres.render.com/lab1_2ogu';
const secretKey = 'KfKYwe1zx4P1wxyGgLdj9hIaqEAeFBKk';

const pool = new Pool({
  connectionString: connectionString,
  ssl: true, 
});

const globalMiddleware: Array<RequestHandler> = [
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  cors({ origin: true, credentials: true }),
  cookieParser()
  /* session({
      secret: secretKey,
      resave: false,
      saveUninitialized: true,
      cookie: {maxAge: 24 * 60 * 60 * 1000, secure: false}
  }) */
];

app.use(...globalMiddleware);

app.get('/', (req: Request, res: Response) => {
  const sessionId = calculateSessionId(secretKey);
  res.json({message : 'SessionId set!', sessionId : sessionId});
});

app.post('/auth', async (req: Request, res: Response) => {
  var username = req.body.username;
  var password = req.body.password;

  try {
    //console.clear();
    //console.log(`SELECT * FROM users WHERE username = '${username}' AND pass = '${password}'`);
    //const result = await pool.query('SELECT * FROM users WHERE username = $1 AND pass = $2',[username, password]);
    //console.log(typeof(username) , typeof(password));
    const result = await pool.query(`SELECT * FROM users WHERE username = '${username}' AND pass = '${password}'`);
    //console.log(result.rows)
    if (result.rows.length > 0) {
      var userId = result.rows[0].user_id;
      var userName = result.rows[0].username;
      var passWord = result.rows[0].pass;
      res.json({ success: true , userId: userId, userName:userName, passWord:passWord});
    } else {
      res.json({ success: false, message: 'Neuspješna prijava. Provjeri korisničko ime i šifru.' });
    }
  } catch (error) {
    console.error('Greška pri autentifikaciji:', error);
    res.status(500).json({ success: false, message: 'Greška pri autentifikaciji.' });
  }
});

app.post('/authStrong', async (req: Request, res: Response) => {
  var username = req.body.username;
  var password = req.body.password;

  if(typeof username!="string" || typeof password != "string"){
    res.status(500).json({ success: false, message: 'Neispravni ulazni parametri.' });
    return
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND pass = $2',[username, password]);
  
    if (result.rows.length > 0 ) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Neuspješna prijava. Provjeri korisničko ime i šifru.' });
    }
  } catch (error) {
    console.error('Greška pri autentifikaciji:', error);
    res.status(500).json({ success: false, message: 'Greška pri autentifikaciji.' });
  }
});

app.post('/authCookie', async (req: Request, res: Response) => {
  var username = req.body.username;
  var password = req.body.password;

  if(typeof username!="string" || typeof password != "string"){
    res.status(500).json({ success: false, message: 'Neispravni ulazni parametri.' });
    return
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1',[username]);
    //console.log(result.rows[0].pass);
    if (result.rows.length > 0 ) {
      if(result.rows[0].pass === password){
        res.json({ success: true });
        return
      }
      res.json({ success: false, message: 'Neuspješna prijava. Lozinka nije ispravna.' });
      return
    } else {
      res.json({ success: false, message: 'Neuspješna prijava. Korisničko ime nije ispravno.' });
    }
  } catch (error) {
    console.error('Greška pri autentifikaciji:', error);
    res.status(500).json({ success: false, message: 'Greška pri autentifikaciji.' });
  }
});

app.post('/authCookieStrong', async (req: Request, res: Response) => {
  var username = req.body.username;
  var password = req.body.password;
  var sessionId = req.body.sessionId;

  //console.log(sessionId, "tutue");
  
  if(typeof username!="string" || typeof password != "string"){
    res.status(500).json({ success: false, message: 'Neispravni ulazni parametri.' });
    return
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND pass = $2',[username, password]);
    if (result.rows.length > 0) {
      res.json({ success: true});
    } else {
      res.json({ success: false, message: 'Neuspješna prijava. Provjeri korisničko ime i šifru.' });
    }
  } catch (error) {
    console.error('Greška pri autentifikaciji:', error);
    res.status(500).json({ success: false, message: 'Greška pri autentifikaciji.' });
  }
});

app.listen(port, () => {
  console.log(`Server je pokrenut na http://localhost:${port}`);
});
