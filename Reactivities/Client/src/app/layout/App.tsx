
import { useEffect, useState } from 'react'
import { Box, Container, CssBaseline } from '@mui/material';
import axios from 'axios';
import NavBar from './NavBar';
import ActivityDashboard from '../../feature/activities/dashboard/ActivityDashboard';


function App() {
  const [activities,setActivities]= useState<Activity[]>([]);
  const [selectedActivity,setSelectedActivity]= useState<Activity | undefined>(undefined);
  const [editMode,setEditMode]=useState(false);
useEffect(()=>{
  axios.get<Activity []>('https://localhost:5001/api/Activities')
  .then(response=>setActivities(response.data))
  
},[])

const handleSelectedActivity=(id:string)=>{
  setSelectedActivity(activities.find(x=>x.id===id))
}
const handleCancelActivity= ()=>{
  setSelectedActivity(undefined);
}

const handleOpenForm=(id?:string)=>{
 if(id) handleSelectedActivity(id)
  else handleCancelActivity()
setEditMode(true);
}
const handleFormClose =()=>{
  setEditMode(false)
}
const handleSubmitForm=(activity:Activity)=>{
  if(activity.id){
    setActivities(activities.map(x => x.id===activity.id? activity:x))
  }
    else{
      const newActivity={...activity,id:activities.length.toString()}
      setSelectedActivity(newActivity);
      setActivities([...activities,newActivity])
    }
    setEditMode(false);
  }
  const handleDelete=(id:string)=>{
    setActivities(activities.filter(x=>x.id!== id))
  }

 return (
 <Box sx={{bgcolor:'#eeeeee'}}>
 <CssBaseline/>
  <NavBar openForm={handleOpenForm}/>
  <Container maxWidth='xl' sx={{mt: 3}}>
    <ActivityDashboard activities={activities}
    selectActivity={handleSelectedActivity}
    cancelSelectActivity={handleCancelActivity}
    selectedActivity={selectedActivity}
    editMode={editMode}
    openForm={handleOpenForm}
    closeForm={handleFormClose}
    submitForm={handleSubmitForm}
    deleteActivity={handleDelete}
    />

  </Container>
  
 </Box>

 )
  
}

export default App
