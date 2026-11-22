#pragma once
#include <functional>
#include <limits>
#include <string_view>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Microsoft.UI.Xaml.Documents.h>

// Shared intrinsic sizing for Mason text and foreign XAML TextBlocks. Measuring
// at zero width loses the intrinsic width because XAML clamps DesiredSize.
namespace mason_xaml_text
{
    namespace mux = winrt::Microsoft::UI::Xaml;
    namespace muxc = winrt::Microsoft::UI::Xaml::Controls;
    namespace muxd = winrt::Microsoft::UI::Xaml::Documents;

    inline bool IsBreakOpportunity(wchar_t c)
    {
        return c == L' ' || c == L'\t' || c == L'\n' || c == L'\r' || c == 0x200B;
    }

    inline float MinContentWidth(muxc::TextBlock const& text, muxc::TextBlock& probe)
    {
        probe.Text(L"");
        probe.TextWrapping(mux::TextWrapping::NoWrap);
        probe.FontFamily(text.FontFamily());
        probe.FontSize(text.FontSize());
        probe.FontWeight(text.FontWeight());
        probe.FontStyle(text.FontStyle());
        probe.FontStretch(text.FontStretch());
        probe.CharacterSpacing(text.CharacterSpacing());
        probe.FlowDirection(text.FlowDirection());
        probe.Language(text.Language());
        auto pieces = probe.Inlines();
        pieces.Clear();

        bool lineHasText = false;
        auto flush = [&]()
        {
            if (!lineHasText) return;
            pieces.Append(muxd::LineBreak());
            lineHasText = false;
        };
        auto append = [&](std::wstring_view chars, auto const& format)
        {
            size_t start = 0;
            for (size_t i = 0; i <= chars.size(); ++i)
            {
                const bool end = i == chars.size();
                const bool space = !end && IsBreakOpportunity(chars[i]);
                const bool hyphen = !end && chars[i] == L'-';
                if (!end && !space && !hyphen) continue;
                const size_t stop = hyphen ? i + 1 : i;
                if (stop > start)
                {
                    muxd::Run piece;
                    piece.Text(winrt::hstring{ chars.substr(start, stop - start) });
                    piece.FontFamily(format.FontFamily());
                    piece.FontSize(format.FontSize());
                    piece.FontWeight(format.FontWeight());
                    piece.FontStyle(format.FontStyle());
                    piece.FontStretch(format.FontStretch());
                    piece.CharacterSpacing(format.CharacterSpacing());
                    pieces.Append(piece);
                    lineHasText = true;
                }
                if (!end) flush();
                start = i + 1;
            }
        };
        std::function<void(muxd::Inline const&)> visit = [&](muxd::Inline const& inl)
        {
            if (auto run = inl.try_as<muxd::Run>()) append(std::wstring_view{ run.Text() }, run);
            else if (auto span = inl.try_as<muxd::Span>())
                for (auto const& child : span.Inlines()) visit(child);
            else flush();
        };
        if (text.Inlines().Size())
            for (auto const& inl : text.Inlines()) visit(inl);
        else append(std::wstring_view{ text.Text() }, text);

        if (pieces.Size() == 0) return 0.0f;
        const float inf = std::numeric_limits<float>::infinity();
        probe.Measure(winrt::Windows::Foundation::Size{ inf, inf });
        const float widest = probe.DesiredSize().Width;
        pieces.Clear();
        return widest;
    }

    inline float MinContentWidth(muxc::TextBlock const& text)
    {
        // XAML objects must not be released after the thread's XAML teardown.
        // Separate from the Mason text cache's probe: its formatting is cached.
        struct Probe { muxc::TextBlock block; };
        thread_local auto* probe = new Probe{ muxc::TextBlock() };
        return MinContentWidth(text, probe->block);
    }
}
