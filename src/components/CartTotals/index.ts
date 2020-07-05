import { useMemo } from 'react';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

interface ResturnCartTotals {
  cartTotal: string;
  totalItensInCart: number;
}

const CartTotal = (): ResturnCartTotals => {
  const { products } = useCart();

  const cartTotal = useMemo(() => {
    // TODO RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
    const total = products.reduce((acumulator, product) => {
      return acumulator + product.quantity * product.price;
    }, 0);

    return formatValue(total);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    // TODO RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
    const total = products.reduce((acumulator, product) => {
      return acumulator + product.quantity;
    }, 0);

    return total;
  }, [products]);

  return {
    cartTotal,
    totalItensInCart,
  };
};

export default CartTotal;
