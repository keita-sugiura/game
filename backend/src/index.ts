import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  todos: KVNamespace
}
const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!', 202);
})

app.get('/todos', async(c) =>  {
  const todoList = await c.env.todos.get('todos', 'json') as string[] || [];
  return c.json(todoList);
})

app.post('/todos', async (c) => {
  const body = await c.req.json();
  let todoList: string[] = [];
  const temp = await c.env.todos.get('todos', 'json');
  if(temp){
    todoList = temp as string[];
  }
  todoList.push(body.todo);
  await c.env.todos.put('todos', JSON.stringify(todoList));
  return c.json(todoList);
})

app.delete('/todos/:index', async(c) => {
  const index = parseInt(c.req.param('index'), 10);
  const todoList = await c.env.todos.get('todos', 'json') as string[] || [];
  todoList.splice(index, 1);
  await c.env.todos.put('todos', JSON.stringify(todoList));
  return c.json(todoList);
})

app.get('/todos/:id/:name', (c) => {
  const p = c.req.query("query");
  const id = c.req.param('id');
  const name = c.req.param('name');
  return c.json({ id, name, p });
})

export default app