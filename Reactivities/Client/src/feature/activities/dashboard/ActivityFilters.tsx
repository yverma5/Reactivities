import { FilterList, Event } from "@mui/icons-material";
import { Box, ListItemText, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import 'react-calendar/dist/Calendar.css'
import { Calendar } from "react-calendar";
import { useStore } from "../../../lib/type/hooks/useStore";
import { observer } from "mobx-react-lite";

const ActivityFilters = observer(function ActivityFilters() {
    const { activityStore: { setFilter, setStartDate, filter, startDate } } = useStore();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 3 }}>
            <Paper sx={{ p: 2, borderRadius: 3, height: 205 }}>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="h6"
                        sx={{
                            display: 'flex', alignItems: 'centre',
                            mb: 3, color: 'primary.main'
                        }}>
                        <FilterList sx={{}} />
                        Filters
                    </Typography>
                    <MenuList>
                        <MenuItem
                            selected={filter === 'all'}
                            onClick={() => setFilter('all')}
                        >
                            <ListItemText primary='All events' />
                        </MenuItem>
                        <MenuItem
                            selected={filter === 'isGoing'}
                            onClick={() => setFilter('isGoing')}
                        >
                            <ListItemText primary="I'm going" />
                        </MenuItem>
                        <MenuItem
                            selected={filter === 'isHost'}
                            onClick={() => setFilter('isHost')}
                        >
                            <ListItemText primary="I'm hosting" />
                        </MenuItem>
                    </MenuList>
                </Box>
            </Paper>
            <Box component={Paper} sx={{ width: '100%', p: 2, borderRadius: 3, mb: 2, height: 350 }} >
                <Typography variant="h6"
                    sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'primary.main' }}>
                    <Event sx={{ mr: 1 }} />
                    Select Date
                </Typography>
                <Calendar 
                    value={startDate}
                    onChange={date=>setStartDate(date as Date)}
                />
            </Box>
        </Box>
    )
})

export default ActivityFilters;