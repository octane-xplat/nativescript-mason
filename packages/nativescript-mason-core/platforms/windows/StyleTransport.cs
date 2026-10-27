using System;
using System.Text.Json;

namespace NativeScript.MasonCore;

// alpha.144's bridge turns JS arrays into strings for projected byte[] args.
// Keep that workaround local to core instead of patching the runtime globally.
public static class StyleTransport
{
    private static byte[] Decode(string json)
    {
        var values = JsonSerializer.Deserialize<int[]>(json) ?? throw new ArgumentException("Missing style bytes", nameof(json));
        var bytes = new byte[values.Length];
        for (var i = 0; i < values.Length; i++) bytes[i] = checked((byte)values[i]);
        return bytes;
    }

    // CsWinRT makes IMasonElement.Style explicit because XAML also owns Style.
    public static global::NativeScript.Mason.Style GetStyle(global::NativeScript.Mason.IMasonElement element) => element.Style;

    public static void WriteStyleValues(global::NativeScript.Mason.IMasonElement element, string json) =>
        global::NativeScript.Mason.Mason.Instance().WriteStyleValues(element, Decode(json));

    public static void WriteForeignStyleValuesPtr(long pointer, string json) =>
        global::NativeScript.Mason.Mason.Instance().WriteForeignStyleValuesPtr(pointer, Decode(json));

    public static void WritePseudoStyleValues(global::NativeScript.Mason.Node node, uint flags, string json) =>
        global::NativeScript.Mason.Mason.Instance().WritePseudoStyleValues(node, flags, Decode(json));
}
