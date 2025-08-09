"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Package, 
  Receipt, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  lowStockProducts: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
}

export default function DashboardOverview({ stats }: DashboardOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Users */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">Total Users</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{stats.totalUsers}</div>
          <p className="text-xs text-blue-600 mt-1">Active system users</p>
        </CardContent>
      </Card>

      {/* Total Products */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-600">Total Products</CardTitle>
          <Package className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{stats.totalProducts}</div>
          <p className="text-xs text-green-600 mt-1">Products in inventory</p>
        </CardContent>
      </Card>

      {/* Total Sales */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-600">Total Sales</CardTitle>
          <Receipt className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{stats.totalSales}</div>
          <p className="text-xs text-purple-600 mt-1">Completed transactions</p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-600">Total Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900">{formatCurrency(stats.totalRevenue)}</div>
          <p className="text-xs text-amber-600 mt-1">Total earnings</p>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-600">Low Stock Alert</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">{stats.lowStockProducts}</div>
          <p className="text-xs text-red-600 mt-1">Products need restocking</p>
        </CardContent>
      </Card>

      {/* Pending Orders */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-600">Pending Orders</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{stats.pendingOrders}</div>
          <p className="text-xs text-orange-600 mt-1">Awaiting processing</p>
        </CardContent>
      </Card>

      {/* Completed Orders */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-600">Completed Orders</CardTitle>
          <CheckCircle className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-900">{stats.completedOrders}</div>
          <p className="text-xs text-emerald-600 mt-1">Successfully processed</p>
        </CardContent>
      </Card>

      {/* Average Order Value */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-indigo-600">Avg Order Value</CardTitle>
          <BarChart3 className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-900">{formatCurrency(stats.averageOrderValue)}</div>
          <p className="text-xs text-indigo-600 mt-1">Per transaction</p>
        </CardContent>
      </Card>
    </div>
  );
} 