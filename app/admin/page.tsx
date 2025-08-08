"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <Button onClick={() => router.push("/cashier")}>Go to Cashier</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Add admin widgets here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
