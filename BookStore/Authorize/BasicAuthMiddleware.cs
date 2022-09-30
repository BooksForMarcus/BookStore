namespace BookStore.Authorize;

using BookStore.DbAccess;
using BookStore.DTO;
using System.Net.Http.Headers;
using System.Text;

public class BasicAuthMiddleware
{
    private readonly RequestDelegate _next;

    public BasicAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, CustomerCrud customerCrud)
    {
        try
        {
            var authHeader = AuthenticationHeaderValue.Parse(context.Request.Headers["Authorization"]);
            var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
            var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':', 2);
            var username = credentials[0];
            var password = credentials[1];

            // authenticate credentials with user service and attach user to http context
            //important change comment
            var auth = new CustomerAuthorize() { Email = username, Password = password };
            var resp = await customerCrud.Login(auth);
            if (resp.Success)
                context.Items["Customer"] = resp.User;
        }
        catch
        {
            // do nothing if invalid auth header
            // user is not attached to context so request won't have access to secure routes
        }

        await _next(context);
    }
}