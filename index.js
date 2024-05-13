const { response, request } = require('express')
const express = require('express')
const port = 3000
const uuid = require('uuid')
const uniqeId = uuid.v4()

const app = express();
app.use(express.json());


const orders = []

const checkId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        console.log(index)
        return response.status(404).json({ error: "Order not found" })
    }
    request.orderIndex = index
    request.orderId = id
    next()
}

app.get('/order', (request, response) => {
    return response.json(orders)
})

app.post('/order', (request, response) => {
    const { pedido, clienteName, price, status } = request.body
    const order = { id: uuid.v4(), pedido, clienteName, price, status }

    orders.push(order)

    return response.status(201).json(order)
})

app.get('/order/:id', checkId, (request, response) => {
    const { id } = request.params;
    const order = orders.find(order => order.id === id);

    if (!order) {
        return response.status(404).json({ message: "Order not found" });
    }

    return response.json(order);
})

app.delete('/order/:id', checkId, (request, response) => {
    const index = request.orderIndex
    orders.splice(index, 1)

    return response.status(204).json()
})

app.patch('/order/:id', checkId, (request, response) => {
    const id = request.params.id
    const index = orders.findIndex(order => order.id === id);
    orders[index] = {
        ...orders[index],
        status: "pronto"
    };

    return response.json(orders[index])
})







app.listen(port, () => {
    console.log(`server louched on port ${port}🚀`)
})