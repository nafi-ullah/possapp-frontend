"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Receipt,
  Settings,
  RefreshCw
} from "lucide-react";
import DashboardOverview from "./DashboardOverview";
import UserManagement from "./UserManagement";
import ProductManagement from "./ProductManagement";
import SalesInformation from "./SalesInformation";
import { useAdminStats } from "@/lib/hooks/useAdminStats";

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats, isLoading, error, refetch } = useAdminStats();

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      component: <DashboardOverview stats={stats} />
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      component: <UserManagement />
    },
    {
      id: "products",
      label: "Product Management",
      icon: Package,
      component: <ProductManagement />
    },
    {
      id: "sales",
      label: "Sales Information",
      icon: Receipt,
      component: <SalesInformation />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b">
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refetch}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Tab Content */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">Error loading data: {error}</div>
              <Button onClick={refetch} variant="outline">
                Try Again
              </Button>
            </div>
          )}
          
          {!error && (
            <>
              {isLoading && activeTab === "overview" ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading dashboard data...</p>
                </div>
              ) : (
                tabs.find(tab => tab.id === activeTab)?.component
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 