// Core-only node operations. The measurement methods and C ownership rules
// remain shared with MasonKit; no text runs or anonymous text views are created.
extension MasonNode {
  public func appendChild(_ child: MasonNode) {
    addChildAt(child, children.count)
  }

  internal func addChildAt(_ child: MasonNode, _ index: Int) {
    precondition(child.mason === mason, "Mason nodes must belong to the same engine")
    var ancestor: MasonNode? = self
    while let current = ancestor {
      precondition(current !== child, "A node cannot contain itself or an ancestor")
      ancestor = current.parent
    }
    if let previous = child.parent { _ = previous.removeChild(child) }
    let position = index < 0 ? children.count : min(index, children.count)
    children.insert(child, at: position)
    child.parent = self
    mason_node_add_child_at(mason.nativePtr, nativePtr, child.nativePtr, UInt(position))
    NodeUtils.addView(self, child.view, position)
    NodeUtils.invalidateLayout(self)
    onNodeAttached?()
  }

  internal func replaceChildAt(_ child: MasonNode, _ index: Int) {
    guard children.indices.contains(index) else { return }
    if children[index] === child { return }
    _ = removeChildAt(index: index)
    addChildAt(child, index)
  }

  @discardableResult
  func removeChild(_ child: MasonNode) -> MasonNode? {
    guard child.parent === self, let index = children.firstIndex(of: child) else { return nil }
    return removeChildAt(index: index)
  }

  @discardableResult
  internal func removeChildAt(index: Int) -> MasonNode? {
    guard children.indices.contains(index) else { return nil }
    let removed = children.remove(at: index)
    if let reference = mason_node_remove_child(mason.nativePtr, nativePtr, removed.nativePtr) {
      mason_node_destroy(reference)
    }
    removed.parent = nil
    NodeUtils.removeView(self, removed.view)
    NodeUtils.invalidateLayout(self)
    onNodeDetached?()
    return removed
  }
}
