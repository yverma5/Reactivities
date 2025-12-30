using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities.Commands
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string Id { get; set; }
        }
        public class Handler(IUserAccessor userAccessor,AppDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
          
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities
                    .Include(x => x.Attendes)
                    .ThenInclude(x => x.User)
                    .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
                if (activity == null) return Result<Unit>.Failure("Activity not found", 404);
                var user= await userAccessor.GetUserAsync();
                var attendance= activity.Attendes.FirstOrDefault(x=>x.UserId==user.Id); 
                var isHost=activity.Attendes.Any(x=>x.IsHost && x.UserId==user.Id);
               
                if (attendance != null )
                {
                    if (isHost)
                    {
                        activity.IsCancelled = !activity.IsCancelled; 
                    }
                    else activity.Attendes.Remove(attendance);
                }
                else
                {
                  var newAttendance = new ActivityAttendee
                    {
                        ActivityId = activity.Id,
                        UserId = user.Id,
                        IsHost = false
                    };
                    activity.Attendes.Add(newAttendance);
                } 
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Unit>.Success(Unit.Value): Result<Unit>.Failure("Problem Updating the DB",400);
            }
        }
    }
}
