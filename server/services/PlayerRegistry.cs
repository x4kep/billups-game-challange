using System.Collections.Concurrent;

namespace server.Services;

public class PlayerRegistry : IPlayerRegistry
{
    private readonly ConcurrentDictionary<Guid, (int id, string name)> _players = new();
    private int _idSeq = 0;

    public PlayerDto CreateGuest()
    {
        var token = Guid.NewGuid();
        var name = $"guest-{Random.Shared.Next(1000,9999)}";
        var id = Interlocked.Increment(ref _idSeq);
        _players[token] = (id, name);
        return new PlayerDto(token, name);
    }

    public bool TryGet(Guid token, out PlayerDto player)
    {
        if (_players.TryGetValue(token, out var tuple))
        {
            player = new PlayerDto(token, tuple.name);
            return true;
        }
        player = default!;
        return false;
    }

    public bool Rename(Guid token, string name, out PlayerDto updated)
    {
        name = (name ?? "").Trim();
        if (string.IsNullOrWhiteSpace(name))
        {
            updated = default!;
            return false;
        }
        if (_players.TryGetValue(token, out var tuple))
        {
            _players[token] = (tuple.id, name);
            updated = new PlayerDto(token, name);
            return true;
        }
        updated = default!;
        return false;
    }

    public IEnumerable<PlayerDto> GetAll() => _players.Select(kvp => new PlayerDto(kvp.Key, kvp.Value.name));

    // internal helper to obtain userId for storage
    public bool TryGetInternalId(Guid token, out int id)
    {
        if (_players.TryGetValue(token, out var tuple))
        {
            id = tuple.id;
            return true;
        }
        id = 0;
        return false;
    }
}
