import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios';
import './App.css'

import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import { ListItemButton } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';


const url = 'https://backend.kei0221tasugi.workers.dev/todos';

function App() {
  const [user, setUser] = useState('testUser');
  const [userText, setUserText] = useState('testUser');
  const [text, setText] = useState('take a nap');
  const [todoList, setTodoList] = useState<string[]>([]);
  const [colorList, setColorList] = useState<number[]>([]);
  const colorNumber = 3;
  const colors = ['green', 'blue', 'red'];
  useEffect(() => {
    getTodos();
  }, [user]);

  const getTodos = () => {
    axios.get(url + '/' + user)
      .then(response => {
        setTodoList(response.data.todoList);
        setColorList(response.data.colorList);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  }

  const addTodo = (text: string) => {
    setTodoList([...todoList, text]);
    setColorList([...colorList, 0]);
    axios.post(url + '/' + user, { todo: text })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('Error posting todo:', error);
      });
  }

  const deleteTodo = (index: number) => {
    setTodoList(todoList.filter((_, i) => i !== index));
    setColorList(colorList.filter((_, i) => i !== index));
    axios.delete(url + '/' + user + '/' + index)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  }

  const changeColor = (index: number) => {
    setColorList(colorList.map((color, i) => i === index ? (color + 1) % colorNumber : color));
    axios.put(url + '/' + user + '/' + index)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('Error changing color:', error);
      });
  }

  return (
    <>
      <TextField
        label="UserName"
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        style={{ backgroundColor: 'white' }}
      />
      <Button
        variant="contained"
        onClick={() => setUser(userText)}
        style={{ backgroundColor: 'green', height: '60px', color: 'white' }}
      >
        Change User
      </Button>
      <br />

      <h1><span style={{ color: 'green' }}>{user}</span>'s Todo List</h1>
      {todoList.length === 0 ? (
        <h1>You've done all todos!</h1>
      ) : (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'white' }}>
          {todoList.map((todo, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="comments" onClick={() => deleteTodo(index)}>
                  <CheckIcon />
                </IconButton>
              }
              disablePadding
              style={{ color: colors[colorList[index]] }}
            >
              <ListItemButton onClick={() => changeColor(index)}>
                {todo}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      <br />
      <TextField
        label="Todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ backgroundColor: 'white' }}
      />
      <Button
        variant="contained"
        onClick={() => addTodo(text)}
        style={{ backgroundColor: 'green', height: '60px', color: 'white' }}
      >
        Add
      </Button>
    </>
  )
}

export default App
