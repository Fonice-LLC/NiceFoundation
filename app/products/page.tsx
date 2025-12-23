"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  brand: string;
  images: string[];
  inStock: boolean;
  ratings: {
    average: number;
    count: number;
  };
}

function ProductsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user: authUser } = useAuth();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    sort: "newest",
  });

  const categories = [
    { value: "makeup", label: "Makeup" },
    { value: "skincare", label: "Skincare" },
    { value: "haircare", label: "Haircare" },
    { value: "fragrance", label: "Fragrance" },
    { value: "tools", label: "Tools" },
    { value: "bath-body", label: "Bath & Body" },
    { value: "nails", label: "Nails" },
    { value: "mens", label: "Men's" },
    { value: "gifts", label: "Gifts" },
    { value: "accessories", label: "Accessories" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      params.append("sort", filters.sort);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Add to cart for both guest and authenticated users
    addToCart(productId);
  };

  const handleRemoveFromCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    removeFromCart(productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filters.category === ""}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                    className="mr-2"
                  />
                  All Categories
                </label>
                {categories.map((cat) => (
                  <label key={cat.value} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={filters.category === cat.value}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      className="mr-2"
                    />
                    {cat.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <select
                value={filters.sort}
                onChange={(e) =>
                  setFilters({ ...filters, sort: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {filters.category
                ? categories.find((c) => c.value === filters.category)?.label
                : "All Products"}
            </h1>
            <p className="text-gray-600">
              {loading ? "Loading..." : `${products.length} products found`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-lg h-96 animate-pulse"
                ></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden group relative"
                >
                  <Link href={`/products/${product._id}`} className="block">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      {product.salePrice && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                          Sale
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-1">
                        {product.brand}
                      </p>
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.ratings.average)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({product.ratings.count})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.salePrice ? (
                          <>
                            <span className="text-lg font-bold text-pink-600">
                              {formatPrice(product.salePrice)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      {!product.inStock && (
                        <p className="text-red-500 text-sm mt-2">
                          Out of Stock
                        </p>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={(e) =>
                      isInCart(product._id)
                        ? handleRemoveFromCart(e, product._id)
                        : handleAddToCart(e, product._id)
                    }
                    className="absolute bottom-4 right-4 bg-pink-600 text-white rounded-full p-2 hover:bg-pink-700 transition-colors shadow-md"
                  >
                    {isInCart(product._id) ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProductsList />
    </Suspense>
  );
}
