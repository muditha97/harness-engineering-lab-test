export function priceAfterDiscount(price, eligible) {
  if (!eligible) {
    return price;
  }

  return price * 0.9;
}
