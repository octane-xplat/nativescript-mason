package org.nativescript.mason.masonkit

import android.view.View.MeasureSpec
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView as AndroidTextView
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith
import org.nativescript.mason.masonkit.enums.AlignItems
import org.nativescript.mason.masonkit.enums.Display
import org.nativescript.mason.masonkit.enums.FlexDirection

@RunWith(AndroidJUnit4::class)
class MasonCoreHostInstrumentedTest {
  private val instrumentation = InstrumentationRegistry.getInstrumentation()
  private val context = instrumentation.targetContext

  private fun Style.dimensions(width: Float, height: Float) {
    setSizeWidth(width, Dimension.Kind.Points.value)
    setSizeHeight(height, Dimension.Kind.Points.value)
  }

  private fun layout(root: android.view.View, width: Int, height: Int) {
    repeat(2) {
      root.forceLayout()
      root.measure(MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY), MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY))
      root.layout(0, 0, width, height)
    }
  }

  @Test
  fun percentageImagesDoNotInflateNestedStarTracks() {
    instrumentation.runOnMainSync {
      for (nested in listOf(false, true)) {
        val mason = Mason().apply { setDeviceScale(1f) }
        val root = mason.createView(context).apply {
          style.display = Display.Grid
          style.gridTemplateColumns = "1fr 1fr"
          style.dimensions(402f, 402f)
        }
        val tiles = mutableListOf<android.view.View>()
        val images = mutableListOf<android.widget.ImageView>()
        repeat(2) {
          val tile = mason.createView(context).apply {
            style.display = Display.Flex
            style.flexDirection = FlexDirection.Column
            style.setSizeHeight(402f, Dimension.Kind.Points.value)
          }
          val image = android.widget.ImageView(context).apply {
            // Match NativeScript's aspect-preserving intrinsic image measure.
            adjustViewBounds = true
            setImageBitmap(android.graphics.Bitmap.createBitmap(360, 640, android.graphics.Bitmap.Config.ARGB_8888))
            scaleType = android.widget.ImageView.ScaleType.CENTER_CROP
          }
          mason.nodeForView(image).style.apply {
            setSizeWidth(1f, Dimension.Kind.Percent.value)
            setSizeHeight(1f, Dimension.Kind.Percent.value)
          }
          if (nested) {
            val grow = mason.createView(context).apply {
              style.display = Display.Flex
              style.flexDirection = FlexDirection.Column
              style.flexGrow = 1f
            }
            grow.addView(image)
            tile.addView(grow)
          } else {
            tile.addView(image)
          }
          root.addView(tile)
          tiles.add(tile)
          images.add(image)
        }
        layout(root, 402, 402)
        for ((index, tile) in tiles.withIndex()) {
          assertEquals("nested=$nested", 201, tile.width)
          assertEquals(index * 201, tile.left)
        }
        for (image in images) {
          assertEquals(201, image.width)
          assertEquals(402, image.height)
        }
      }
    }
  }

  @Test
  fun gridPlacesOrdinaryContainersInDeclaredTracks() {
    instrumentation.runOnMainSync {
      // Native frames and point dimensions in this case use physical pixels.
      val mason = Mason().apply { setDeviceScale(1f) }
      val root = mason.createView(context).apply {
        style.display = Display.Grid
        style.gridTemplateColumns = "100px 100px"
      }
      val first = mason.createView(context).apply { style.dimensions(40f, 30f) }
      val second = mason.createView(context).apply { style.dimensions(40f, 30f) }
      root.addView(first)
      root.addView(second)
      layout(root, 200, 80)
      assertEquals(0, first.left)
      assertEquals(100, second.left)
      assertEquals(40, second.width)
      assertEquals(30, second.height)
    }
  }

  @Test
  fun percentWidthTracksParentAndClearsToForeignIntrinsicWidth() {
    instrumentation.runOnMainSync {
      // Keep the definite parent dimensions and native frames in physical pixels.
      val mason = Mason().apply { setDeviceScale(1f) }
      val root = mason.createView(context).apply {
        style.display = Display.Flex
        style.flexDirection = FlexDirection.Column
        style.alignItems = AlignItems.Start
        style.dimensions(200f, 100f)
      }
      val label = AndroidTextView(context).apply {
        text = "short"
        layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
      }
      root.addView(label)
      layout(root, 200, 100)
      assertEquals("The percentage containing block must have definite width", 200f, root.node.computedWidth, 0f)
      val intrinsic = label.width
      assertTrue(intrinsic > 0)
      mason.setPercentWidth(label, 0.5f)
      layout(root, 200, 100)
      assertEquals("Root=${root.node.computedWidth}, leaf=${mason.nodeForView(label).computedWidth}", 100, label.width)
      root.style.setSizeWidth(300f, Dimension.Kind.Points.value)
      layout(root, 300, 100)
      assertEquals(150, label.width)
      mason.setPercentWidth(label, Float.NaN)
      layout(root, 300, 100)
      assertEquals(intrinsic, label.width)
    }
  }

  @Test
  fun childOperationsPreserveOrderReparentAndRejectCycles() {
    lateinit var removed: View
    lateinit var formerParent: View
    instrumentation.runOnMainSync {
      val mason = Mason()
      val left = mason.createView(context)
      val right = mason.createView(context)
      val first = mason.createView(context)
      val second = mason.createView(context)
      val third = mason.createView(context)
      left.addView(first)
      left.addView(second)
      left.node.addChildAt(third.node, 1)
      assertEquals(listOf(first.node, third.node, second.node), left.node.getChildren())
      assertSame(third, left.getChildAt(1))
      right.node.appendChild(third.node)
      assertEquals(listOf(first.node, second.node), left.node.getChildren())
      assertSame(right, third.parent)
      assertSame(right.node, third.node.parent)
      assertThrows(IllegalArgumentException::class.java) { third.node.appendChild(right.node) }
      assertThrows(IllegalArgumentException::class.java) { left.node.replaceChildAt(Mason().createNode(), 0) }
      assertSame(first, left.getChildAt(0))
      right.node.removeChildAt(0)
      assertNull(third.node.parent)
      removed = third
      formerParent = right
    }
    instrumentation.waitForIdleSync()
    instrumentation.runOnMainSync {
      assertNull(removed.parent)
      assertEquals(0, formerParent.childCount)
    }
  }

  @Test
  fun programmaticScrollSeeksClampToComputedContentBounds() {
    instrumentation.runOnMainSync {
      val mason = Mason()
      val scroll = mason.createScrollView(context).apply { style.dimensions(100f, 100f) }
      val content = mason.createView(context).apply { style.dimensions(100f, 500f) }
      scroll.addView(content)
      layout(scroll, 100, 100)
      assertEquals(500, scroll.scrollContentHeight)
      scroll.scrollTo(0, 80)
      assertEquals(80, scroll.scrollY)
      scroll.scrollTo(0, 10000)
      assertEquals(400, scroll.scrollY)
      scroll.scrollTo(0, -100)
      assertEquals(0, scroll.scrollY)
    }
  }

  @Test
  fun nestedContainerInsideForeignLayoutSettlesWithoutReentrantCompute() {
    val mason = Mason()
    val root = mason.createView(context)
    val stack = LinearLayout(context).apply {
      orientation = LinearLayout.VERTICAL
      layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
    }
    val nested = mason.createView(context).apply { style.setSizeHeight(32f, Dimension.Kind.Points.value) }
    val label = AndroidTextView(context).apply { text = "foreign sibling" }
    instrumentation.runOnMainSync {
      stack.addView(nested)
      stack.addView(label)
      root.addView(stack)
      layout(root, 300, 200)
    }
    instrumentation.waitForIdleSync()
    instrumentation.runOnMainSync {
      layout(root, 300, 200)
      assertEquals(32, nested.height)
      assertTrue(label.height > 0)
      assertTrue(stack.height >= nested.height + label.height)
      assertFalse(mason.inCompute)
    }
  }
}
