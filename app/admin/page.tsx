"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  CogIcon,
  CalendarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Fetch dashboard stats
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats", {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: "bg-green-500",
    },
    {
      name: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBagIcon,
      color: "bg-blue-500",
    },
    {
      name: "Total Users",
      value: stats.totalUsers,
      icon: UsersIcon,
      color: "bg-purple-500",
    },
    {
      name: "Total Products",
      value: stats.totalProducts,
      icon: ChartBarIcon,
      color: "bg-pink-500",
    },
  ];

  const quickActions = [
    {
      name: "Add New Product",
      href: "/admin/products/new",
      icon: PlusIcon,
      description: "Create a new product listing",
    },
    {
      name: "Manage Products",
      href: "/admin/products",
      icon: CogIcon,
      description: "View, edit, or delete products",
    },
    {
      name: "View Users",
      href: "/admin/users",
      icon: UsersIcon,
      description: "Manage user accounts",
    },
    {
      name: "View Orders",
      href: "/admin/orders",
      icon: ShoppingBagIcon,
      description: "Track and manage orders",
    },
    {
      name: "Salon Bookings",
      href: "/admin/bookings",
      icon: CalendarIcon,
      description: "Manage salon service bookings",
    },
    {
      name: "Salon Services",
      href: "/admin/services",
      icon: SparklesIcon,
      description: "Manage salon services",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <action.icon className="h-8 w-8 text-pink-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
