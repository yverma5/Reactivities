using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Commands
{
    public class AddPhoto
    {
        public class Command: IRequest<Result<Photo>>
        {
            public required IFormFile File { get; set; }
        }
        public class Handler(IPhotoService photoService, AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Photo>>
        {
           
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                
                var photoUploadResult = await photoService.UploadPhoto(request.File);
                if (photoUploadResult == null) return Result<Photo>.Failure("Failed to upload Photo",400);
                var user = await userAccessor.GetUserAsync();
                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    PublicId = photoUploadResult.PublicId,
                    UserId= user.Id
                };
                user.ImageUrl??= photo.Url;
                context.Add(photo);
                
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
               
                return result?
                    Result<Photo>.Success(photo) :
                    Result<Photo>.Failure("Problem adding photo to DB",400);
            }
        }
    }
}
