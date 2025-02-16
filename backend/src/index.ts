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

const colorCount = 3;

type RequestJson ={
  todoList: string[],
  colorList: number[]
}
app.get('/todos/:user', async(c) =>  {
  const user = c.req.param('user');
  const requestJson = await c.env.todos.get(user, 'json');
  if(requestJson){
    return c.json(requestJson as RequestJson);
  }else{
    return c.json({todoList: [], colorList: []});
  }
})

app.post('/todos/:user', async (c) => {
  const user = c.req.param('user');
  const body = await c.req.json();
  let json: RequestJson = {todoList: [], colorList: []};
  const temp = await c.env.todos.get(user,'json') as RequestJson;
  if(temp){
    json = temp;
  }
  json.todoList.push(body.todo);
  json.colorList.push(0);
  await c.env.todos.put(user, JSON.stringify(json));
  return c.json(json);
})

app.put('/todos/:user/:index', async (c) => {
  const index = parseInt(c.req.param('index'), 10);
  const user = c.req.param('user');
  const json = await c.env.todos.get(user, 'json') as RequestJson;
  json.colorList[index] = (json.colorList[index] + 1) % colorCount;
  await c.env.todos.put(user, JSON.stringify(json));
  return c.json(json);
})

app.delete('/todos/:user/:index', async (c) => {
  const index = parseInt(c.req.param('index'), 10);
  const user = c.req.param('user');
  const json = await c.env.todos.get(user, 'json') as RequestJson;
  json.todoList.splice(index, 1);
  json.colorList.splice(index, 1);
  await c.env.todos.put(user, JSON.stringify(json));
  return c.json(json);
})


export default app