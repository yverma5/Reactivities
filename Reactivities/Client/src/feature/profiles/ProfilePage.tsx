import { Grid2, Typography } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { useParams } from "react-router";
import { useProfile } from "../../lib/type/hooks/useProfile";

export default function ProfilePage() {
   const{id}=useParams();
   const { profile, loadingprofile } = useProfile(id);

   if (loadingprofile) return <Typography>Loading profile...</Typography>;
   
   if (!profile) return <Typography>Profile Not Found.</Typography>;



  return (
    <Grid2 container>
      <Grid2 size={12}>
        <ProfileHeader profile={profile}/>
        <ProfileContent/>
      </Grid2>
    </Grid2>
  )
}