const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'orders.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const readOrders = () => {
    try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } 
    catch (e) { return []; }
};

const writeOrders = (orders) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
};


const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
}

const readProducts = () => {
    try { return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8')); }
    catch (e) { return []; }
};

const writeProducts = (products) => {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
};

app.get('/api/products', (req, res) => {
    res.json(readProducts());
});

app.post('/api/products', (req, res) => {
    const products = readProducts();
    const product = {
        id: req.body.id || Date.now().toString(),
        ...req.body
    };
    products.push(product);
    writeProducts(products);
    res.json({ success: true, product });
});

app.put('/api/products/:id', (req, res) => {
    const products = readProducts();
    const index = products.findIndex(p => String(p.id) === String(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = { ...products[index], ...req.body, id: products[index].id };
    writeProducts(products);
    res.json({ success: true, product: products[index] });
});

app.delete('/api/products/:id', (req, res) => {
    const products = readProducts().filter(
        p => String(p.id) !== String(req.params.id)
    );
    writeProducts(products);
    res.json({ success: true });
});

app.get('/api/orders', (req, res) => res.json(readOrders()));

app.post('/api/orders', (req, res) => {
    const orders = readOrders();
    orders.unshift(req.body);
    writeOrders(orders);
    res.json({ success: true, order: req.body });
});

app.put('/api/orders/:id/status', (req, res) => {
    let orders = readOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (order) {
        order.status = order.status.includes('Completed') ? 'Pending ⏳' : 'Completed ✅';
        writeOrders(orders);
        res.json({ success: true, order });
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

app.delete('/api/orders/:id', (req, res) => {
    let orders = readOrders().filter(o => o.id !== req.params.id);
    writeOrders(orders);
    res.json({ success: true });
});

app.delete('/api/orders', (req, res) => {
    writeOrders([]);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log('=================================');
    console.log('🚀 Backend Server Running: http://localhost:' + PORT);
    console.log('=================================');
});
