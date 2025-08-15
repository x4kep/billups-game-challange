using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;

public static class PlayerTokenAuth
{
    public static IApplicationBuilder UsePlayerTokenAuth(this IApplicationBuilder app)
    {
        app.Use(async (ctx, next) =>
        {
            var path = ctx.Request.Path.Value?.ToLowerInvariant() ?? string.Empty;
            bool isGuestCreate = path == "/api/players/guest";
            if (path.StartsWith("/api/") && !isGuestCreate)
            {
                if (!ctx.Request.Headers.TryGetValue("X-Player-Token", out var vals) ||
                    !Guid.TryParse(vals.FirstOrDefault(), out var token))
                {
                    ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await ctx.Response.WriteAsJsonAsync(new { message = "unauthorized" });
                    return;
                }
            }
            await next();
        });

        return app;
    }
}
