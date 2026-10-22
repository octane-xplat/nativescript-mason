// Core-only child ownership. Text runs and HTML placeholders are owned by the
// full package. Injected into its otherwise preserved ViewBase source at build time.
export const containerMembers = `
  _children: NSView[] = [];

  private _masonCheckChild(child: NSView): void {
    if (!(child instanceof NSView)) throw new TypeError('Mason core children must be NativeScript views.');
    if (child.parent) throw new Error('Remove the child from its parent before inserting it.');
    for (let ancestor: NSViewBase = this; ancestor; ancestor = ancestor.parent) {
      if (ancestor === child) throw new Error('A Mason core container cannot contain itself or an ancestor.');
    }
  }

  addChild(child: NSView): void {
    this.insertChild(child, this._children.length);
  }

  insertBefore(child: NSView, reference?: NSView | null): void {
    const index = reference == null ? this._children.length : this._children.indexOf(reference);
    if (index < 0) throw new Error('The reference view is not a child of this container.');
    this.insertChild(child, index);
  }

  insertChild(child: NSView, atIndex: number): void {
    this._masonCheckChild(child);
    if (!Number.isInteger(atIndex) || atIndex < 0 || atIndex > this._children.length) {
      throw new RangeError('The child index is outside the container.');
    }
    this._masonSettleNativeAdds();
    this._invalidateAttachCursor();
    this._children.splice(atIndex, 0, child);
    try {
      this._addView(child, atIndex);
    } catch (error) {
      this._children.splice(atIndex, 1);
      throw error;
    }
  }

  replaceChild(child: NSView, atIndex: number): void {
    const previous = this._children[atIndex];
    if (!Number.isInteger(atIndex) || !previous) throw new RangeError('The child index is outside the container.');
    if (child === previous) return;
    this._masonCheckChild(child);
    this.removeChild(previous);
    this.insertChild(child, atIndex);
  }

  removeChild(child: NSView): void {
    const index = this._children.indexOf(child);
    if (index < 0) return;
    this._masonSettleNativeAdds();
    this._invalidateAttachCursor();
    this._children.splice(index, 1);
    this._removeView(child);
  }

  removeChildren(): void {
    this._masonSettleNativeAdds();
    this._invalidateAttachCursor();
    while (this._children.length) this._removeView(this._children.pop());
    this.requestLayout();
  }

  private _nativeIndexFor(atIndex: number): number {
    let count = 0;
    for (let index = 0; index < Math.min(atIndex, this._children.length); index++) {
      if ((this._children[index] as any)._isMasonChild) count++;
    }
    return count;
  }
`;
