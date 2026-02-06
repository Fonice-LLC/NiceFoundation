"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  SparklesIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

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
  createdAt: string;
}

export default function AdminServicesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Fetch services
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchServices();
    }
  }, [user, categoryFilter]);

  const fetchServices = async () => {
    try {
      setError(null);
      const url = categoryFilter
        ? `/api/admin/services?category=${categoryFilter}`
        : "/api/admin/services";
      const response = await fetch(url, {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const servicesList = data.data?.services || [];
        setServices(Array.isArray(servicesList) ? servicesList : []);
      } else {
        const errorMsg = data.error || "Failed to fetch services";
        console.error("Failed to fetch services:", errorMsg);
        setError(errorMsg);
        setServices([]);
      }
    } catch (error: any) {
      const errorMsg = error.message || "Error fetching services";
      console.error("Error fetching services:", error);
      setError(errorMsg);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Service deleted successfully");
        fetchServices();
      } else {
        alert(data.error || "Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "hair":
        return "bg-purple-100 text-purple-800";
      case "makeup":
        return "bg-pink-100 text-pink-800";
      case "skincare":
        return "bg-green-100 text-green-800";
      case "nails":
        return "bg-blue-100 text-blue-800";
      case "spa":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Salon Services
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage all salon services
              </p>
            </div>
            <Link
              href="/admin/services/new"
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Service
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter("")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === ""
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategoryFilter("hair")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === "hair"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Hair
          </button>
          <button
            onClick={() => setCategoryFilter("makeup")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === "makeup"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Makeup
          </button>
          <button
            onClick={() => setCategoryFilter("skincare")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === "skincare"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Skincare
          </button>
          <button
            onClick={() => setCategoryFilter("nails")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === "nails"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Nails
          </button>
          <button
            onClick={() => setCategoryFilter("spa")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === "spa"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Spa
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-semibold">Error loading services:</p>
            <p>{error}</p>
            <button
              onClick={fetchServices}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Services Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(services) &&
                  services.map((service) => (
                    <tr key={service._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {service.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {service.description}
                          </div>
                          {service.stylist && (
                            <div className="text-xs text-gray-400 mt-1">
                              Stylist: {service.stylist}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getCategoryColor(
                            service.category
                          )}`}
                        >
                          {service.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {service.duration} min
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${service.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.featured ? (
                          <SparklesIcon className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-3">
                          <Link
                            href={`/admin/services/${service._id}`}
                            className="text-pink-600 hover:text-pink-900"
                            title="Edit service"
                          >
                            <PencilIcon className="h-5 w-5 inline" />
                          </Link>
                          <button
                            onClick={() => handleDelete(service._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete service"
                          >
                            <TrashIcon className="h-5 w-5 inline" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Empty State */}
            {(!Array.isArray(services) || services.length === 0) &&
              !loading && (
                <div className="text-center py-12">
                  <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">No services found</p>
                  <Link
                    href="/admin/services/new"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Your First Service
                  </Link>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
