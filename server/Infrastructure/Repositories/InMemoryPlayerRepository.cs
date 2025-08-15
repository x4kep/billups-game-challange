using System.Collections.Concurrent;
using server.Core.Entities;
using server.Core.Repositories;

namespace server.Infrastructure.Repositories;

public class InMemoryPlayerRepository : IPlayerRepository
{
    private readonly ConcurrentDictionary<Guid, Player> _byToken = new();
    private int _seq = 0;

    public Player CreateGuest()
    {
        var token = Guid.NewGuid();
        var id = Interlocked.Increment(ref _seq);
        var player = new Player { Id = id, Token = token, Name = $"guest-{Random.Shared.Next(1000,9999)}" };
        _byToken[token] = player;
        return player;
    }

    public Player? GetByToken(Guid token)
        => _byToken.TryGetValue(token, out var p) ? p : null;

    public Player? GetById(int id)
        => _byToken.Values.FirstOrDefault(p => p.Id == id);

    public IEnumerable<Player> GetAll() => _byToken.Values.ToArray();

    public bool Rename(int id, string newName)
    {
        newName = (newName ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(newName)) return false;
        var player = _byToken.Values.FirstOrDefault(p => p.Id == id);
        if (player == null) return false;
        player.Name = newName;
        return true;
    }
}
