"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Service {
  _id: string;
  name: string;
  description: string;
  category: "hair" | "makeup" | "skincare" | "nails" | "spa";
  price: number;
  duration: number;
  featured: boolean;
  images: string[];
  stylist?: string;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "hair" as "hair" | "makeup" | "skincare" | "nails" | "spa",
    price: "",
    duration: "",
    featured: false,
    stylist: "",
    images: "",
  });

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Fetch service data
  useEffect(() => {
    if (user && user.role === "admin" && serviceId) {
      fetchService();
    }
  }, [user, serviceId]);

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const serviceData = data.data;
        setService(serviceData);
        setFormData({
          name: serviceData.name,
          description: serviceData.description,
          category: serviceData.category,
          price: serviceData.price.toString(),
          duration: serviceData.duration.toString(),
          featured: serviceData.featured,
          stylist: serviceData.stylist || "",
          images: serviceData.images.join(", "),
        });
      } else {
        alert(data.error || "Failed to fetch service");
        router.push("/admin/services");
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      alert("Failed to fetch service");
      router.push("/admin/services");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare data
      const submitData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        featured: formData.featured,
        stylist: formData.stylist || undefined,
        images: formData.images
          ? formData.images.split(",").map((url) => url.trim())
          : [],
      };

      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Service updated successfully!");
        router.push("/admin/services");
      } else {
        alert(data.error || "Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update service information
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Service Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Classic Haircut"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Describe the service..."
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="hair">Hair</option>
                <option value="makeup">Makeup</option>
                <option value="skincare">Skincare</option>
                <option value="nails">Nails</option>
                <option value="spa">Spa</option>
              </select>
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  required
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="60"
                />
              </div>
            </div>

            {/* Stylist */}
            <div>
              <label
                htmlFor="stylist"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Stylist (Optional)
              </label>
              <input
                type="text"
                id="stylist"
                name="stylist"
                value={formData.stylist}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Sarah Johnson"
              />
            </div>

            {/* Images */}
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Image URLs (Optional)
              </label>
              <input
                type="text"
                id="images"
                name="images"
                value={formData.images}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Comma-separated URLs"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter multiple image URLs separated by commas
              </p>
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label
                htmlFor="featured"
                className="ml-2 block text-sm text-gray-700"
              >
                Featured Service
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Service"}
            </button>
            <Link
              href="/admin/services"
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
