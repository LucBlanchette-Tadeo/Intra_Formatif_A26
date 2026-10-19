namespace Dessins.Events
{
    public class DrawStar : DrawingEvent
    {
        public override string Type { get { return "Star"; } }
        public int X { get; set; }
        public int Y { get; set; }

        public int InnerRadius { get; set; }
        
        public DrawStar(int x, int y, int innerRadius)
        {
            X = x;
            Y = y;
            InnerRadius = innerRadius;
        }
    }
}
