import test from "node:test";
import assert from "node:assert/strict";
import { priceAfterDiscount } from "../src/discount.js";

test("applies a 10% discount to an eligible booking", () => {
  assert.equal(priceAfterDiscount(100, true), 90);
});

test("keeps the original price for an ineligible booking", () => {
  assert.equal(priceAfterDiscount(100, false), 100);
});
