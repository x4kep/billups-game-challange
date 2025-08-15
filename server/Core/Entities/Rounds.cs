namespace server.Core.Entities;

public class Round
{
    public DateTimeOffset Timestamp { get; init; }
    public int UserId { get; init; }
    public string? SnapshotName { get; init; }
    public int PlayerChoice { get; init; }
    public int ComputerChoice { get; init; }
    public string Result { get; init; } = "tie"; 
}
