import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';

const app: Application = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = new sqlite3.Database('./db/my.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the mydb database.');
  }
});

const dropQuery = `
  DROP TABLE IF EXISTS person
`;

const insertQuery = `
  CREATE TABLE IF NOT EXISTS person(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(20)
  )
`;

const dummyDataQuery = `
  insert into person(name) values ('hi'), ('hello')
`;

db.serialize(() => {
  db.each(dropQuery);
  db.each(insertQuery);
  db.each(dummyDataQuery);
});

app.get('/', async (req: Request, res: Response) => {
  const query = `SELECT * FROM person`;
  db.serialize();
  new Promise((resolve, reject) =>
    db.all(query, (err, rows) => {
      if (err) console.log(err);
      return resolve(rows);
    }),
  ).then((rows) =>
    res.status(200).send({
      user: rows,
    }),
  );
});

app.post('/', async (req: Request, res: Response): Promise<Response> => {
  const query = `insert into person(name) values ('${req.body.name}')`;
  db.serialize();
  db.each(query);
  return res.status(200).send({
    message: `Hello World! ${req.body.name}`,
  });
});

const PORT = 3000;

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
