namespace BookStore.Helpers;
using System.Net;
using System.Net.Mail;
using System.Text;

public class MailHelper
{
    private string _sender = "";
    private string _pass = "";
    private bool _isDev = false;

    public MailHelper()
    {
        _isDev = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
        if (!_isDev)
        {
            _sender = Environment.GetEnvironmentVariable("mailFrom")!;
            _pass = Environment.GetEnvironmentVariable("mailPass")!;
        }
    }

    public void SendMail(string mailTo,string subject, string msg)
    {
        if (_isDev) return;
        using (SmtpClient client = new())
        {
            client.EnableSsl = true;
            client.Host = "smtp-mail.outlook.com";
            client.Port = 587;

            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(_sender, _pass);
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            using (MailMessage mail = new())
            {
                mail.From = new MailAddress(_sender, "Bokcirkeln");
                mail.To.Add(new MailAddress(mailTo));
                mail.Subject = subject;
                mail.Body = msg;
                mail.BodyEncoding = Encoding.UTF8;
                mail.IsBodyHtml = true;

                client.Send(mail);
            }
        }
    }
}
