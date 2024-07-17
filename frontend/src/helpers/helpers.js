export const getPriceQueryParams = (searchParams, key, value) => {
  const hasValueInParam = searchParams.has(key);

  if (value && hasValueInParam) {
    searchParams.set(key, value);
  } else if (value) {
    searchParams.append(key, value);
  } else if (hasValueInParam) {
    searchParams.delete(key);
  }

  return searchParams;
};

export const caluclateOrderCost = (cartItems, shippingPrice) => {
  const itemsPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const taxPrice = Number((0.15 * itemsPrice).toFixed(3));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(3);
  console.log("totalPrice", shippingPrice);
  return {
    itemsPrice: Number(itemsPrice).toFixed(3),
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};
