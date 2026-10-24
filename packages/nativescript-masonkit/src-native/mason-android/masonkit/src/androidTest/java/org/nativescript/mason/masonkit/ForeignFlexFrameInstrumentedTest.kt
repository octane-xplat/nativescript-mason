package org.nativescript.mason.masonkit

import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.view.View as AndroidView
import android.view.View.MeasureSpec
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView as AndroidTextView
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.nativescript.mason.masonkit.enums.AlignSelf
import org.nativescript.mason.masonkit.enums.Display
import org.nativescript.mason.masonkit.enums.FlexDirection

@RunWith(AndroidJUnit4::class)
class ForeignFlexFrameInstrumentedTest {
  private val instrumentation = InstrumentationRegistry.getInstrumentation()
  private val context = instrumentation.targetContext

  private fun label() = AndroidTextView(context).apply { text = "short" }

  private fun fixture(leaf: AndroidView, direction: FlexDirection, fixed: Boolean = false): View {
    val mason = Mason()
    val root = mason.createView(context).apply {
      style.display = Display.Flex
      style.flexDirection = direction
      style.setSizeWidth(107f, Dimension.Kind.Points.value)
      style.setSizeHeight(200f, Dimension.Kind.Points.value)
    }
    leaf.layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
    root.addView(leaf)
    mason.nodeForView(leaf).style.apply {
      if (fixed) {
        setSizeWidth(107f, Dimension.Kind.Points.value)
        setSizeHeight(200f, Dimension.Kind.Points.value)
      } else {
        flexGrow = 1f
        alignSelf = AlignSelf.Stretch
      }
    }
    return root
  }

  private fun layout(root: View, heightMode: Int = MeasureSpec.EXACTLY) {
    root.forceLayout()
    root.measure(MeasureSpec.makeMeasureSpec(107, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(200, heightMode))
    root.layout(0, 0, root.measuredWidth, root.measuredHeight)
  }

  private fun assertFills(root: View, leaf: AndroidView, stage: String) {
    val computed = root.node.mason.nodeForView(leaf).computedLayout
    assertEquals("$stage computed width", 107f, computed.width, 0f)
    assertEquals("$stage computed height", 200f, computed.height, 0f)
    assertEquals("$stage native width", 107, leaf.width)
    assertEquals("$stage native height", 200, leaf.height)
    assertEquals("$stage measured height", 200, leaf.measuredHeight)
  }

  private fun exerciseRequests(root: View, leaf: AndroidView) {
    // Assert each pass independently: a second parent-only pass used to hide
    // the incorrect frame produced by the first pass and leaf requests.
    layout(root)
    assertFills(root, leaf, "first layout")
    root.requestLayout()
    layout(root)
    assertFills(root, leaf, "parent request")
    repeat(2) {
      leaf.requestLayout()
      assertTrue(leaf.isLayoutRequested)
      layout(root)
      assertFills(root, leaf, "leaf request $it")
    }
    leaf.forceLayout()
    layout(root)
    assertFills(root, leaf, "leaf forceLayout")
  }

  @Test
  fun columnFlexGrowPreservesTheAssignedHeight() {
    instrumentation.runOnMainSync {
      val leaf = label()
      exerciseRequests(fixture(leaf, FlexDirection.Column), leaf)
    }
  }

  @Test
  fun rowCrossAxisStretchPreservesTheAssignedHeight() {
    instrumentation.runOnMainSync {
      val leaf = label()
      exerciseRequests(fixture(leaf, FlexDirection.Row), leaf)
    }
  }

  @Test
  fun changedTextPreservesTheAssignedHeight() {
    instrumentation.runOnMainSync {
      val leaf = label()
      val root = fixture(leaf, FlexDirection.Column)
      layout(root)
      leaf.text = "changed"
      layout(root)
      assertFills(root, leaf, "changed text")
    }
  }

  @Test
  fun imageIntrinsicAspectRatioDoesNotReplaceTheAssignedHeight() {
    instrumentation.runOnMainSync {
      val leaf = ImageView(context).apply {
        adjustViewBounds = true
        setImageDrawable(object : ColorDrawable(Color.TRANSPARENT) {
          override fun getIntrinsicWidth() = 400
          override fun getIntrinsicHeight() = 300
        })
      }
      exerciseRequests(fixture(leaf, FlexDirection.Column), leaf)
    }
  }

  @Test
  fun explicitHeightStillFillsTheBox() {
    instrumentation.runOnMainSync {
      val leaf = label()
      exerciseRequests(fixture(leaf, FlexDirection.Column, fixed = true), leaf)
    }
  }

  @Test
  fun nestedRootUsesItsAssignedFrameAfterAnIntrinsicMeasure() {
    instrumentation.runOnMainSync {
      val mason = Mason()
      val root = mason.createView(context).apply {
        style.display = Display.Flex
        style.flexDirection = FlexDirection.Column
        style.setSizeWidth(1f, Dimension.Kind.Percent.value)
        style.setSizeHeight(1f, Dimension.Kind.Percent.value)
      }
      val content = mason.createView(context).apply {
        style.display = Display.Flex
        style.flexDirection = FlexDirection.Column
        style.flexGrow = 1f
      }
      content.addView(label())
      root.addView(content)
      val foreign = android.widget.FrameLayout(context)
      foreign.addView(root)
      val width = MeasureSpec.makeMeasureSpec(107, MeasureSpec.EXACTLY)
      root.measure(width, MeasureSpec.makeMeasureSpec(200, MeasureSpec.EXACTLY))
      root.layout(0, 0, 107, 200)
      assertEquals(200f, root.node.computedHeight, 0f)

      // A foreign parent's intrinsic query can replace the cached engine
      // layout before assigning its final frame. Android can reuse measured
      // dimensions without invoking this root's onMeasure a second time.
      root.forceLayout()
      root.measure(width, MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED))
      assertTrue("intrinsic control must be shorter", root.node.computedHeight < 200f)
      root.layout(0, 0, 107, 200)
      assertEquals("root compute follows assigned frame", 200f, root.node.computedHeight, 0f)
      assertEquals("descendant frame follows assigned frame", 200, content.height)
    }
  }

  @Test
  fun foreignContainerKeepsStretchBoundsAcrossResizeAndChildRequests() {
    instrumentation.runOnMainSync {
      val content = label()
      val leaf = android.widget.FrameLayout(context).apply {
        addView(content, android.widget.FrameLayout.LayoutParams(
          ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT))
      }
      val root = fixture(leaf, FlexDirection.Column)
      for (height in listOf(200, 120, 260)) {
        root.style.setSizeHeight(height.toFloat(), Dimension.Kind.Points.value)
        content.text = "height $height"
        leaf.requestLayout()
        assertTrue("the foreign container must have a pending request", leaf.isLayoutRequested)
        // Check a single pass: a second parent-only pass used to hide the
        // content-height frame that replaced Mason's grow/stretch result.
        root.forceLayout()
        root.measure(MeasureSpec.makeMeasureSpec(107, MeasureSpec.EXACTLY),
          MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY))
        root.layout(0, 0, 107, height)
        val computed = root.node.mason.nodeForView(leaf).computedLayout
        assertEquals("computed height after resize", height.toFloat(), computed.height, 0f)
        assertEquals("native height after resize", height, leaf.height)
        assertEquals("measured height after resize", height, leaf.measuredHeight)
        assertEquals(107, leaf.width)
      }
    }
  }

  @Test
  fun intrinsicTextChangesStillReflowTheParentAndFollowingSibling() {
    instrumentation.runOnMainSync {
      val mason = Mason()
      val root = mason.createView(context).apply {
        style.display = Display.Flex
        style.flexDirection = FlexDirection.Column
      }
      val leaf = label().apply {
        layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
      }
      val footer = mason.createView(context).apply { style.setSizeHeight(20f, Dimension.Kind.Points.value) }
      root.addView(leaf)
      root.addView(footer)
      fun settle() { repeat(2) { layout(root, MeasureSpec.AT_MOST) } }
      settle()
      val initialHeight = leaf.height
      val initialRootHeight = root.measuredHeight
      leaf.text = "longer text that wraps over several lines in the narrow container"
      settle()
      assertTrue("text should grow", leaf.height > initialHeight)
      assertEquals(leaf.bottom, footer.top)
      assertEquals(leaf.height + footer.height, root.measuredHeight)
      leaf.text = "short"
      settle()
      assertEquals(initialHeight, leaf.height)
      assertEquals(leaf.bottom, footer.top)
      assertEquals(initialRootHeight, root.measuredHeight)
    }
  }
}
