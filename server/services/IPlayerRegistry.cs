namespace server.Services;

public interface IPlayerRegistry
{
    PlayerDto CreateGuest();
    bool TryGet(Guid token, out PlayerDto player);
    IEnumerable<PlayerDto> GetAll();
    bool TryGetInternalId(Guid token, out int id); // internal id not exposed to client normally
}
