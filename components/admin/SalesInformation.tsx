"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackendBaseUrl } from "@/lib/constants";
import { Receipt, DollarSign, ShoppingCart, TrendingUp, RefreshCw, Package } from "lucide-react";

interface SaleItem {
  id: number;
  barcode: string;
  productName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

interface Batch {
  id: number;
  batchCode: string;
  customerId: string;
  status: string;
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  payable: number;
  givenAmount: number;
  paymentMethod: string;
  returnedAmount: number;
  productId: number | null;
  productName: string | null;
  items: SaleItem[];
}

export default function SalesInformation() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [itemsViewBatch, setItemsViewBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    givenAmount: 0,
    paymentMethod: "",
    discountAmount: 0,
    discountPercent: 0,
    returnedAmount: 0
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetch(`${BackendBaseUrl}/api/Batches`);
      if (response.ok) {
        const data = await response.json();
        setBatches(data);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const handleStatusUpdate = async (batchId: number) => {
    if (!updateData.status) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${BackendBaseUrl}/api/Batches/${batchId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        setUpdateData({
          status: "",
          givenAmount: 0,
          paymentMethod: "",
          discountAmount: 0,
          discountPercent: 0,
          returnedAmount: 0
        });
        setSelectedBatch(null);
        fetchBatches();
      }
    } catch (error) {
      console.error("Error updating batch status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Created": return "bg-blue-100 text-blue-800";
      case "Paid": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      case "Returned": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Cash": return "💵";
      case "Card": return "💳";
      case "UPI": return "📱";
      default: return "❓";
    }
  };

  const totalRevenue = batches.reduce((sum, batch) => sum + batch.payable, 0);
  const totalOrders = batches.length;
  const pendingOrders = batches.filter(batch => batch.status === "Created").length;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Sales Information
        </CardTitle>
        <Button onClick={fetchBatches} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sales Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-900">${totalRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Orders</p>
                  <p className="text-2xl font-bold text-green-900">{totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-orange-900">{pendingOrders}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Batches Table */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sales Batches</Label>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Payable</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{batch.batchCode}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto font-normal"
                        onClick={() => setItemsViewBatch(batch)}
                      >
                        <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                          {batch.items.length} items
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell>${batch.subtotal}</TableCell>
                    <TableCell className="font-semibold">${batch.payable}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <span>{getPaymentMethodIcon(batch.paymentMethod)}</span>
                      <span className="text-sm">{batch.paymentMethod || "None"}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBatch(batch)}
                        >
                          Manage
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {batches.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No sales batches found
              </div>
            )}
          </div>
        </div>

        {/* Quick Items View Modal */}
        {itemsViewBatch && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Sales Items: {itemsViewBatch.batchCode}</CardTitle>
                  <div className="text-sm text-gray-600">
                    Status: <Badge className={getStatusColor(itemsViewBatch.status)}>{itemsViewBatch.status}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setItemsViewBatch(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {itemsViewBatch.items && itemsViewBatch.items.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-xs">Barcode</TableHead>
                        <TableHead className="text-xs">Product Name</TableHead>
                        <TableHead className="text-xs">Quantity</TableHead>
                        <TableHead className="text-xs">Unit Price</TableHead>
                        <TableHead className="text-xs">Line Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itemsViewBatch.items.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-xs">{item.barcode}</TableCell>
                          <TableCell className="text-sm font-medium">{item.productName}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{item.qty}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">${item.unitPrice}</TableCell>
                          <TableCell className="text-sm font-semibold text-green-600">
                            ${item.lineTotal}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No items in this batch</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setItemsViewBatch(null);
                    setSelectedBatch(itemsViewBatch);
                  }}
                  className="flex-1"
                >
                  Manage Batch
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setItemsViewBatch(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Batch Management Modal */}
        {selectedBatch && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Manage Batch: {selectedBatch.batchCode}</CardTitle>
              <div className="text-sm text-gray-600">
                Customer ID: {selectedBatch.customerId}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sales Items Details */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Sales Items</Label>
                {selectedBatch.items && selectedBatch.items.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-xs">Barcode</TableHead>
                          <TableHead className="text-xs">Product Name</TableHead>
                          <TableHead className="text-xs">Quantity</TableHead>
                          <TableHead className="text-xs">Unit Price</TableHead>
                          <TableHead className="text-xs">Line Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBatch.items.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="font-mono text-xs">{item.barcode}</TableCell>
                            <TableCell className="text-sm font-medium">{item.productName}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{item.qty}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">${item.unitPrice}</TableCell>
                            <TableCell className="text-sm font-semibold text-green-600">
                              ${item.lineTotal}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                    <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No items in this batch</p>
                  </div>
                )}
              </div>

              {/* Batch Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Subtotal</p>
                  <p className="text-lg font-semibold text-gray-900">${selectedBatch.subtotal}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Discount</p>
                  <p className="text-lg font-semibold text-orange-600">${selectedBatch.discountAmount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Payable</p>
                  <p className="text-lg font-semibold text-green-600">${selectedBatch.payable}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Items</p>
                  <p className="text-lg font-semibold text-blue-600">{selectedBatch.items.length}</p>
                </div>
              </div>

              {/* Update Form */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">Update Batch Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select value={updateData.status} onValueChange={(value) => setUpdateData({ ...updateData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Created">Created</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    placeholder="Given Amount"
                    value={updateData.givenAmount}
                    onChange={(e) => setUpdateData({ ...updateData, givenAmount: Number(e.target.value) })}
                  />
                  
                  <Select value={updateData.paymentMethod} onValueChange={(value) => setUpdateData({ ...updateData, paymentMethod: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    type="number"
                    placeholder="Discount Amount"
                    value={updateData.discountAmount}
                    onChange={(e) => setUpdateData({ ...updateData, discountAmount: Number(e.target.value) })}
                  />
                  
                  <Input
                    type="number"
                    placeholder="Discount %"
                    value={updateData.discountAmount}
                    onChange={(e) => setUpdateData({ ...updateData, discountPercent: Number(e.target.value) })}
                  />
                  
                  <Input
                    type="number"
                    placeholder="Returned Amount"
                    value={updateData.returnedAmount}
                    onChange={(e) => setUpdateData({ ...updateData, returnedAmount: Number(e.target.value) })}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStatusUpdate(selectedBatch.id)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Updating..." : "Update Batch"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedBatch(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
} 