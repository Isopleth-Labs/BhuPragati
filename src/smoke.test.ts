import { describe, it, expect } from "bun:test";

describe("Smoke tests", () => {
  it("should always pass", () => {
    expect(true).toBe(true);
  });

  it("1 + 1 = 2", () => {
    expect(1 + 1).toBe(2);
  });

  it("project name is correct", () => {
    expect("better-bharat-map").toContain("bharat");
  });
});