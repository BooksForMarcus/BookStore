namespace BookStore.Helpers
{
    public static class Validate
    {
        public static bool TitleLongerThan3(string title)
        {
            return (title.Length > 3);
        }
        //public static bool validEmail(string email)
        //{
        //    if (email.Substring((email.Length-4))== "com")
 



        //    return (email.Length > 3);
        //}
    }
}
