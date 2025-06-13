#!/usr/bin/env node
import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import './src/config/database.js'
import compression from 'compression';
import morgan from 'morgan';
import router from './src/router/route.js';

morgan.token('host', (req) => req.headers.host);
morgan.token('worker', () => process.pid);

const app = express();

const PORT = process.env.PORT || 8080;

/* REST CONFIG */
app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: false, parameterLimit: 100000, limit: '100mb' }));
app.use(express.json({ extended: false, parameterLimit: 100000, limit: '100mb' }));
app.use(compression());
app.use(morgan('[:worker] :remote-addr (:user-agent) :host - :method :url HTTP/:http-version :status - :res[content-length] bytes - :response-time[0] ms'));
/* REST CONFIG */

/* ROUTES */
app.use('/', router);
/* ROUTES */

app.listen(PORT, () => console.info(`ReachOut Exercise listening on port ${PORT} and environment ${process.env.NODE_ENV}! - Worker ${process.pid}`));