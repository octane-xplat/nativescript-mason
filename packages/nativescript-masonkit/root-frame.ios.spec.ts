import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
	vi.stubGlobal(
		'CGRectEqualToRect',
		(a: any, b: any) =>
			a.origin.x === b.origin.x &&
			a.origin.y === b.origin.y &&
			a.size.width === b.size.width &&
			a.size.height === b.size.height,
	);
});

import { Utils } from '@nativescript/core';
import { setRootNativeViewFrame } from './common';

afterEach(() => vi.restoreAllMocks());
afterAll(() => vi.unstubAllGlobals());

const rect = (w: number, h: number, x = 0, y = 0) => ({
	origin: { x, y },
	size: { width: w, height: h },
});

function fixture(dipsW: number, dipsH: number, adjusted?: (f: any) => any) {
	const native = {
		node: {
			computedLayout: {
				width: Utils.layout.toDevicePixels(dipsW),
				height: Utils.layout.toDevicePixels(dipsH),
			},
		},
		mason_computeWithSize: vi.fn(),
		mason_markRootComputeAppliedWithSize: vi.fn(),
		frame: null as any,
	};
	const view: any = {
		ios: native,
		applySafeAreaInsets: vi.fn(adjusted ?? ((f: any) => f)),
		_raiseLayoutChangedEvent: vi.fn(),
	};
	return { view, native };
}

describe('setRootNativeViewFrame on iOS', () => {
	it('recomputes at the frame size when no safe-area adjustment was needed', () => {
		// Parent measured the root against the safe area (402x778) but placed it
		// full-bleed (402x874) — e.g. a page with iosIgnoreSafeArea.
		const { view, native } = fixture(402, 778);
		const frame = rect(402, 874);
		setRootNativeViewFrame(view, native, frame);
		expect(native.mason_computeWithSize).toHaveBeenCalledWith(
			Utils.layout.toDevicePixels(402),
			Utils.layout.toDevicePixels(874),
		);
	});

	it('does not recompute when the layout already matches the frame', () => {
		const { view, native } = fixture(402, 874);
		setRootNativeViewFrame(view, native, rect(402, 874));
		expect(native.mason_computeWithSize).not.toHaveBeenCalled();
		expect(native.mason_markRootComputeAppliedWithSize).not.toHaveBeenCalled();
	});

	it('recomputes at the adjusted size when the frame was inset', () => {
		const { view, native } = fixture(402, 874, (f) => rect(402, 778, 0, 62));
		setRootNativeViewFrame(view, native, rect(402, 874));
		expect(native.mason_computeWithSize).toHaveBeenCalledWith(
			Utils.layout.toDevicePixels(402),
			Utils.layout.toDevicePixels(778),
		);
	});
});
