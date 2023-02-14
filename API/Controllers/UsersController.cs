using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseAPIController
    {
       
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public IPhotoService PhotoService { get; }

        public UsersController(IUserRepository userRepository, IMapper mapper,
            IPhotoService photoService)
        {
            this.mapper = mapper;
            this.PhotoService = photoService;
            this.userRepository = userRepository;
            
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers(){
            var users = await userRepository.GetMembersAsync();
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username){
            var user = await userRepository.GetMemberAsync(username);
            return user;
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){
            var user = await userRepository.GetUserByUserNameAsync(User.GetUserName());
            if(user == null) return NotFound();
            this.mapper.Map(memberUpdateDto, user);
            if(await userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file){
            var user = await userRepository.GetUserByUserNameAsync(User.GetUserName());
            if(user == null) return NotFound();
            var result = await this.PhotoService.AddPhotoAsync(file);
            if(result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo() {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
            };
            if(user.Photos.Count == 0) photo.IsMain = true;
            user.Photos.Add(photo);
            if(await userRepository.SaveAllAsync()) return this.mapper.Map<PhotoDto>(photo);
            return BadRequest("Problem adding photo");
        }
    }
}