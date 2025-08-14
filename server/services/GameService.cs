namespace server.Services;

public class GameService : IGameService
{
    public static readonly ChoiceDto[] Choices =
    [
        new((int)GameChoice.Rock, GameChoice.Rock.ToString().ToLower()),
        new((int)GameChoice.Paper, GameChoice.Paper.ToString().ToLower()),
        new((int)GameChoice.Scissors, GameChoice.Scissors.ToString().ToLower()),
        new((int)GameChoice.Lizard, GameChoice.Lizard.ToString().ToLower()),
        new((int)GameChoice.Spock, GameChoice.Spock.ToString().ToLower()),
    ];

    private static readonly Dictionary<int, int[]> Beats = new()
    {
        [(int)GameChoice.Rock] = new[] { (int)GameChoice.Scissors, (int)GameChoice.Lizard },
        [(int)GameChoice.Paper] = new[] { (int)GameChoice.Rock, (int)GameChoice.Spock },
        [(int)GameChoice.Scissors] = new[] { (int)GameChoice.Paper, (int)GameChoice.Lizard },
        [(int)GameChoice.Lizard] = new[] { (int)GameChoice.Spock, (int)GameChoice.Paper },
        [(int)GameChoice.Spock] = new[] { (int)GameChoice.Scissors, (int)GameChoice.Rock },
    };

    public IReadOnlyList<(int id, string name)> GetChoices()
        => Choices.Select(c => (c.id, c.name)).ToList();

    public int MapRandomToChoiceId(int n)
    {
        // 1..20 -> 1, 21..40 -> 2, 41..60 -> 3, 61..80 -> 4, 81..100 -> 5 
        if (n < 1) n = 1; 
        if (n > 100) n = 100;
        
        if (n <= 20) return 1;
        if (n <= 40) return 2;
        if (n <= 60) return 3;
        if (n <= 80) return 4;
        return 5;
    }

    public string Judge(int player, int computer)
    {
        if (player == computer) return GameResult.Tie.ToString().ToLower();
        if (Beats[player].Contains(computer)) return GameResult.Win.ToString().ToLower();
        return GameResult.Lose.ToString().ToLower();
    }
}
