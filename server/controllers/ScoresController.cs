using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScoresController : ControllerBase
{
    private readonly IScoreboard _scores;

    public ScoresController(IScoreboard scores) => _scores = scores;

    [HttpGet]
    public IActionResult Get([FromQuery] string? user)
        => Ok(_scores.GetLast(10, user));

    [HttpPost("reset")]
    public IActionResult Reset()
    {
        _scores.Reset();
        return Ok(new { ok = true });
    }
}
