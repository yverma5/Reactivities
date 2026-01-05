using Application.Activities.Commands;
using Application.Activities.Queries;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class CommentHub(IMediator mediator) : Hub
    {
        public async Task SendComment(AddComments.Command command)
        {
            var comment = await mediator.Send(command);

            await Clients.Group(command.ActivityId).SendAsync("RecieveComment",comment.Value);
        }
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext?.Request.Query["activityId"];

            if (string.IsNullOrWhiteSpace(activityId)) 
            {
                throw new HubException("No activity for this ID");
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, activityId!);
            var result = await mediator.Send(new GetComments.Query { ActivityId=activityId! });
            await Clients.Caller.SendAsync("LoadComments", result.Value);

        }
    }
}
