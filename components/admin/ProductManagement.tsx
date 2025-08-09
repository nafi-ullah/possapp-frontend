"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackendBaseUrl } from "@/lib/constants";
import { Package, Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Product {
  id: number;
  barcode: string;
  name: string;
  unit: string;
  sellPrice: number;
  stockQty: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    barcode: "",
    name: "",
    unit: "",
    sellPrice: 0,
    stockQty: 0
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BackendBaseUrl}/api/Products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.barcode || !newProduct.name || !newProduct.unit) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${BackendBaseUrl}/api/Products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      
      if (response.ok) {
        setNewProduct({ barcode: "", name: "", unit: "", sellPrice: 0, stockQty: 0 });
        fetchProducts();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BackendBaseUrl}/api/Products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name,
          unit: product.unit,
          sellPrice: product.sellPrice,
          stockQty: product.stockQty
        }),
      });
      
      if (response.ok) {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await fetch(`${BackendBaseUrl}/api/Products/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const startEditing = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Package className="h-5 w-5" />
          Product Management
        </CardTitle>
        <Button onClick={fetchProducts} variant="outline" size="sm">
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create Product Form */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <Input
            placeholder="Barcode"
            value={newProduct.barcode}
            onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
          />
          <Input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <Input
            placeholder="Unit"
            value={newProduct.unit}
            onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Sell Price"
            value={newProduct.sellPrice}
            onChange={(e) => setNewProduct({ ...newProduct, sellPrice: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Stock Qty"
            value={newProduct.stockQty}
            onChange={(e) => setNewProduct({ ...newProduct, stockQty: Number(e.target.value) })}
          />
          <Button onClick={handleCreateProduct} disabled={isLoading} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>

        {/* Products Table */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Products Inventory</Label>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-sm">{product.barcode}</TableCell>
                    <TableCell>
                      {editingProduct?.id === product.id ? (
                        <Input
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        />
                      ) : (
                        product.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProduct?.id === product.id ? (
                        <Input
                          value={editingProduct.unit}
                          onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                        />
                      ) : (
                        product.unit
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProduct?.id === product.id ? (
                        <Input
                          type="number"
                          value={editingProduct.sellPrice}
                          onChange={(e) => setEditingProduct({ ...editingProduct, sellPrice: Number(e.target.value) })}
                        />
                      ) : (
                        `$${product.sellPrice}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProduct?.id === product.id ? (
                        <Input
                          type="number"
                          value={editingProduct.stockQty}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stockQty: Number(e.target.value) })}
                        />
                      ) : (
                        <Badge variant={product.stockQty > 10 ? "default" : "destructive"}>
                          {product.stockQty}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProduct?.id === product.id ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateProduct(editingProduct)}
                            disabled={isLoading}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEditing(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {products.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No products found
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 