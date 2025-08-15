using server.Core.Entities;

namespace server.Core.Repositories;

public interface IPlayerRepository
{
    Player CreateGuest();
    Player? GetByToken(Guid token);
    Player? GetById(int id);
    IEnumerable<Player> GetAll();
    bool Rename(int id, string newName);
}
