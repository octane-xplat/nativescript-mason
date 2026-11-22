# Repository instructions

Use `mbx` for local Rust builds and tests. For direct Cargo commands, run `mbx build -p <crate>` or `mbx test -p <crate>` with the same toolchain and flags the task requires. Set `MBX_TARGET_VIEWS=0` to keep Cargo's normal target directory in place.

Keep using the Nx native targets when you need packaged artifacts. The `nativescript-mason-core` native build scripts use `mbx` when it is on `PATH`. For native scripts that invoke `cargo` by name, put the installed `mbx` Cargo shim on `PATH` for that invocation.
