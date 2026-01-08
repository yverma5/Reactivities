using Application.Activities.DTO;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries
{
    public class GetComments
    {
        public class Query : IRequest<Result<List<CommentDto>>>
        {
            public required string ActivityId { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper,IUserAccessor userAccessor) : IRequestHandler<Query, Result<List<CommentDto>>>
        {
            public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await context.Comments.Where(x=>x.ActivityId==request.ActivityId)
                    .OrderByDescending(x=>x.CreatedAt)
                    .ProjectTo<CommentDto>(mapper.ConfigurationProvider, new { currentUserId = userAccessor.GetUserId() })
                    .ToListAsync(cancellationToken);
                return  Result<List<CommentDto>>.Success(comments);
            }
        }
    }
}
