namespace server.Services;

public interface IPlayerRegistry
{
    PlayerDto CreateGuest();
    bool TryGet(Guid token, out PlayerDto player);
    bool Rename(Guid token, string name, out PlayerDto updated);
    IEnumerable<PlayerDto> GetAll();
    bool TryGetInternalId(Guid token, out int id); // internal id not exposed to client normally
}
