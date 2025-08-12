using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly IHttpClientFactory _http;
    private readonly IGameService _game;
    private readonly IScoreboard _scores;

    public GameController(IHttpClientFactory http, IGameService game, IScoreboard scores)
    {
        _http = http;
        _game = game;
        _scores = scores;
    }

    [HttpPost("play")]
    public async Task<IActionResult> Play([FromBody] PlayRequest req, CancellationToken cancellationToken)
    {
        if (!GameService.Choices.Any(c => c.id == req.player))
            return BadRequest(new { message = "Invalid player choice" });

        var client = _http.CreateClient("random");
        int computer;
        try
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(2));

            var resp = await client.GetFromJsonAsync<RandomDto>(
                "https://codechallenge.boohma.com/random", cts.Token);

            computer = _game.MapRandomToChoiceId(resp?.random_number ?? Random.Shared.Next(1, 101));
        }
        catch
        {
            computer = _game.MapRandomToChoiceId(Random.Shared.Next(1, 101));
        }

        var result = _game.Judge(req.player, computer);
        _scores.Append(new ScoreEntry
        {
            ts = DateTimeOffset.UtcNow,
            user = req.user,
            player = req.player,
            computer = computer,
            results = result
        });

        return Ok(new { results = result, player = req.player, computer });
    }
}
