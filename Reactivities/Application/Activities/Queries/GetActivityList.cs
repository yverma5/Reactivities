using Application.Activities.DTO;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries
{
    public class GetActivityList
    {
        public class Query : IRequest<List<ActivityDto>> { }
        public class Handler(AppDbContext context,IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, List<ActivityDto>>
        {

            async Task<List<ActivityDto>> IRequestHandler<Query, List<ActivityDto>>.Handle(Query request, CancellationToken cancellationToken)
            {
                return await context.Activities
                    .ProjectTo<ActivityDto>(mapper.ConfigurationProvider, new { currentUserId = userAccessor.GetUserId() })   
                    .AsNoTracking()
                    .ToListAsync(cancellationToken);
            }
        }
    }
}
