import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => res.send('Hello Fucking World!'));

app.listen(3000, () => console.log(`Server running on port 3000`));
