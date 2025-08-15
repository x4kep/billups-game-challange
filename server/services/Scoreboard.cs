namespace server.Services;

public class Scoreboard : IScoreboard
{
    private readonly List<ScoreEntry> _scores = new();
    private readonly object _gate = new();

    public void Append(ScoreEntry entry)
    {
        lock (_gate)
        {
            _scores.Add(entry);
            if (_scores.Count > 10)
                _scores.RemoveAt(0);
        }
    }

    public IEnumerable<ScoreEntry> GetLast(int n, string? user)
    {
        lock (_gate)
        {
            IEnumerable<ScoreEntry> q = _scores;
            if (!string.IsNullOrWhiteSpace(user))
                q = q.Where(s => string.Equals(s.user, user, StringComparison.OrdinalIgnoreCase));
            return q.TakeLast(n).ToArray(); // return a copy
        }
    }

    public void Reset()
    {
        lock (_gate)
        {
            _scores.Clear();
        }
    }
    public IEnumerable<PlayerScoreDto> GetPlayerScores()
    {
        lock (_gate)
        {
            var groups = _scores
                .GroupBy(s => s.user)
                .Select(g => new PlayerScoreDto(
                    name: g.LastOrDefault()?.user ?? "guest",
                    wins: g.Count(x => x.results == "win"),
                    loses: g.Count(x => x.results == "lose"),
                    ties: g.Count(x => x.results == "tie"),
                    total: g.Count()
                ))
                .OrderByDescending(p => p.wins)
                .ThenBy(p => p.name)
                .ToArray();
            return groups;
        }
    }
}
