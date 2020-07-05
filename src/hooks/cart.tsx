import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

const StoreKeys = {
  PRODUCTS: '@GoStackDesafioFundamentosReactNative:Products',
};

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const productsStore = await AsyncStorage.getItem(StoreKeys.PRODUCTS);

      // await AsyncStorage.removeItem(StoreKeys.PRODUCTS);

      if (productsStore) setProducts([...JSON.parse(productsStore)]);
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      // TODO ADD A NEW ITEM TO THE CART
      const productExists = products.find(
        item => item.id === product.id,
      ) as Product;

      if (productExists) {
        setProducts(
          products.map(prev =>
            prev.id === product.id
              ? { ...prev, quantity: productExists.quantity + 1 }
              : prev,
          ),
        );
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(StoreKeys.PRODUCTS, JSON.stringify(products));
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const product = products.find(item => item.id === id) as Product;
      if (!product) return;

      const quantity = product.quantity + 1;

      const newProducts: Array<Product> = products.map(item =>
        item.id === product.id ? { ...item, quantity } : item,
      );

      setProducts(newProducts);

      await AsyncStorage.setItem(
        StoreKeys.PRODUCTS,
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const product = products.find(item => item.id === id) as Product;
      if (!product) return;

      const quantity = product.quantity - 1;

      let newProducts: Product[] = [];

      if (quantity <= 0) {
        newProducts = products
          .map(item => {
            if (item.id !== product.id) return item;
            return null;
          })
          .filter(item => item) as Product[];
      } else {
        newProducts = products.map(item => {
          if (item.id === product.id) return { ...item, quantity };
          return item;
        });
      }

      setProducts(newProducts);

      await AsyncStorage.setItem(
        StoreKeys.PRODUCTS,
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
