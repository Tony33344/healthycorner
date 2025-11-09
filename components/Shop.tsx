"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { supabase, Product } from "@/lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartItem {
  product: Product;
  quantity: number;
}

export function Shop() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Convert back to CartItem format
        const cartItems = parsedCart.map((item: any) => ({
          product: {
            id: item.id,
            name: item.name,
            price: item.price,
            slug: item.slug || "",
            description: item.description || "",
            published: true,
            created_at: "",
            updated_at: ""
          },
          quantity: item.quantity
        }));
        setCart(cartItems);
      } catch (e) {
        console.error("Failed to load cart:", e);
      }
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load products');
      const payload = await res.json();
      setProducts(payload.products || []);
    } catch (e) {
      console.error('Load products error', e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCartToStorage = (cartItems: CartItem[]) => {
    const cartData = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      slug: item.product.slug,
      description: item.product.description,
      quantity: item.quantity
    }));
    localStorage.setItem("cart", JSON.stringify(cartData));
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    let newCart: CartItem[];
    if (existing) {
      newCart = cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { product, quantity: 1 }];
    }
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const updateQuantity = (productId: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0);
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section id="shop" className="py-24 md:py-40 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="mb-8">
            <span className="text-primary font-bold text-sm uppercase tracking-[0.3em]">
              SHOP
            </span>
            <div className="w-16 h-1 bg-primary mt-3 mx-auto"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
            Wellness Products & Retreats
          </h2>
          <p className="text-xl text-neutral-700 font-light">
            Book your wellness experience or purchase our curated products
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-neutral-50 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  {product.featured && (
                    <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
                      Featured
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">{product.name}</h3>
                  <p className="text-neutral-600 mb-4">{product.description}</p>
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl font-bold text-primary">€{product.price}</span>
                    {product.compare_at_price && (
                      <span className="text-lg text-neutral-500 line-through">
                        €{product.compare_at_price}
                      </span>
                    )}
                  </div>
                  <button
                    data-testid="add-to-cart"
                    onClick={() => addToCart(product)}
                    className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Floating Cart Button */}
        {cartCount > 0 && (
          <button
            aria-label="Open Cart"
            data-testid="open-cart"
            onClick={() => setShowCart(true)}
            className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all z-40"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        )}

        {/* Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-neutral-900">Your Cart</h3>
                <button onClick={() => setShowCart(false)} className="text-neutral-500 hover:text-neutral-700">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-start space-x-4 border-b border-neutral-200 pb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-900">{item.product.name}</h4>
                      <p className="text-sm text-neutral-600 mt-1">€{item.product.price} each</p>
                      <div className="flex items-center space-x-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 rounded-full hover:bg-neutral-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 rounded-full hover:bg-neutral-100"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-auto text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-900">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-neutral-200 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">€{cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
