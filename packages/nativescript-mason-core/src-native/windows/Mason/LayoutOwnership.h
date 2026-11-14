#pragma once
#include <winrt/Microsoft.UI.Xaml.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/NativeScript.Mason.h>

// A foreign native container owns an independent Mason tree. Only wrappers
// explicitly mirrored by SyncChildren may connect two Mason panels.
namespace mason_ownership
{
    inline winrt::Microsoft::UI::Xaml::FrameworkElement ParentOf(
        winrt::Microsoft::UI::Xaml::FrameworkElement const& element)
    {
        namespace mux = winrt::Microsoft::UI::Xaml;
        namespace muxc = winrt::Microsoft::UI::Xaml::Controls;
        namespace nsm = winrt::NativeScript::Mason;
        if (!element) return nullptr;
        auto parent = element.Parent();
        if (auto scroll = parent.try_as<muxc::ScrollViewer>();
            scroll && scroll.Content().try_as<mux::FrameworkElement>() == element)
        {
            // SyncChildren mirrors the content node in place of its scroller.
            parent = scroll.Parent();
        }
        else if (parent.try_as<nsm::FixedLayer>())
        {
            // FixedSlot retains the node in this layer owner's computed tree.
            parent = parent.as<mux::FrameworkElement>().Parent();
        }
        return parent.try_as<nsm::IMasonElement>() ? parent.try_as<mux::FrameworkElement>() : nullptr;
    }
}
