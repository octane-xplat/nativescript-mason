  private fun validateCoreChild(child: Node) {
    require(child.mason === mason) { "Mason children must belong to the same engine." }
    var ancestor: Node? = this
    while (ancestor != null) {
      require(ancestor !== child) { "A Mason node cannot contain itself or an ancestor." }
      ancestor = ancestor.parent
    }
  }

  private fun insertCoreChild(child: Node, index: Int, attach: Boolean) {
    validateCoreChild(child)
    var position = if (index < 0) children.size else index.coerceAtMost(children.size)
    val previous = child.parent
    if (previous === this) {
      val oldIndex = children.indexOf(child)
      if (oldIndex >= 0 && oldIndex < position) position--
    }
    previous?.removeChild(child)
    children.add(position, child)
    child.parent = this
    if (child.nativePtr != 0L) {
      val nativePosition = children.take(position).count { it.nativePtr != 0L }
      NativeHelpers.nativeNodeAddChildAt(mason.nativePtr, nativePtr, child.nativePtr, nativePosition)
    }
    if (attach) {
      val viewPosition = children.take(position).count { it.view is View }
      NodeUtils.addView(this, child.view as? View, viewPosition)
    }
    computeCacheDirty = true
    getRootNode()?.computeCacheDirty = true
    onNodeAttached?.invoke()
    NodeUtils.invalidateLayout(this)
  }

  @JvmOverloads
  open fun appendChild(child: Node, attach: Boolean = true) {
    insertCoreChild(child, children.size, attach)
  }

  fun addChildAt(child: Node, index: Int) {
    insertCoreChild(child, index, true)
  }

  fun replaceChildAt(child: Node, index: Int) {
    validateCoreChild(child)
    val previous = children.getOrNull(index)
    if (previous === child) return
    if (previous != null) removeChild(previous)
    insertCoreChild(child, index, true)
  }

  fun removeChildAt(index: Int): Node? {
    val child = children.getOrNull(index) ?: return null
    return removeChild(child)
  }

  fun removeChild(child: Node): Node? {
    if (child.parent !== this || !children.remove(child)) return null
    NodeUtils.removeView(this, child.view as? View)
    if (child.nativePtr != 0L) {
      val reference = NativeHelpers.nativeNodeRemoveChild(mason.nativePtr, nativePtr, child.nativePtr)
      if (reference != 0L) NativeHelpers.nativeNodeDestroy(reference)
    }
    child.parent = null
    (child.view as? Element)?.onNodeDetached()
    NodeUtils.invalidateLayout(this)
    return child
  }
