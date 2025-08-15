using server.Core.Entities;

namespace server.Core.Repositories;

public interface IRoundRepository
{
    void Add(Round round);
    IEnumerable<Round> GetRecent(int count);
    IEnumerable<Round> GetByUser(int userId, int count);
    IEnumerable<Round> GetAll();
    void Clear();
}
