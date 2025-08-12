public record RandomDto(int random_number);
public record ChoiceDto(int id, string name);
public record PlayRequest(int player, string? user);

public class ScoreEntry
{
    public DateTimeOffset ts { get; init; }
    public string? user { get; init; }
    public int player { get; init; }
    public int computer { get; init; }
    public string results { get; init; } = "tie";
}
