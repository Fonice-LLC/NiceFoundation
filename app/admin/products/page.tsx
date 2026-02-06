"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  salePrice?: number;
  category: string;
  images: string[];
  stock: number;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Fetch products
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setError(null);
      const response = await fetch("/api/products?limit=1000"); // Get all products for admin
      const data = await response.json();

      console.log("API Response:", data);
      console.log("Response OK:", response.ok);
      console.log("Data structure:", {
        success: data.success,
        hasData: !!data.data,
        dataKeys: data.data ? Object.keys(data.data) : [],
        products: data.data?.products,
        productsLength: data.data?.products?.length,
      });

      if (response.ok && data.success) {
        // API returns { success: true, data: { products: [...], pagination: {...} } }
        const productsList = data.data?.products || [];
        console.log("Setting products:", productsList);
        setProducts(Array.isArray(productsList) ? productsList : []);
      } else {
        const errorMsg = data.error || "Failed to fetch products";
        console.error("Failed to fetch products:", errorMsg);
        setError(errorMsg);
        setProducts([]);
      }
    } catch (error: any) {
      const errorMsg = error.message || "Error fetching products";
      console.error("Error fetching products:", error);
      setError(errorMsg);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeleteLoading(productId);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setProducts(products.filter((p) => p._id !== productId));
        alert("Product deleted successfully");
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (authLoading || loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/admin"
              className="text-pink-600 hover:text-pink-700 mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Products
            </h1>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Product
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-semibold">Error loading products:</p>
            <p>{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(products) &&
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 relative">
                          <Image
                            src={product.images[0] || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="rounded object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.brand}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.salePrice ? (
                          <>
                            <span className="line-through text-gray-500">
                              ${product.price}
                            </span>
                            <span className="ml-2 text-pink-600 font-semibold">
                              ${product.salePrice}
                            </span>
                          </>
                        ) : (
                          <span>${product.price}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm ${
                          product.stock > 10
                            ? "text-green-600"
                            : product.stock > 0
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="text-pink-600 hover:text-pink-900 mr-4"
                      >
                        <PencilIcon className="h-5 w-5 inline" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deleteLoading === product._id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleteLoading === product._id ? (
                          <div className="animate-spin h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full inline-block"></div>
                        ) : (
                          <TrashIcon className="h-5 w-5 inline" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {(!Array.isArray(products) || products.length === 0) && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
