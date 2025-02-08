import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import './App.css';
function App() {
  const [checked, setChecked] = React.useState(true);
  const [num,setNum] = React.useState(0);
  const [s,setS] = React.useState("ssss");
  const handleChange = (event) => {
    setChecked(event.target.checked);
    let t=num;
    let id = event.target.id;
    t^=1<<id;
    setS(id);
    setNum(t);
  };
  return (
    <div className="App">
      <h1>{num}</h1>
      {[0,1,2,3].reverse().map((x)=>{
        return <Checkbox id={x} onChange={handleChange} />;
      })}
      <h1>{s}</h1>
    </div>
  );
}

export default App;
