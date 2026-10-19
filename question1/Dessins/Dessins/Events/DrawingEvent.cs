using System.Text.Json.Serialization;

namespace Dessins.Events
{
    [JsonDerivedType(typeof(DrawCircle))]
    [JsonDerivedType(typeof(DrawStar))]
    [JsonDerivedType(typeof(DrawSquare))]
    [JsonDerivedType(typeof(Wait))]
    [JsonDerivedType(typeof(ChangeColor))]
    public abstract class DrawingEvent
    {
        public abstract string Type { get; }

        public List<DrawingEvent>? DrawingEvents { get; set; } = null;
    }
}
