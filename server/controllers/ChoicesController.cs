using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChoicesController : ControllerBase
{
    private readonly IHttpClientFactory _http;
    private readonly IGameService _game;

    public ChoicesController(IHttpClientFactory http, IGameService game)
    {
        _http = http;
        _game = game;
    }

    [HttpGet]
    public IActionResult GetChoices()
        => Ok(GameService.Choices);

    [HttpGet("random")]
    public async Task<IActionResult> GetRandomChoice(CancellationToken cancellationToken)
    {
        var client = _http.CreateClient("random");
        try
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(2));

            var resp = await client.GetFromJsonAsync<RandomDto>(
                "https://codechallenge.boohma.com/random", cts.Token);

            var id = _game.MapRandomToChoiceId(resp?.random_number ?? Random.Shared.Next(1, 101));
            return Ok(GameService.Choices.First(c => c.id == id));
        }
        catch
        {
            var id = _game.MapRandomToChoiceId(Random.Shared.Next(1, 101));
            return Ok(GameService.Choices.First(c => c.id == id));
        }
    }
}
