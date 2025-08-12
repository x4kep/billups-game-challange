namespace server.Services;

public interface IGameService
{
    string Judge(int player, int computer);
    int MapRandomToChoiceId(int n);
    IReadOnlyList<(int id, string name)> GetChoices();
}