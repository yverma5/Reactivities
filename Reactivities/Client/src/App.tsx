
import { useEffect, useState } from 'react'
import './App.css'
import Typography from '@mui/material/Typography';
import { List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';


function App() {
  const [activities,setactivity]= useState<Activity[]>([]);

useEffect(()=>{
  axios.get<Activity []>('https://localhost:5001/api/Activities')
  .then(response=>setactivity(response.data))
  
},[])

 return (
 <>
  <Typography variant='h3' >Reactivities</Typography>
  <List>{activities.map((activity)=>
  (
    <ListItem key={activity.id}>
      <ListItemText>{activity.title}</ListItemText>
    </ListItem>
  )
  )}</List>
 </>

 )
  
}

export default App
