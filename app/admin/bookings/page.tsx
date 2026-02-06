"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

interface Booking {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: {
    _id: string;
    name: string;
    category: string;
    duration: number;
    price: number;
  };
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalPrice: number;
  notes?: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Fetch bookings
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchBookings();
    }
  }, [user, statusFilter]);

  const fetchBookings = async () => {
    try {
      setError(null);
      const url = statusFilter
        ? `/api/admin/bookings?status=${statusFilter}`
        : "/api/admin/bookings";
      const response = await fetch(url, {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const bookingsList = data.data?.bookings || [];
        setBookings(Array.isArray(bookingsList) ? bookingsList : []);
      } else {
        const errorMsg = data.error || "Failed to fetch bookings";
        console.error("Failed to fetch bookings:", errorMsg);
        setError(errorMsg);
        setBookings([]);
      }
    } catch (error: any) {
      const errorMsg = error.message || "Error fetching bookings";
      console.error("Error fetching bookings:", error);
      setError(errorMsg);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Booking deleted successfully");
        fetchBookings();
      } else {
        alert(data.error || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Booking status updated successfully");
        fetchBookings();
      } else {
        alert(data.error || "Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
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
          <h1 className="text-3xl font-bold text-gray-900">Salon Bookings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage all salon service bookings
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter("")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === ""
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "pending"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("confirmed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "confirmed"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "completed"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter("cancelled")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "cancelled"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-semibold">Error loading bookings:</p>
            <p>{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(bookings) &&
                  bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm font-medium text-gray-900">
                            <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {booking.customerName}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {booking.customerEmail}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {booking.customerPhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.service?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {booking.service?.category || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.service?.duration || 0} min
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            handleStatusChange(booking._id, e.target.value)
                          }
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            booking.status
                          )} border-0 cursor-pointer`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${booking.totalPrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete booking"
                        >
                          <TrashIcon className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Empty State */}
            {(!Array.isArray(bookings) || bookings.length === 0) &&
              !loading && (
                <div className="text-center py-12">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">No bookings found</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
