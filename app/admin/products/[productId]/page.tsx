"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "makeup",
    price: "",
    salePrice: "",
    description: "",
    ingredients: "",
    howToUse: "",
    stock: "",
    images: [""],
    featured: false,
  });

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Fetch product data
  useEffect(() => {
    if (user && user.role === "admin" && productId) {
      fetchProduct();
    }
  }, [user, productId]);

  const fetchProduct = async () => {
    try {
      console.log("Fetching product:", productId);
      const response = await fetch(`/api/admin/products/${productId}`, {
        credentials: "include",
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.success) {
        const product = data.data;
        setFormData({
          name: product.name || "",
          brand: product.brand || "",
          category: product.category || "makeup",
          price: product.price?.toString() || "",
          salePrice: product.salePrice?.toString() || "",
          description: product.description || "",
          ingredients: product.ingredients || "",
          howToUse: product.howToUse || "",
          stock: product.stock?.toString() || "",
          images:
            product.images && product.images.length > 0 ? product.images : [""],
          featured: product.featured || false,
        });
      } else {
        console.error("Failed to fetch product:", data);
        alert(data.error || "Failed to fetch product");
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to fetch product");
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Filter out empty image URLs
      const images = formData.images.filter((img) => img.trim() !== "");

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice
          ? parseFloat(formData.salePrice)
          : undefined,
        stock: parseInt(formData.stock),
        images,
      };

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Product updated successfully!");
        router.push("/admin/products");
      } else {
        alert(data.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    } finally {
      setSaving(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="text-pink-600 hover:text-pink-700 mb-2 inline-block"
          >
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        </div>

        {/* Form - Same as new product form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6 space-y-6"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="makeup">Makeup</option>
                <option value="skincare">Skincare</option>
                <option value="haircare">Haircare</option>
                <option value="fragrance">Fragrance</option>
                <option value="tools">Tools</option>
                <option value="bath-body">Bath & Body</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price (Optional)
              </label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients (Optional)
            </label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How to Use (Optional)
            </label>
            <textarea
              name="howToUse"
              value={formData.howToUse}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images (URLs)
            </label>
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              + Add Image URL
            </button>
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Featured Product
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin/products"
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
