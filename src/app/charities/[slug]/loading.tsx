"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation Skeleton */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-gray-400">
            <ArrowLeft className="w-5 h-5" />
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section Skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-32 animate-pulse" />
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16">
              {/* Logo Skeleton */}
              <div className="relative w-32 h-32 bg-gray-200 rounded-2xl shadow-xl border-4 border-white flex-shrink-0 animate-pulse" />

              {/* Name and Actions Skeleton */}
              <div className="flex-1 min-w-0 space-y-4">
                <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse" />
              </div>

              {/* Button Skeleton */}
              <div className="flex-shrink-0 w-full md:w-auto">
                <div className="h-12 bg-gray-200 rounded-xl w-full md:w-48 animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description Section Skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          <div className="h-8 bg-gray-200 rounded-lg w-24 mb-4 animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-32 mt-6 animate-pulse" />
        </motion.div>

        {/* Impact Stats Skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="h-8 bg-gray-200 rounded-lg w-40 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Events Section Skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="h-8 bg-gray-200 rounded-lg w-56 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
