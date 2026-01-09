import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";
import { useStore } from "./useStore";


export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const {currentUser}= useAccount();
  const {activityStore:{filter,startDate}}= useStore();

  const location =useLocation();

  const { data: activitiesGroup, isLoading, isFetchingNextPage,fetchNextPage,hasNextPage } 
  = useInfiniteQuery<PagedList<Activity,string>>({
    queryKey: ['activities',filter,startDate],
    queryFn: async ({pageParam=null}) => {
      const response = await agent.get<PagedList<Activity,string>>('/activities',{
        params:{
          cursor:pageParam,
          pageSize:3,
          filter,
          startDate
        }
      });
      return response.data;
    },
    staleTime:1000*60*2,
    placeholderData:keepPreviousData,
    initialPageParam:null,
    getNextPageParam: (lastPage)=>lastPage.nextCursor,
    enabled: !id && location.pathname==='/activities' && !!currentUser,
    select: (data) => ({
      ...data,
      pages: data.pages.map((page)=>({
        ...page,
        items:page.items.map(activity=>{
           const host = activity.attendes.find(a => a.id === activity.hostId);
        
        return {
          ...activity,
          isGoing: activity.attendes.some(a => a.id === currentUser?.id),
          isHost: activity.hostId === currentUser?.id,
          hostImageUrl: host?.imageUrl
        }

        })
      }))

    })
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['activities', id],
    queryFn: async () => {
      const response = await agent.get<Activity>(`/activities/${id}`)
      return response.data;
    },
    enabled: !!id && !!currentUser,
    select: data => {
              const host = data.attendes.find(a => a.id === data.hostId);

      return {
        ...data,
        isGoing: data.attendes.some(a => a.id === currentUser?.id),
        isHost: data.hostId === currentUser?.id,
        hostImageUrl: host?.imageUrl
      }
    }
  })

  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      await agent.put('/activities', activity)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities']
      })
    }
  })

  const createActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const response = await agent.post('/activities', activity)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities']
      })
    }
  })



  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      await agent.delete(`/activities/${id}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities']
      })
    }
  });

    const updateAttendence = useMutation({
    mutationFn: async (id:string) => {
      await agent.post(`/activities/${id}/attend`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities', id]
      });
    } 
  });

  return {
    activitiesGroup,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    updateActivity,
    createActivity,
    deleteActivity,
    activity: activity,
    isLoadingActivity,
    updateAttendence
  }

}