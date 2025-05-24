
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Package, AlertTriangle, Users, TrendingDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StockOverview from '@/components/StockOverview';
import AlertsPanel from '@/components/AlertsPanel';
import RequestsPanel from '@/components/RequestsPanel';

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

interface StockAlert {
  id: string;
  product_id: string;
  alert_type: string;
  message: string;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

const EmployeeDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    fetchData();
    setupRealtimeSubscriptions();
    checkEmployee();
  }, []);

  const checkEmployee = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // In a real app, you'd fetch employee data from your employees table
      setEmployee({ name: 'Employee User', role: 'Staff' });
    }
  };

  const fetchData = async () => {
    try {
      const [productsResponse, alertsResponse] = await Promise.all([
        supabase.from('products').select('*').order('name'),
        supabase.from('stock_alerts').select('*').is('resolved_at', null).order('created_at', { ascending: false })
      ]);

      if (productsResponse.data) setProducts(productsResponse.data);
      if (alertsResponse.data) setAlerts(alertsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const productsChannel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        console.log('Product change:', payload);
        fetchData();
      })
      .subscribe();

    const alertsChannel = supabase
      .channel('alerts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_alerts' }, (payload) => {
        console.log('Alert change:', payload);
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(alertsChannel);
    };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/employee-login';
  };

  const lowStockProducts = products.filter(p => p.shelf_stock <= (p.total_stock * 0.3));
  const totalProducts = products.length;
  const totalAlerts = alerts.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
                <p className="text-sm text-gray-600">Smart Shelf Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{employee?.name}</p>
                <p className="text-xs text-gray-600">{employee?.role}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{lowStockProducts.length}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{totalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online</p>
                <p className="text-2xl font-bold text-green-600">Live</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Smart Shelf Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Smart Shelf Alert:</strong> {alerts.length} items need attention due to low shelf stock.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Stock Overview */}
          <div className="xl:col-span-2">
            <StockOverview products={products} />
          </div>

          {/* Side Panels */}
          <div className="space-y-6">
            <AlertsPanel alerts={alerts} />
            <RequestsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
