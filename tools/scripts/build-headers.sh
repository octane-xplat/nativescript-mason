#!/bin/bash

cbindgen --config crates/mason-ios/cbindgen.toml  crates/mason-ios/src/lib.rs -l c > packages/nativescript-masonkit/src-native/mason-ios/Mason/include/mason_ios.h
cbindgen --config crates/mason-c/cbindgen.toml  crates/mason-c/src/lib.rs -l c >  packages/nativescript-masonkit/src-native/mason-ios/Mason/include/mason_native.h
cbindgen --config crates/mason-c/cbindgen.toml  crates/mason-c/src/lib.rs -l c >  packages/nativescript-masonkit/src-native/mason-ios/Mason/Mason/include/mason_native.h