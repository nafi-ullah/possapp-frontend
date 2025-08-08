"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import type { Batch, CheckoutPayload } from "../../lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CashierDashboard() {
  const router = useRouter();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [batchId, setBatchId] = useState<number | null>(null); // stored for reuse
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // checkout state
  const [givenAmount, setGivenAmount] = useState<number>(0);
  const [returnedAmount, setReturnedAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const fetchOrCreateBatch = useCallback(async () => {
    setError(null);
    try {
      // Try to get latest-created
      let latest: Partial<Batch> | null = null;
      try {
        latest = await api<Partial<Batch>>("/api/Batches/latest-created");
      } catch {}

      if (!latest?.id) {
        // create if not exists
        await api("/api/Batches", {
          method: "POST",
          body: JSON.stringify({ status: "created" }),
        });
        // refetch latest
        latest = await api<Partial<Batch>>("/api/Batches/latest-created");
      }

      if (!latest?.id) throw new Error("Unable to get or create a batch.");

      setBatchId(latest.id);
      const detail = await api<Batch>(`/api/Batches/${latest.id}`);
      setBatch(detail);

      // seed checkout
      setGivenAmount(detail.givenAmount ?? 0);
      setReturnedAmount(detail.returnedAmount ?? 0);
      setPaymentMethod(detail.paymentMethod || "Cash");
      setDiscountAmount(detail.discountAmount ?? 0);
      setDiscountPercent(detail.discountPercent ?? 0);
    } catch (err: any) {
      setError(err.message || "Failed to load batch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrCreateBatch();
  }, [fetchOrCreateBatch]);

  // poll every 10s for latest data
  useEffect(() => {
    if (!batchId) return;
    const id = setInterval(async () => {
      try {
        const detail = await api<Batch>(`/api/Batches/${batchId}`);
        setBatch(detail);
      } catch { /* silent */ }
    }, 5_000);
    return () => clearInterval(id);
  }, [batchId]);

  const totals = useMemo(() => {
    const subtotal = batch?.items?.reduce((acc, i) => acc + i.lineTotal, 0) ?? 0;
    const discountByPercent = (subtotal * (discountPercent || 0)) / 100;
    const totalDiscount = (discountAmount || 0) + discountByPercent;
    const payable = Math.max(0, subtotal - totalDiscount);
    const returned = Math.max(0, (givenAmount || 0) - payable);
    return { subtotal, totalDiscount, payable, returned };
  }, [batch, discountAmount, discountPercent, givenAmount]);

  const handleCheckout = async () => {
    if (!batchId) return;
    const payload: CheckoutPayload = {
      status: "CheckedOut",
      givenAmount,
      paymentMethod,
      discountAmount,
      discountPercent,
      returnedAmount: returnedAmount || totals.returned,
    };
    try {
      await api(`/api/Batches/${batchId}/checkout`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      window.location.reload(); // per requirement
    } catch (err: any) {
      setError(err.message || "Checkout failed");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold">Cashier</h1>
          <div className="flex items-center gap-2">
            {batch?.status && <Badge variant="secondary">{batch.status}</Badge>}
            {batch?.batchCode && <Badge>{batch.batchCode}</Badge>}
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Items table */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : (
                <ScrollArea className="h-[55vh] rounded-md">
                  <Table>
                    <TableCaption>Auto-refreshes every 10 seconds</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Barcode</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit</TableHead>
                        <TableHead className="text-right">Line Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batch?.items?.length ? (
                        batch.items.map((it) => (
                          <TableRow key={it.id}>
                            <TableCell className="font-mono text-xs">{it.barcode}</TableCell>
                            <TableCell className="font-medium">{it.productName}</TableCell>
                            <TableCell className="text-right">{it.qty}</TableCell>
                            <TableCell className="text-right">{it.unitPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{it.lineTotal.toFixed(2)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No items yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Summary & checkout */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Batch Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Batch ID</p>
                  <p className="font-medium">{batch?.id ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium truncate">{batch?.customerId ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-medium">{totals.subtotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Discount</p>
                  <p className="font-medium">{totals.totalDiscount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payable</p>
                  <p className="font-semibold">{totals.payable.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{batch?.status ?? "—"}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Given Amount</Label>
                    <Input
                      type="number"
                      value={Number.isFinite(givenAmount) ? givenAmount : 0}
                      onChange={(e) => setGivenAmount(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Returned Amount</Label>
                    <Input
                      type="number"
                      value={Number.isFinite(returnedAmount) ? returnedAmount : 0}
                      onChange={(e) => setReturnedAmount(Number(e.target.value))}
                      placeholder={String(totals.returned.toFixed(2))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Amount</Label>
                    <Input
                      type="number"
                      value={Number.isFinite(discountAmount) ? discountAmount : 0}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Discount %</Label>
                  <Input
                    type="number"
                    value={Number.isFinite(discountPercent) ? discountPercent : 0}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>

                <Button className="w-full h-11 text-base" onClick={handleCheckout} disabled={!batchId}>
                  Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
