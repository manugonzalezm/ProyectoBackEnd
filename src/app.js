import express from 'express';
import { productsRouter } from './routes/products.js';
import { cartsRouter } from './routes/carts.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use('/static', express.static(path.join(__dirname + 'public')));

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});

