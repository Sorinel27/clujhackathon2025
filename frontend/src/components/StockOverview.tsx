
import React, { useState } from 'react';
import { Package, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  shelf_stock: number;
  warehouse_stock: number;
  total_stock: number;
  last_updated: string;
}

interface StockOverviewProps {
  products: Product[];
}

const StockOverview: React.FC<StockOverviewProps> = ({ products }) => {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ shelf_stock: number; warehouse_stock: number }>({
    shelf_stock: 0,
    warehouse_stock: 0
  });
  const { toast } = useToast();

  const startEditing = (product: Product) => {
    setEditingProduct(product.id);
    setEditValues({
      shelf_stock: product.shelf_stock,
      warehouse_stock: product.warehouse_stock
    });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditValues({ shelf_stock: 0, warehouse_stock: 0 });
  };

  const saveChanges = async (productId: string) => {
    try {
      const totalStock = editValues.shelf_stock + editValues.warehouse_stock;
      
      const { error } = await supabase
        .from('products')
        .update({
          shelf_stock: editValues.shelf_stock,
          warehouse_stock: editValues.warehouse_stock,
          total_stock: totalStock,
          last_updated: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Stock Updated",
        description: "Product stock levels have been updated successfully.",
      });

      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock levels. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (product: Product) => {
    const shelfPercentage = (product.shelf_stock / product.total_stock) * 100;
    if (shelfPercentage <= 30) return { status: 'critical', color: 'text-red-600 bg-red-50' };
    if (shelfPercentage <= 50) return { status: 'low', color: 'text-orange-600 bg-orange-50' };
    return { status: 'good', color: 'text-green-600 bg-green-50' };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Package className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Live Stock Overview</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Real-time inventory management</p>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">SKU</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Shelf</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Warehouse</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stockStatus = getStockStatus(product);
                const isEditing = editingProduct === product.id;

                return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{product.sku}</td>
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editValues.shelf_stock}
                          onChange={(e) => setEditValues(prev => ({ ...prev, shelf_stock: parseInt(e.target.value) || 0 }))}
                          className="w-20"
                          min="0"
                        />
                      ) : (
                        <span className="text-sm font-medium">{product.shelf_stock}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editValues.warehouse_stock}
                          onChange={(e) => setEditValues(prev => ({ ...prev, warehouse_stock: parseInt(e.target.value) || 0 }))}
                          className="w-20"
                          min="0"
                        />
                      ) : (
                        <span className="text-sm font-medium">{product.warehouse_stock}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium">
                        {isEditing ? editValues.shelf_stock + editValues.warehouse_stock : product.total_stock}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => saveChanges(product.id)}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEditing(product)}>
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockOverview;
