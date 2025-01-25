import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import NodeCache from 'node-cache';
import pg from 'pg';


const { Client } = pg;

const client = new Client();

client.connect();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => res.send('Hello Fucking World!'));

// Bad Request
app.use((req, res) => {
  res.status(400).json({
    id: 400,
    status: 400,
    code: 'BAD_REQUEST',
    title: 'Bad Request',
  });
});

// Express goes live
app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

// Server cache init
export const serverCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export default app;
