import express from 'express';
import bodyParser from 'body-parser';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
