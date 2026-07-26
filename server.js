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
