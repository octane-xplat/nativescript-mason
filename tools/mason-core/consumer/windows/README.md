# Qualify a Windows core package

This maintained consumer fails on incorrect native geometry, style-buffer values,
ownership, cleanup, or OS input. It installs a relocated core tarball; it never
links the source checkout or relies on the old lab consumer.

Use a Windows x64 host with the NativeScript Windows toolchain, a logged-in,
unlocked desktop, and an already trusted `CN=ui` signing certificate. The runner
replaces only `org.octane.masoncorequalification` and stops its process afterward.
It does not create certificates or change machine trust. Reserve native-build
capacity for compilation and the host's exclusive device/desktop input capacity
for installation and input.

1. Assemble and verify the package in the Mason checkout. Native inputs must
   already be present. On the Windows host, build and verify the native host
   with `pnpm exec nx run nativescript-mason-core:verify.host.windows`, then
   copy `dist/native/mason-core/windows` to the assembly checkout if it is
   elsewhere. The build requires the Windows DLL and WinMD as well as
   the pinned mobile archives. Pack the output, then copy the tarball and these
   tools to the Windows host or another directory.

   ```sh
   pnpm exec nx run nativescript-mason-core:verify
   pnpm --dir dist/packages/nativescript-mason-core pack --pack-destination ..
   ```

2. On Windows, prepare the isolated consumer from that tarball. The default
   tarball filename follows the source package version. The command also accepts
   explicit tarball and output-directory paths as its two positional arguments.

   ```sh
   pnpm exec nx run nativescript-mason-core:prepare.consumer.windows
   pnpm --dir tmp/mason-core-windows-consumer install --ignore-scripts
   pnpm exec nx run nativescript-mason-core:test.windows.prerequisites
   pnpm exec nx run nativescript-mason-core:build.consumer.windows
   ```

3. Run the session helper from the same checkout. It schedules an interactive
   task because AppX installation from sshd session 0 fails on the lab host.
   It signs and installs the actual MSIX, including its framework dependency;
   loose-manifest registration does not provide the required package graph.

   ```sh
   pnpm exec nx run nativescript-mason-core:test.consumer.windows.input
   ```

The consumer records each assertion's actual values in `result.json`. Success
requires `success: true` and `phase: "complete"`; an operation returning without
throwing is not a pass. `input-actions.json` records the session, DPI scale,
physical screen coordinates from the owning window UI Automation provider,
and user32 click/wheel injection. It reads the ScrollPattern only to identify
the viewport; it never invokes that pattern to scroll. Physical cursor APIs
avoid scaling coordinates twice on a 200% display. `installation.json` compares
the installed bundle, vendor bundle, engine DLL and bridge DLL with the signed
MSIX. `runtime.log` and `runtime.err` capture startup diagnostics before the
first assertion. `interactive.log` and
`interactive.exit` preserve runner failures, including a locked desktop or
foreground-activation denial. These are precise input limitations, not input
qualification.

The fixture uses a small managed observer for XAML frames and child indexes,
and a synchronous evidence writer. These are fixture helpers, not core APIs.
It verifies two flex rows and two grid columns,
checks a native label and its foreign style buffer, then checks a resize in both
the native frame and buffer. It verifies logical/native ownership on reparent
and detach. Its scroll phase contains no programmatic scroll request: an OS
click must reach the row and wheel scrolling must produce an offset matching
that row's native movement. Cleanup must leave no owned child parents and an
empty root. It does not qualify pixel parity, text editing/IME, or other CPU
architectures.

The package supplies CsWinRT 2.3.1 projection references, the generated explicit
interface repair, and DotNetBridge MSIX content. The prerequisite regression
checks repair idempotence and unique bridge destination paths in an evaluated
MSBuild project containing unrelated assets. A real relocated MSIX build remains
necessary; a tarball inventory alone cannot qualify the consumer.

The pinned `@nativescript/windows@0.1.0-alpha.144` bridge rejects both
`Uint8Array` and ordinary array arguments for the projected WinRT `byte[]`
style methods (`System.String` cannot cast to `System.Byte[]`). Core compiles
its own `StyleTransport.cs` into the consumer: JavaScript sends explicit JSON,
the managed adapter decodes bytes, then calls the existing native methods. It
does not modify the runtime's global marshaller. The copied JavaScript buffer
also owns its local mirror; retaining the native arena's shared-buffer count
would discard earlier setters in a turn. The focused
`nativescript-mason-core:test.windows.runtime` regression checks both details.

CsWinRT exposes `IMasonElement.Style` explicitly on Mason's `View`, while
XAML's unrelated `FrameworkElement.Style` remains public. The managed adapter
also retrieves the Mason interface's style for grid CSS setters and getters.
The focused regression uses a null XAML Style to keep that distinction covered.

For adopted ordinary controls, Mason also temporarily owns the native
`alignSelf`, `flexGrow` and `flexShrink` setters. The preview's Widgets attached
setters otherwise attempt a `System.String` to XAML `UIElement` cast while
loading a label. The ordinary control keeps its Style and cascade; Mason
mirrors those values into its leaf. Detach restores any original own setter
descriptor or inherited setter. Both the focused regression and native cleanup
assertions cover restoration. Other NativeScript Widgets attached properties
are outside this fixture's coverage.
