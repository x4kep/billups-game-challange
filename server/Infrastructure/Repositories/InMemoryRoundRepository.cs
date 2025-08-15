using System.Collections.Concurrent;
using server.Core.Entities;
using server.Core.Repositories;

namespace server.Infrastructure.Repositories;

public class InMemoryRoundRepository : IRoundRepository
{
    private readonly ConcurrentQueue<Round> _rounds = new();
    private readonly object _gate = new();
    private const int MaxStore = 1000; // limit memory

    public void Add(Round round)
    {
        _rounds.Enqueue(round);
        // simple trimming
        if (_rounds.Count > MaxStore)
        {
            lock (_gate)
            {
                while (_rounds.Count > MaxStore && _rounds.TryDequeue(out _)) { }
            }
        }
    }

    public IEnumerable<Round> GetRecent(int count)
        => _rounds.Reverse().Take(count).ToArray();

    public IEnumerable<Round> GetByUser(int userId, int count)
        => _rounds.Where(r => r.UserId == userId).Reverse().Take(count).ToArray();

    public IEnumerable<Round> GetAll() => _rounds.ToArray();

    public void Clear()
    {
        while (_rounds.TryDequeue(out _)) { }
    }
}
