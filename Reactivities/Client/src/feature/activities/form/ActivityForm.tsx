import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/type/hooks/useActivities";
import { useNavigate, useParams } from "react-router";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from "../../../app/shared/components/TextInput";
import SelectedInput from "../../../app/shared/components/SelectedInput";
import { categoryOptions } from "./categoryOptions";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import LocationInput from "../../../app/shared/components/LocationInput";

export default function ActivityForm() {
  const { reset, control, handleSubmit } = useForm<ActivitySchema>({
    mode: 'onTouched',
    resolver: zodResolver(activitySchema)
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);

  useEffect(() => {
    if (activity) reset({
      ...activity,
      date: new Date(activity.date),
      location: {
        venue: activity.venue,
        city: activity.city,
        latitude: activity.latitude,
        longitude: activity.longitude
      }
    });
  }, [activity, reset])
  const onSubmit = async (data: ActivitySchema) => {
    const{location,...rest}=data;
    const flattenData={...rest,...location};
    try {
      if (activity) {
        updateActivity.mutate({ ...activity, ...flattenData },{
          onSuccess: () => navigate(`/activities/${activity.id}`)
        });
      }else{
        createActivity.mutate(flattenData,{
          onSuccess: (id) => navigate(`/activities/${id}`)
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoadingActivity) return <Typography>Loading Activity...</Typography>
  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {activity ? 'Edit Activity' : 'Create Activity'}
      </Typography>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} display='flex' flexDirection='column' gap={3}>
        <TextInput label='Title' control={control} name='title' />
        <TextInput label='Description' control={control}
          name='description' multiline rows={3} />
        <Box display={'flex'}  gap={2}>
          <SelectedInput
            items={categoryOptions}
            label='Category'
            control={control}
            name='category'
          />
          <DateTimeInput label='Date' control={control} name='date' />


        </Box>

        <LocationInput control={control} label="Enter the Location" name="location" />
        <Box display='flex' justifyContent='end' gap={3}>
          <Button color='inherit' onClick={() => navigate(id ? `/activities/${id}` : '/activities')}>Cancel</Button>
          <Button
            type="submit"
            color='success'
            variant="contained"
            disabled={updateActivity.isPending || createActivity.isPending}
          >Submit</Button>
        </Box>

      </Box>
    </Paper>
  )
}
