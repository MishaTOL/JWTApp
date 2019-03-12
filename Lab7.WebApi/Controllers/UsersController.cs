using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lab7.WebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Lab7.WebApi.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly UserContext userContext;
        public UsersController (UserContext userContext)
        {
            this.userContext = userContext;
            if(userContext.Users.Count() == 0)
            {
                userContext.Users.Add(new User {Name = "Petya" });
                userContext.Users.Add(new User { Name = "Sasha" });
                userContext.Users.Add(new User { Name = "Vanya" });
                userContext.SaveChanges();
            }
        }
        // GET: api/<controller>
        [HttpGet]
        [Authorize]
        public ActionResult<IEnumerable<User>> GetUsers()
        {
            return userContext.Users.ToList();
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<User> GetUser(int id)
        {
            var user = userContext.Users.Find(id);

            if(user == null)
            {
                return NotFound();
            }
            return user;
        }

        // POST api/<controller>
        [HttpPost]
        [Authorize]
        public ActionResult<User> PostUser(User user)
        {
            userContext.Users.Add(user);
            userContext.SaveChanges();
            return CreatedAtAction("GetUser", new { id = user.Id }, user );
        }

        [HttpPost("token")]
        public ActionResult GetToken(User user)
        {
            var userExists = userContext.Users.FirstOrDefault(u => u.Name == user.Name);
            if(userExists == null)
            {
                return BadRequest();
            }
            string securityKey = "this_is_super_security_key";

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));

            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                issuer: "lab7.webapi",
                audience: "readers",
                expires: DateTime.Now.AddHours(1),
                signingCredentials: signingCredentials
            );
            return Ok(new JwtSecurityTokenHandler().WriteToken(token));
        }
    }
}
