namespace BookStore.Helpers;

public static class EnvironmentHelper
{
    /// <summary>
    /// Checks if the environment variable "ASPNETCORE_ENVIRONMENT" is set to "Development".
    /// </summary>
    /// <value>
    ///   <see langword="true"/> if this instance is development; otherwise, <see langword="false"/>.
    /// </value>
    public static bool IsDev { get => Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development"; }
}
