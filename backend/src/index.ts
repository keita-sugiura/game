import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!', 202);
})

const todos = ['Buy milk', 'Do laundry'];
app.get('/todos', (c) => {
  return c.json(todos);
})

app.post('/todos', async (c) => {
  const body = await c.req.json();
  todos.push(body.todo);
  return c.json(todos);
})

app.get('/todos/:id/:name', (c) => {
  const p=c.req.query("query")
  const id = c.req.param('id')
  const name = c.req.param('name');
  return c.json({ id, name,p });
})


export default app


