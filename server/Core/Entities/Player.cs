namespace server.Core.Entities;

public class Player
{
    public int Id { get; init; }
    public Guid Token { get; init; }
    public string Name { get; set; } = string.Empty;
}
