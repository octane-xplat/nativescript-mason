using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Windows.Foundation;
using Microsoft.UI.Xaml.Documents;
using Microsoft.UI.Xaml.Media;
using System.Text;
using Microsoft.UI.Xaml.Automation.Peers;

namespace NativeScript.MasonQualification;

// Fixture-only access to synchronous diagnostics and native XAML observations.
// Pointer arguments avoid the preview bridge's projected-runtimeclass casts.
public static class Result
{
    public static void Write(string path, string json) => System.IO.File.WriteAllText(path, json);

    private static UIElement Element(long pointer) => UIElement.FromAbi((System.IntPtr)pointer);

    public static double[] Box(long pointer, long relative)
    {
        if (pointer == 0) return new[] { double.NaN, double.NaN, 0, 0 };
        var element = (FrameworkElement)Element(pointer);
        if (!element.IsLoaded) return new[] { double.NaN, double.NaN, element.ActualWidth, element.ActualHeight };
        var position = element.TransformToVisual(relative == 0 ? null : Element(relative)).TransformPoint(new Point(0, 0));
        return new[] { position.X, position.Y, element.ActualWidth, element.ActualHeight };
    }

    public static double[] ScreenBox(long pointer)
    {
        var element = (FrameworkElement)Element(pointer);
        var peer = FrameworkElementAutomationPeer.CreatePeerForElement(element)
            ?? throw new System.InvalidOperationException("Scroll viewport has no native automation peer");
        var rect = peer.GetBoundingRectangle();
        return new[] { rect.X, rect.Y, rect.Width, rect.Height, element.XamlRoot.RasterizationScale };
    }

    public static double[] StyleDimensions(long pointer)
    {
        var view = NativeScript.Mason.View.FromAbi((System.IntPtr)pointer);
        var bytes = NativeScript.Mason.Mason.Instance().ReadStyleValues(view);
        return new double[] { bytes[106], bytes[107], System.BitConverter.ToSingle(bytes, 108), System.BitConverter.ToSingle(bytes, 112), bytes.Length };
    }

    private static string InlineText(InlineCollection inlines)
    {
        var text = new StringBuilder();
        foreach (var inline in inlines)
        {
            if (inline is Run run) text.Append(run.Text);
            else if (inline is Span span) text.Append(InlineText(span.Inlines));
            else if (inline is LineBreak) text.Append('\n');
        }
        return text.ToString();
    }

    private static string ReadText(DependencyObject element)
    {
        if (element is TextBlock block) return block.Text.Length > 0 ? block.Text : InlineText(block.Inlines);
        if (element is RichTextBlock rich)
        {
            var text = new StringBuilder();
            foreach (var paragraph in rich.Blocks) if (paragraph is Paragraph p) text.Append(InlineText(p.Inlines));
            return text.ToString();
        }
        var children = new StringBuilder();
        for (var i = 0; i < VisualTreeHelper.GetChildrenCount(element); i++) children.Append(ReadText(VisualTreeHelper.GetChild(element, i)));
        return children.ToString();
    }

    public static string NativeText(long pointer) => ReadText(Element(pointer));

    public static int ChildIndex(long parent, long child) => ((Panel)Element(parent)).Children.IndexOf(Element(child));
    public static int ChildCount(long parent) => ((Panel)Element(parent)).Children.Count;
    public static bool Detached(long pointer) => pointer == 0 || ((FrameworkElement)Element(pointer)).Parent == null;
}
