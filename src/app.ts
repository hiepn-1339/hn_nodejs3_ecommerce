import express, { Express, NextFunction, Request, Response } from 'express';
import config from './config';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';
import { AppDataSource } from './database/dataSource';
import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import routes from './routes';
import session from 'express-session';
import { Role } from './constants';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(morgan('combined'));
app.set('view engine', 'pug');

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{lng}}.json',
    },
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie'],
    },
    fallbackLng: 'vi',
    preload: ['vi', 'en'],
  });
app.use(i18nextMiddleware.handle(i18next));
app.use(
  i18nextMiddleware.handle(i18next, {
    removeLngFromUrl: false,
  }),
);

app.use(
  session({
    saveUninitialized: true,
    resave: false,
    secret: config.sessionSecret,
  }),
);

app.use((req: any, res, next) => {
  const user = req.session.user || null;
  let isAdmin = false;

  if (user && user.role == Role.ADMIN) {
    isAdmin = true;
  }
  res.locals.isAdmin = isAdmin;
  res.locals.user = user;
  next();
});

app.use('', routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const lng = req.query.lng as string || 'vi';
  i18next.changeLanguage(lng);
  next();
});

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
}));

app.use((err: any, req: Request, res: Response) => {
  if (err) {
    console.error(err.message);
  } else {
    res.status(500).send('Something went wrong!');
  }
});

const port = config.port;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
