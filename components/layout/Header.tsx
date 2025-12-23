"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const categories = [
  { name: "Makeup", href: "/products?category=makeup" },
  { name: "Skincare", href: "/products?category=skincare" },
  { name: "Haircare", href: "/products?category=haircare" },
  { name: "Fragrance", href: "/products?category=fragrance" },
  { name: "Tools", href: "/products?category=tools" },
  { name: "Bath & Body", href: "/products?category=bath-body" },
];

const salonService = { name: "Salon Services", href: "/salon" };

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { getCartTotal } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  return (
    <header className="bg-white shadow-md">
      {/* Top banner */}
      <div className="bg-pink-600 text-white text-center py-2 text-sm">
        Free Shipping on Orders Over $59 | Shop Now
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-pink-600">
              Planet Beauty
            </Link>
          </div>

          {/* Search bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Right icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-8 h-8 bg-white text-pink-600 border border-pink-600 rounded-full flex items-center justify-center text-sm font-bold hover:bg-pink-600 hover:text-white transition-colors"
                >
                  {getInitials(user.name)}
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-pink-600">
                <UserIcon className="h-6 w-6" />
              </Link>
            )}
            <Link
              href="/cart"
              className="text-gray-700 hover:text-pink-600 relative"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartTotal() > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartTotal()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 py-4 border-t">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="text-gray-700 hover:text-pink-600 font-medium"
            >
              {category.name}
            </Link>
          ))}
          {/* Salon Services - Distinct styling, positioned at far right */}
          <Link
            href={salonService.href}
            className="ml-auto px-4 py-2 bg-white text-pink-600 border-2 border-pink-600 rounded-full font-medium hover:bg-pink-600 hover:text-white transition-colors"
          >
            {salonService.name}
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-4 space-y-4">
            {/* Search bar - Mobile */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>

            {/* Navigation links */}
            <nav className="flex flex-col space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-700 hover:text-pink-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              {/* Salon Services - At the bottom with distinct styling */}
              <Link
                href={salonService.href}
                className="px-4 py-2 bg-white text-pink-600 border-2 border-pink-600 rounded-full font-medium hover:bg-pink-600 hover:text-white transition-colors text-center mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {salonService.name}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
