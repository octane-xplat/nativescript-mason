import type { View } from '@nativescript/core';
import type { CssEnvironmentSource } from './css-environment';

// Desktop windows have no display-cutout safe area: env() insets stay null and
// the source only re-reads when the view's layout context changes.
export function nativeCssEnvironmentSource(view: View): CssEnvironmentSource {
  return {
    read() {
      return null;
    },
    subscribe(changed) {
      const select = () => changed();
      view.on('layoutChanged', select);
      select();
      return () => { view.off('layoutChanged', select); };
    },
  };
}
