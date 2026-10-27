#include "pch.h"
#include "Mason.h"
#include "Mason.g.cpp"
#include "Node.h"
#include "Css.h"
#include "PanelCore.h"
#include "Events.h"
#include <winrt/Windows.Storage.Streams.h>

using namespace winrt;

namespace
{
    namespace nsm = winrt::NativeScript::Mason;
}

namespace winrt::NativeScript::Mason::implementation
{
    Mason::Mason()
    {
        m_ptr = mason_init();
    }

    Mason::~Mason()
    {
        if (m_ptr != nullptr)
        {
            mason_release(m_ptr);
            m_ptr = nullptr;
        }
    }

    nsm::Mason Mason::Instance()
    {
        static nsm::Mason s_instance = winrt::make<Mason>();
        return s_instance;
    }

    void Mason::Clear()
    {
        mason_clear(m_ptr);
    }

    void Mason::SetDeviceScale(float scale)
    {
        mason_set_device_scale(m_ptr, scale);
    }

    bool Mason::Preflight()
    {
        return mason_get_preflight();
    }

    void Mason::Preflight(bool value)
    {
        // Sets the global flag and re-seeds this engine's arena defaults.
        mason_set_preflight(m_ptr, value);
    }

    nsm::Node Mason::CreateNode(bool anonymous)
    {
        auto keepAlive = get_strong().as<winrt::Windows::Foundation::IInspectable>();
        return winrt::make<implementation::Node>(keepAlive, m_ptr, mason_node_new_node(m_ptr, anonymous));
    }

    nsm::Node Mason::CreateTextNode(bool anonymous)
    {
        auto keepAlive = get_strong().as<winrt::Windows::Foundation::IInspectable>();
        return winrt::make<implementation::Node>(keepAlive, m_ptr, mason_node_new_text_node(m_ptr, anonymous));
    }

    nsm::Node Mason::CreateImageNode()
    {
        auto keepAlive = get_strong().as<winrt::Windows::Foundation::IInspectable>();
        return winrt::make<implementation::Node>(keepAlive, m_ptr, mason_node_new_image_node(m_ptr));
    }

    nsm::Node Mason::CreateButtonNode()
    {
        auto keepAlive = get_strong().as<winrt::Windows::Foundation::IInspectable>();
        return winrt::make<implementation::Node>(keepAlive, m_ptr, mason_node_new_button_node(m_ptr));
    }

    nsm::Node Mason::CreateLineBreakNode()
    {
        auto keepAlive = get_strong().as<winrt::Windows::Foundation::IInspectable>();
        return winrt::make<implementation::Node>(keepAlive, m_ptr, mason_node_new_line_break_node(m_ptr));
    }

    nsm::Node Mason::CreateListItemNode()
    {
        auto keepAlive = get_strong().as<winrt::Windows::Foundation::IInspectable>();
        return winrt::make<implementation::Node>(keepAlive, m_ptr, mason_node_new_list_item_node(m_ptr));
    }

    void Mason::PrintTree(nsm::Node const& node)
    {
        if (!node) return;
        mason_print_tree(m_ptr, winrt::get_self<implementation::Node>(node)->NodePtr());
    }

    winrt::Windows::Storage::Streams::IBuffer Mason::StyleValues(nsm::IMasonElement const& element)
    {
        if (!element) return nullptr;
        auto node = element.Node();
        return node ? node.Style().Values() : nullptr;
    }

    winrt::Windows::Storage::Streams::IBuffer Mason::ForeignStyleValues(winrt::Microsoft::UI::Xaml::UIElement const& element)
    {
        if (!element) return nullptr;
        return mason_panel::ForeignLeaf(*this, element).Style().Values();
    }

    void Mason::SyncForeignStyle(winrt::Microsoft::UI::Xaml::UIElement const& element, int32_t d0, int32_t d1, int32_t d2, int32_t d3)
    {
        if (!element) return;
        if (!mason_leaf::AnyDirty(mason_leaf::DirtyWords(d0, d1, d2, d3), mason_leaf::kLayoutKeys)) return;
        mason_leaf::StyleChanged(element, mason_panel::ForeignLeaf(*this, element));
    }

    static winrt::com_array<uint8_t> CopyStyleData(::CMason* mason, ::CMasonNode* node)
    {
        if (!node) return {};
        uintptr_t len = 0;
        const uint8_t* data = mason_style_get_style_data(mason, node, &len);
        if (!data || len == 0) return {};
        return winrt::com_array<uint8_t>(data, data + len);
    }

    static void WriteStyleData(::CMason* mason, ::CMasonNode* node, winrt::array_view<uint8_t const> values)
    {
        if (!node || values.size() == 0) return;
        mason_style_prepare_style_for_mut(mason, node);
        ::CMasonBuffer* buf = mason_style_get_style_buffer(mason, node);
        if (!buf) return;
        const uint32_t copy = buf->size < values.size() ? static_cast<uint32_t>(buf->size) : static_cast<uint32_t>(values.size());
        memcpy(buf->data, values.data(), copy);
        mason_style_release_style_buffer(buf);
    }

    winrt::com_array<uint8_t> Mason::ReadStyleValues(winrt::NativeScript::Mason::IMasonElement const& element)
    {
        if (!element) return {};
        auto node = element.Node();
        if (!node) return {};
        return CopyStyleData(m_ptr, winrt::get_self<implementation::Node>(node)->NodePtr());
    }

    void Mason::WriteStyleValues(winrt::NativeScript::Mason::IMasonElement const& element, winrt::array_view<uint8_t const> values)
    {
        if (!element) return;
        auto node = element.Node();
        if (!node) return;
        WriteStyleData(m_ptr, winrt::get_self<implementation::Node>(node)->NodePtr(), values);
    }

    winrt::com_array<uint8_t> Mason::ReadForeignStyleValues(winrt::Microsoft::UI::Xaml::UIElement const& element)
    {
        if (!element) return {};
        auto node = mason_panel::ForeignLeaf(*this, element);
        return CopyStyleData(m_ptr, winrt::get_self<implementation::Node>(node)->NodePtr());
    }

    void Mason::WriteForeignStyleValues(winrt::Microsoft::UI::Xaml::UIElement const& element, winrt::array_view<uint8_t const> values)
    {
        if (!element) return;
        auto node = mason_panel::ForeignLeaf(*this, element);
        WriteStyleData(m_ptr, winrt::get_self<implementation::Node>(node)->NodePtr(), values);
    }

    winrt::com_array<uint8_t> Mason::ReadNodeStyleValues(winrt::NativeScript::Mason::Node const& node)
    {
        if (!node) return {};
        return CopyStyleData(m_ptr, winrt::get_self<implementation::Node>(node)->NodePtr());
    }

    void Mason::WriteNodeStyleValues(winrt::NativeScript::Mason::Node const& node, winrt::array_view<uint8_t const> values)
    {
        if (!node) return;
        WriteStyleData(m_ptr, winrt::get_self<implementation::Node>(node)->NodePtr(), values);
    }

    winrt::com_array<uint8_t> Mason::ReadPseudoStyleValues(winrt::NativeScript::Mason::Node const& node, uint32_t flags)
    {
        if (!node) return {};
        auto impl = winrt::get_self<implementation::Node>(node);
        uintptr_t len = 0;
        const uint8_t* data = mason_node_get_pseudo_style_buffer(m_ptr, impl->NodePtr(), static_cast<uint16_t>(flags), &len);
        if (!data || len == 0) return {};
        return winrt::com_array<uint8_t>(data, data + len);
    }

    void Mason::WritePseudoStyleValues(winrt::NativeScript::Mason::Node const& node, uint32_t flags, winrt::array_view<uint8_t const> values)
    {
        if (!node || values.size() == 0) return;
        auto impl = winrt::get_self<implementation::Node>(node);
        uintptr_t len = 0;
        uint8_t* data = mason_node_prepare_pseudo_style_buffer(m_ptr, impl->NodePtr(), static_cast<uint16_t>(flags), &len);
        if (!data || len == 0) return;
        const size_t copy = len < values.size() ? len : values.size();
        memcpy(data, values.data(), copy);
    }

    void Mason::ReparentChild(winrt::Microsoft::UI::Xaml::Controls::Panel const& parent, winrt::Microsoft::UI::Xaml::UIElement const& child, int32_t index)
    {
        Css::ReparentChild(parent, child, index);
    }

    void Mason::RemoveChild(winrt::Microsoft::UI::Xaml::Controls::Panel const& parent, winrt::Microsoft::UI::Xaml::UIElement const& child)
    {
        Css::RemoveChild(parent, child);
    }

    static void SetPercent(winrt::Microsoft::UI::Xaml::UIElement const& element, bool horizontal, float fraction)
    {
        auto fe = element.try_as<winrt::Microsoft::UI::Xaml::FrameworkElement>();
        if (!fe) return;
        fe.SetValue(mason_panel::PercentProperty(horizontal), winrt::box_value(static_cast<double>(fraction)));
        // The parent syncs its children's boxes when it measures.
        if (auto parent = fe.Parent().try_as<winrt::Microsoft::UI::Xaml::UIElement>()) parent.InvalidateMeasure();
        mason_leaf::InvalidateLayoutRoot(element);
    }

    void Mason::SetPercentWidth(winrt::Microsoft::UI::Xaml::UIElement const& element, float fraction)
    {
        SetPercent(element, true, fraction);
    }

    void Mason::SetPercentHeight(winrt::Microsoft::UI::Xaml::UIElement const& element, float fraction)
    {
        SetPercent(element, false, fraction);
    }

    static winrt::Microsoft::UI::Xaml::UIElement UIElementFromPtr(int64_t ptr)
    {
        if (!ptr) return nullptr;
        auto* raw = reinterpret_cast<IUnknown*>(static_cast<uintptr_t>(ptr));
        winrt::com_ptr<IUnknown> unknown;
        unknown.copy_from(raw);
        return unknown ? unknown.as<winrt::Microsoft::UI::Xaml::UIElement>() : nullptr;
    }

    void Mason::ReparentChildPtr(winrt::Microsoft::UI::Xaml::Controls::Panel const& parent, int64_t childPtr, int32_t index)
    {
        auto child = UIElementFromPtr(childPtr);
        if (child) Css::ReparentChild(parent, child, index);
    }

    void Mason::RemoveChildPtr(winrt::Microsoft::UI::Xaml::Controls::Panel const& parent, int64_t childPtr)
    {
        auto child = UIElementFromPtr(childPtr);
        if (child) Css::RemoveChild(parent, child);
    }

    winrt::com_array<uint8_t> Mason::ReadForeignStyleValuesPtr(int64_t elementPtr)
    {
        auto element = UIElementFromPtr(elementPtr);
        if (!element) return {};
        return CopyStyleData(m_ptr, winrt::get_self<implementation::Node>(mason_panel::ForeignLeaf(*this, element))->NodePtr());
    }

    void Mason::WriteForeignStyleValuesPtr(int64_t elementPtr, winrt::array_view<uint8_t const> values)
    {
        auto element = UIElementFromPtr(elementPtr);
        if (!element) return;
        WriteStyleData(m_ptr, winrt::get_self<implementation::Node>(mason_panel::ForeignLeaf(*this, element))->NodePtr(), values);
    }

    void Mason::SyncForeignStylePtr(int64_t elementPtr, int32_t d0, int32_t d1, int32_t d2, int32_t d3)
    {
        auto element = UIElementFromPtr(elementPtr);
        if (!element) return;
        if (!mason_leaf::AnyDirty(mason_leaf::DirtyWords(d0, d1, d2, d3), mason_leaf::kLayoutKeys)) return;
        mason_leaf::StyleChanged(element, mason_panel::ForeignLeaf(*this, element));
    }

    void Mason::SetPercentWidthPtr(int64_t elementPtr, float fraction)
    {
        auto element = UIElementFromPtr(elementPtr);
        if (element) SetPercent(element, true, fraction);
    }

    void Mason::SetPercentHeightPtr(int64_t elementPtr, float fraction)
    {
        auto element = UIElementFromPtr(elementPtr);
        if (element) SetPercent(element, false, fraction);
    }

    int64_t Mason::AddEventListenerPtr(int64_t elementPtr, winrt::hstring const& type, winrt::NativeScript::Mason::EventListener const& listener)
    {
        auto element = UIElementFromPtr(elementPtr);
        return element ? mason_events::Add(element, type, listener) : 0;
    }

    void Mason::RemoveEventListenerPtr(int64_t elementPtr, winrt::hstring const& type, int64_t id)
    {
        auto element = UIElementFromPtr(elementPtr);
        if (element) mason_events::Remove(element, type, id);
    }

    winrt::Windows::Foundation::IInspectable Mason::ElementFromPointPtr(int64_t elementPtr, float x, float y)
    {
        auto element = UIElementFromPtr(elementPtr);
        return element ? mason_events::ElementAt(element, x, y) : nullptr;
    }

    void Mason::PrintElementTree(winrt::NativeScript::Mason::IMasonElement const& element)
    {
        if (!element) return;
        auto node = element.Node();
        if (node) mason_print_tree(m_ptr, winrt::get_self<implementation::Node>(node)->NodePtr());
    }

    int64_t Mason::AddEventListener(winrt::Microsoft::UI::Xaml::UIElement const& element, hstring const& type, nsm::EventListener const& listener)
    {
        return mason_events::Add(element, type, listener);
    }

    winrt::Windows::Foundation::IInspectable Mason::ElementFromPoint(winrt::Microsoft::UI::Xaml::UIElement const& element, float x, float y)
    {
        return mason_events::ElementAt(element, x, y);
    }

    void Mason::RemoveEventListener(winrt::Microsoft::UI::Xaml::UIElement const& element, hstring const& type, int64_t id)
    {
        mason_events::Remove(element, type, id);
    }

    double Mason::ScrollLeft(winrt::Microsoft::UI::Xaml::UIElement const& element)
    {
        return mason_scroll::Offset(element, false);
    }

    double Mason::ScrollTop(winrt::Microsoft::UI::Xaml::UIElement const& element)
    {
        return mason_scroll::Offset(element, true);
    }

    double Mason::ScrollWidth(winrt::Microsoft::UI::Xaml::UIElement const& element)
    {
        return mason_scroll::ScrollSize(element, false);
    }

    double Mason::ScrollHeight(winrt::Microsoft::UI::Xaml::UIElement const& element)
    {
        return mason_scroll::ScrollSize(element, true);
    }

    double Mason::ClientWidth(winrt::Microsoft::UI::Xaml::UIElement const& element)
    {
        return mason_scroll::ClientSize(element, false);
    }

    double Mason::ClientHeight(winrt::Microsoft::UI::Xaml::UIElement const& element)
    {
        return mason_scroll::ClientSize(element, true);
    }

    void Mason::ScrollTo(winrt::Microsoft::UI::Xaml::UIElement const& element, double left, double top, bool smooth)
    {
        mason_scroll::ScrollTo(element, left, top, smooth);
    }

    void Mason::ScrollIntoView(winrt::Microsoft::UI::Xaml::UIElement const& element, int32_t block, int32_t inlineMode, bool smooth)
    {
        mason_scroll::ScrollIntoView(element, block, inlineMode, smooth);
    }
}
