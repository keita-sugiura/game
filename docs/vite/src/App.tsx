import { useState } from 'react'
import { useEffect} from 'react'
import axios from 'axios';
import './App.css'

import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import { ListItemButton } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';


const url= 'https://backend.kei0221tasugi.workers.dev/todos';

function App() {
  const [text, setText] = useState('hello');
  const [todoList, setTodoList] = useState<string[]>([]);
  useEffect(() => {
    // HTTPリクエストを送信
    axios.get(url)
      .then(response => {
        // レスポンスのデータをセット
        setTodoList(response.data);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });;
  }, []);
  const addTodo = (text: string) => {
    setTodoList([...todoList, text]);
    axios.post(url, { todo: text })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('Error posting todo:', error);
      });
  }

  const deleteTodo = (index: number) => {
    setTodoList(todoList.filter((_, i) => i !== index));
    axios.delete(url + '/' + index)
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  }

  return (
    <>
      <h1>TODO</h1>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'white' }}>
        {todoList.map((todo,index) => 
        (
        <ListItem
          key={index}
          secondaryAction={
            <IconButton edge="end" aria-label="comments" 
            onClick={() => deleteTodo(index)}>
              <CheckIcon />
            </IconButton>
          }
          disablePadding
        >
          <ListItemButton>{todo}</ListItemButton>
        </ListItem>
        ))}
      </List>
      <br />
      <TextField
        label="Todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={() => addTodo(text)}
      >
        Add
      </Button>
    </>
  )
}

export default App
