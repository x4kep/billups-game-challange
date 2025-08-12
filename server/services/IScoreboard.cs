namespace server.Services;

public interface IScoreboard
{
    void Append(ScoreEntry entry);
    IEnumerable<ScoreEntry> GetLast(int n, string? user);
    void Reset();
}