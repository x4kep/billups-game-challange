using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
    private readonly IPlayerRegistry _players;
    private readonly IScoreboard _scores;

    public PlayersController(IPlayerRegistry players, IScoreboard scores)
    {
        _players = players;
        _scores = scores;
    }

    [HttpPost("guest")]
    public IActionResult CreateGuest()
    {
        var dto = _players.CreateGuest();
        return Ok(dto);
    }

    //[HttpPost("rename")]
    //public IActionResult Rename([FromBody] RenameRequest req)
    //{
    //    if (!Request.Headers.TryGetValue("X-Player-Token", out var headerVals) || !Guid.TryParse(headerVals.FirstOrDefault(), out var token))
    //        return Unauthorized(new { message = "missing token" });

    //    if (_players.Rename(token, req.name, out var updated))
    //        return Ok(updated);
    //    return NotFound(new { message = "Player not found" });
    //}

    [HttpGet("scores")]
    public IActionResult GetPlayerScores()
    {
        if (!Request.Headers.TryGetValue("X-Player-Token", out var headerVals) || !Guid.TryParse(headerVals.FirstOrDefault(), out _))
            return Unauthorized(new { message = "missing token" });
        return Ok(_scores.GetPlayerScores());
    }
}
