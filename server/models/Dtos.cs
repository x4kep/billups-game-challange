public record RandomDto(int random_number);
public record ChoiceDto(int id, string name);
// kept user for backward compatibility, but server now identifies player by token header
public record PlayRequest(int player, string? user);

public class ScoreEntry
{
    public DateTimeOffset ts { get; init; }
    public string? user { get; init; } // snapshot name at time of game
    public int userId { get; init; } // internal server-side numeric id
    public int player { get; init; }
    public int computer { get; init; }
    public string results { get; init; } = "tie";
}

public record PlayerDto(Guid token, string name);
public record PlayerScoreDto(string name, int wins, int loses, int ties, int total);
