
import {useState } from 'react'
import { Box, Container, CssBaseline, Typography } from '@mui/material';
import NavBar from './NavBar';
import ActivityDashboard from '../../feature/activities/dashboard/ActivityDashboard';
import { useActivities } from '../../lib/type/hooks/useActivities';


function App() {

  const [selectedActivity,setSelectedActivity]= useState<Activity | undefined>(undefined);
  const [editMode,setEditMode]=useState(false);
  const {activities,isPending} = useActivities();
  
const handleSelectedActivity=(id:string)=>{
  setSelectedActivity(activities!.find(x=>x.id===id))
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

  
 return (
 <Box sx={{bgcolor:'#eeeeee', minHeight:'100vh'}}>
 <CssBaseline/>
  <NavBar openForm={handleOpenForm}/>
  <Container maxWidth='xl' sx={{mt: 3}}>
    {!activities|| isPending? (
      <Typography>Loading...</Typography>
    ):(
      <ActivityDashboard 
    activities={activities}
    selectActivity={handleSelectedActivity}
    cancelSelectActivity={handleCancelActivity}
    selectedActivity={selectedActivity}
    editMode={editMode}
    openForm={handleOpenForm}
    closeForm={handleFormClose}
    />

    )}
    

  </Container>
  
 </Box>

 )
  
}

export default App
