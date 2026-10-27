import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fullSourceRoot } from './sources.mjs';

/** Full-package Windows host sources these projections are derived from. */
export const windowsSourceRoot = resolve(fullSourceRoot, 'src-native/windows/Mason');

/** Sources compiled into the core Windows host: layout/style/container/foreign-view
 *  only. Widget leaves, text rendering, automation peers, hyphenation, vertical
 *  text, and form styling stay in the full package. */
export const windowsHostFiles = Object.freeze([
  'pch.h', 'pch.cpp', 'exports.cpp',
  'Layout.h', 'Layout.cpp', 'Layout.idl',
  'Style.h', 'Style.cpp', 'Style.idl', 'StyleKeys.h',
  'Node.h', 'Node.cpp', 'Node.idl',
  'MeasureOutput.h', 'MeasureOutput.cpp',
  'Mason.h', 'Mason.cpp', 'Mason.idl', 'MasonEnums.idl',
  'Invalidation.h', 'LeafCommon.h', 'PanelCore.h',
  'View.h', 'View.cpp', 'View.idl',
  'Event.h', 'Event.cpp', 'Event.idl', 'Events.h', 'Events.cpp',
  'Element.idl',
  'Css.h', 'Css.cpp', 'Css.idl', 'CssImageResult.h', 'CssImageResult.idl',
  'Diagnostics.h', 'Diagnostics.cpp', 'Diagnostics.idl',
  'RoundedColorBrush.h', 'RoundedColorBrush.cpp', 'RoundedColorBrush.idl',
  'FixedLayer.h', 'FixedLayer.cpp', 'FixedLayer.idl',
  'FixedSlot.h', 'FixedSlot.cpp', 'FixedSlot.idl',
  'Positioning.h', 'RoundedMask.h', 'CssMask.h', 'ColorInterpolation.h',
  'SvgPrepare.h', 'SvgRewrite.h', 'SvgSource.h',
  'RootScale.h', 'ScrollHost.h', 'BoxShadow.h', 'BoxShape.h', 'Decoration.h',
  'FilterEffects.h', 'VisualApply.h', 'VisualState.h', 'BufferUtil.h',
]);

function replaceOnce(text, find, replace, file) {
  const count = text.split(find).length - 1;
  if (count !== 1) throw new Error(`${file}: expected 1 occurrence, found ${count}: ${find.slice(0, 60)}`);
  return text.replace(find, replace);
}

const svgTextHelpers = `    // SVG <text> shaping needs only system-font DirectWrite helpers; the full text
    // stack (DWriteText.h) stays in the widget package.
    namespace mason_svgtext
    {
        constexpr float kUnbounded = 100000.0f;

        inline IDWriteFactory5* Factory()
        {
            static IDWriteFactory5* factory = []() -> IDWriteFactory5*
            {
                IDWriteFactory5* created = nullptr;
                if (FAILED(DWriteCreateFactory(DWRITE_FACTORY_TYPE_SHARED, __uuidof(IDWriteFactory5), reinterpret_cast<::IUnknown**>(&created)))) return nullptr;
                return created;
            }();
            return factory;
        }

        inline IDWriteFontCollection* SystemFonts()
        {
            static IDWriteFontCollection* fonts = []() -> IDWriteFontCollection*
            {
                IDWriteFontCollection* collection = nullptr;
                if (auto* factory = Factory()) factory->GetSystemFontCollection(&collection);
                return collection;
            }();
            return fonts;
        }

        inline bool SystemHasFamily(std::wstring const& family)
        {
            UINT32 index = 0;
            BOOL exists = FALSE;
            auto* fonts = SystemFonts();
            return fonts && SUCCEEDED(fonts->FindFamilyName(family.c_str(), &index, &exists)) && exists;
        }

        inline winrt::com_ptr<IDWriteFontFamily> FamilyOf(std::wstring const& name)
        {
            auto* fonts = SystemFonts();
            UINT32 index = 0;
            BOOL exists = FALSE;
            winrt::com_ptr<IDWriteFontFamily> family;
            if (fonts && SUCCEEDED(fonts->FindFamilyName(name.c_str(), &index, &exists)) && exists)
            {
                fonts->GetFontFamily(index, family.put());
            }
            return family;
        }
    }

`;

/** Project one full-package source file into its core-host form. */
export function projectWindowsSource(name) {
  const file = resolve(windowsSourceRoot, name);
  let text = readFileSync(file, 'utf8');

  if (name === 'View.cpp') {
    text = replaceOnce(text, '#include "Text.h"\n#include "SummaryAutomationPeer.h"\n', '', name);
    text = replaceOnce(text, '        // Children added to a closed details since the last pass are hidden before they\'re synced.\n        if (m_role == 1) HideClosedContent(false);\n', '', name);
    text = replaceOnce(text, '        mason_cssmask::RepaintTextClips(get_strong().as<winrt::Microsoft::UI::Xaml::UIElement>(), false);\n', '', name);
    const details = text.indexOf('    // ---- <details> / <summary> ');
    if (details < 0) throw new Error('View.cpp: details/summary section boundary moved.');
    text = text.slice(0, details).trimEnd() + '\n}\n';
  }

  if (name === 'View.h') {
    text = replaceOnce(text, `        int32_t Role() const noexcept { return m_role; }
        void Role(int32_t value);
        bool Open() const noexcept { return m_open; }
        void Open(bool value);
        winrt::NativeScript::Mason::View Details();
        // Toggles the details this summary heads, as a tap does, and raises "toggle".
        void Activate();
        winrt::Microsoft::UI::Xaml::Automation::Peers::AutomationPeer OnCreateAutomationPeer();
`, '', name);
    text = replaceOnce(text, `        int32_t m_role{ 0 };
        bool m_open{ false };
        bool m_tapHooked{ false };

        void HideClosedContent(bool resync);
        void RefreshSummary();
`, '', name);
  }

  if (name === 'View.idl') {
    text = text.replace(/        \/\/ HTML <details>[\s\S]*?View Details\{ get; \};\n/, '');
    if (/Int32 Role|Boolean Open|Details\{ get/.test(text)) throw new Error('View.idl: details/summary members remained after projection.');
  }

  if (name === 'Events.cpp') {
    text = replaceOnce(text, '#include "Text.h"\n', '', name);
    text = replaceOnce(text, `        if (auto text = element.try_as<nsm::Text>())
        {
            if (auto* owner = winrt::get_self<nsm::implementation::Text>(text)->InlineOwner())
            {
                nsm::Text host = *owner;
                return host;
            }
        }
`, '', name);
    text = replaceOnce(text, `            if (auto text = cur.try_as<nsm::Text>())
            {
                auto* impl = winrt::get_self<nsm::implementation::Text>(text);
                if (auto hit = impl->InlineElementAt(e.GetPosition(text))) return hit;
                if (!impl->IsAnonymous()) return text;
            }
            else if (cur.try_as<nsm::IMasonElement>())
`, '            if (cur.try_as<nsm::IMasonElement>())\n', name);
    text = replaceOnce(text, `            const bool text = hit.try_as<nsm::Text>() != nullptr;
            if (!text && !hit.try_as<nsm::IMasonElement>()) continue;
            if (ClippedOut(hit, point)) continue;
            if (text)
            {
                auto* impl = winrt::get_self<nsm::implementation::Text>(hit.as<nsm::Text>());
                if (auto inl = impl->InlineElementAt(hit.TransformToVisual(nullptr).Inverse().TransformPoint(point))) return inl;
                if (!impl->IsAnonymous()) return hit;
                continue;
            }
            return hit;
`, `            if (!hit.try_as<nsm::IMasonElement>()) continue;
            if (ClippedOut(hit, point)) continue;
            return hit;
`, name);
  }

  if (name === 'Positioning.h') {
    text = replaceOnce(text, 'if (!root || !(root.try_as<nsm::View>() || root.try_as<nsm::Li>() || root.try_as<nsm::List>())) return nullptr;',
      'if (!root || !root.try_as<nsm::View>()) return nullptr;', name);
  }

  if (name === 'PanelCore.h') {
    text = replaceOnce(text, '#include "TextAtlas.h"\n', '', name);
    text = replaceOnce(text, `            mason_leaf::t_invalidated.clear();
            // Every text arranged in this pass is drawn in one go.
            mason_atlas::Flush();
`, '            mason_leaf::t_invalidated.clear();\n', name);
  }

  if (name === 'SvgRewrite.h') {
    text = replaceOnce(text, '#include "DWriteText.h"\n', '', name);
    const anchor = '    // ---- Text ';
    const at = text.indexOf(anchor);
    if (at < 0) throw new Error('SvgRewrite.h: text section anchor moved.');
    text = text.slice(0, at) + svgTextHelpers + text.slice(at);
    for (const [from, to] of [
      ['mason_dwrite::SystemHasFamily(f)', 'mason_svgtext::SystemHasFamily(f)'],
      ['auto* factory = mason_dwrite::Factory();', 'auto* factory = mason_svgtext::Factory();'],
      ['mason_dwrite::kUnbounded, mason_dwrite::kUnbounded', 'mason_svgtext::kUnbounded, mason_svgtext::kUnbounded'],
      ['mason_dwrite::FamilyOf(mason_dwrite::Font{ nullptr, family })', 'mason_svgtext::FamilyOf(family)'],
    ]) {
      if (text.includes(from)) text = text.split(from).join(to);
    }
    if (text.includes('mason_dwrite::')) throw new Error('SvgRewrite.h: unprojected mason_dwrite use remains.');
  }

  return text;
}
