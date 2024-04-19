import express, { Express, Request, Response } from 'express';
import config from './config';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(morgan('combined'));
app.set('view engine', 'pug');

app.use((err: any, req: Request, res: Response) => {
  if (err) {
    console.error(err.stack);
  } else {
    res.status(500).send('Something went wrong!');
  }
});

const port = config.port;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
