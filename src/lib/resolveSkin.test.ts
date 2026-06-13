import { describe, expect, it } from "vitest";
import { detectFormFactor, detectOS, peerSkin, resolveSkin } from "./resolveSkin";

const UA = {
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  ipad: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  androidPhone:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
  androidTablet:
    "Mozilla/5.0 (Linux; Android 14; SM-X200) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  windows: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  linux: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
};

describe("detectOS", () => {
  it("prefers the platform hint when present", () => {
    expect(detectOS({ ua: UA.linux, platform: "macOS" })).toBe("apple");
    expect(detectOS({ ua: UA.linux, platform: "Android" })).toBe("android");
    expect(detectOS({ ua: UA.linux, platform: "Windows" })).toBe("windows");
  });

  it("falls back to UA-string parsing", () => {
    expect(detectOS({ ua: UA.mac })).toBe("apple");
    expect(detectOS({ ua: UA.iphone })).toBe("apple");
    expect(detectOS({ ua: UA.androidPhone })).toBe("android");
    expect(detectOS({ ua: UA.windows })).toBe("windows");
    expect(detectOS({ ua: UA.linux })).toBe("other");
  });

  it("classifies Android before Linux despite the shared token", () => {
    expect(detectOS({ ua: UA.androidTablet })).toBe("android");
  });
});

describe("detectFormFactor (device-model first, width is a tiebreaker)", () => {
  it("follows the Apple device, ignoring window width", () => {
    // iPhone is mobile even in a wide window; Mac is desktop even in a narrow one.
    expect(detectFormFactor({ width: 1400 }, { ua: UA.iphone })).toBe("mobile");
    expect(detectFormFactor({ width: 600 }, { ua: UA.mac, platform: "macOS" })).toBe("desktop");
  });

  it("treats an iPad (incl. iPadOS reporting as Macintosh + touch) as a tablet", () => {
    expect(detectFormFactor({ width: 810 }, { ua: UA.ipad })).toBe("tablet");
    expect(
      detectFormFactor(
        { width: 1024, coarsePointer: true },
        { ua: UA.mac, platform: "macOS", maxTouchPoints: 5 },
      ),
    ).toBe("tablet");
  });

  it("splits Android phones vs tablets by the UA Mobile token", () => {
    expect(detectFormFactor({ width: 412 }, { ua: UA.androidPhone })).toBe("mobile");
    expect(detectFormFactor({ width: 1000 }, { ua: UA.androidTablet })).toBe("tablet");
  });

  it("keeps a desktop OS as desktop at narrow widths (no touch)", () => {
    expect(detectFormFactor({ width: 700 }, { ua: UA.windows })).toBe("desktop");
  });

  it("honors the UA-CH mobile hint", () => {
    expect(detectFormFactor({ width: 900 }, { ua: UA.androidPhone, mobile: true })).toBe("mobile");
  });

  it("falls back to width for unknown devices", () => {
    expect(detectFormFactor({ width: 390 }, { ua: UA.linux })).toBe("mobile");
    expect(detectFormFactor({ width: 1500 }, { ua: UA.linux })).toBe("desktop");
  });
});

describe("resolveSkin — by real OS, Apple split by device", () => {
  it("resolves Apple devices regardless of window size", () => {
    expect(resolveSkin({ ua: UA.iphone }, { width: 1400 }).skin).toBe("ios"); // wide window, still iOS
    expect(resolveSkin({ ua: UA.ipad }, { width: 810 }).skin).toBe("ipados");
    expect(
      resolveSkin({ ua: UA.mac, platform: "macOS", maxTouchPoints: 5 }, { width: 1024, coarsePointer: true })
        .skin,
    ).toBe("ipados"); // iPadOS masquerading as Macintosh
    expect(resolveSkin({ ua: UA.mac, platform: "macOS" }, { width: 600 }).skin).toBe("macos"); // narrow Mac stays macOS
  });

  it("returns material for Android phones and tablets", () => {
    expect(resolveSkin({ ua: UA.androidPhone }, { width: 412 }).skin).toBe("material");
    expect(resolveSkin({ ua: UA.androidTablet }, { width: 1000 }).skin).toBe("material");
  });

  it("returns fluent for Windows at any width", () => {
    expect(resolveSkin({ ua: UA.windows }, { width: 1500 }).skin).toBe("fluent");
    expect(resolveSkin({ ua: UA.windows, platform: "Windows" }, { width: 700 }).skin).toBe("fluent");
  });

  it("routes unknown/Linux by screen type: desktop -> fluent, mobile -> material", () => {
    expect(resolveSkin({ ua: UA.linux }, { width: 1500 }).skin).toBe("fluent");
    expect(resolveSkin({ ua: UA.linux }, { width: 390, coarsePointer: true }).skin).toBe("material");
  });

  it("still reports the true os/formFactor it detected", () => {
    const r = resolveSkin({ ua: UA.androidPhone }, { width: 412 });
    expect(r.os).toBe("android");
    expect(r.formFactor).toBe("mobile");
  });
});

describe("peerSkin — the one cross-platform skin a device may preview", () => {
  it("pairs phones iOS <-> Android", () => {
    expect(peerSkin("ios", "mobile")).toBe("material");
    expect(peerSkin("material", "mobile")).toBe("ios");
  });

  it("pairs tablets iPadOS <-> Android", () => {
    expect(peerSkin("ipados", "tablet")).toBe("material");
    expect(peerSkin("material", "tablet")).toBe("ipados");
  });

  it("pairs desktops macOS <-> Windows", () => {
    expect(peerSkin("macos", "desktop")).toBe("fluent");
    expect(peerSkin("fluent", "desktop")).toBe("macos");
  });

  it("has no peer for the neutral skin", () => {
    expect(peerSkin("neutral", "desktop")).toBeNull();
  });
});
