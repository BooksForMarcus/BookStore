namespace BookStore.Helpers;

using System.Linq.Expressions;

public static class BookHelper
{
    public static float GetBookWeight(int pages)
    {
        if(pages < 1) return 0;
        //book weight formula from: https://www.arkitektkopia.se/akademi/sa-raknar-du-ut-vikten-pa-trycksaken/
        //paper size from:https://www.arkitektkopia.se/akademi/pappersformat-vilken-pappersstorlek-ska-man-valja/

        //to simplify, we assume all books are printed on the same paper quality.
        const int paperWeightInGramsPerSquareMeter = 130;
        //to simplify, we assume all books are printed on same size paper, A5 - 148x210mm.
        const float paperHeightInMeters = 0.210f;
        const float paperWidthInMeters = 0.148f;
        const float paperAreaInSquareMeters = paperHeightInMeters * paperWidthInMeters;
        
        var weightInGrams = pages / 2 * paperAreaInSquareMeters * paperWeightInGramsPerSquareMeter;
        return weightInGrams;
    }

    public static int GetPostagePrice(float weightInGrams) => weightInGrams switch
    {
        //simplification based on PostNord prices
        //for the sake of this school project, we will assume we can
        //use the cheapest available method for a given weight, either send
        //as a letter or package from the following pages:
        //https://www.postnord.se/skicka-forsandelser/priser-och-villkor/portotabeller/portotabell-brev-inrikes
        //https://www.postnord.se/skicka-forsandelser/priser-och-villkor/portotabeller/portotabell-paket-inrikes
        <= 0 => 0,
        <= 50f => 13,
        <= 100f => 26,
        <= 250f => 52,
        <= 500f => 78,
        <= 1000f => 91,
        <= 2000f => 104,
        <= 3000f => 142,
        <= 5000f => 169,
        <= 10000f => 224,
        <= 15000f => 265,
        <= 20000f => 310,
        //if weight is greater than 20kg, we will assume it is a package and just charge 1000 kr.
        _ => 1000
    };
}