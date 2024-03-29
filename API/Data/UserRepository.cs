using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private DataContext _context { get; }
        public IMapper Mapper { get; }
        public UserRepository(DataContext context, IMapper mapper)
        {
            this.Mapper = mapper;
            this._context = context;
            
        }
        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUserNameAsync(string username)
        {
            return await _context.Users
            .Include(p=>p.Photos)
            .SingleOrDefaultAsync( x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
            .Include(p=>p.Photos)
            .ToListAsync<AppUser>();
        }

        public async Task<bool> SaveAllAsync()
        {
           return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
           _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<IEnumerable<MemberDto>> GetMembersAsync()
        {
           return await _context.Users
           .ProjectTo<MemberDto>(Mapper.ConfigurationProvider)
           .ToListAsync();
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users
              .Where( x => x.UserName == username)
              .ProjectTo<MemberDto>(Mapper.ConfigurationProvider)
              .SingleOrDefaultAsync();
        }
    }
}