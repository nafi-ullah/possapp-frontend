import { useState, useEffect } from "react";
import { BackendBaseUrl } from "@/lib/constants";

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

export function useAdminStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [usersResponse, productsResponse, batchesResponse] = await Promise.all([
        fetch(`${BackendBaseUrl}/api/Users`),
        fetch(`${BackendBaseUrl}/api/Products`),
        fetch(`${BackendBaseUrl}/api/Batches`)
      ]);

      const users = usersResponse.ok ? await usersResponse.json() : [];
      const products = productsResponse.ok ? await productsResponse.json() : [];
      const batches = batchesResponse.ok ? await batchesResponse.json() : [];

      // Calculate statistics
      const totalUsers = users.length;
      const totalProducts = products.length;
      const totalSales = batches.filter((batch: any) => batch.status === "Paid").length;
      const lowStockProducts = products.filter((product: any) => product.stockQty <= 10).length;
      const pendingOrders = batches.filter((batch: any) => batch.status === "Created").length;
      const completedOrders = batches.filter((batch: any) => batch.status === "Paid").length;
      const totalRevenue = batches.reduce((sum: number, batch: any) => sum + batch.payable, 0);
      const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

      setStats({
        totalUsers,
        totalProducts,
        totalSales,
        lowStockProducts,
        pendingOrders,
        completedOrders,
        totalRevenue,
        averageOrderValue
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch statistics");
      console.error("Error fetching admin stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
} 