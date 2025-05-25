
import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/Product';


interface StockAlert {
  id: string;
  product_id: string;
  alert_type: string;
  message: string;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

interface AlertsPanelProps {
  alerts: StockAlert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const { toast } = useToast();

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('stock_alerts')
        .update({
          resolved_at: new Date().toISOString(),
          resolved_by: 'current_employee' // In a real app, use actual employee ID
        })
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: "Alert Resolved",
        description: "The alert has been marked as resolved.",
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: "Error",
        description: "Failed to resolve alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-900">Smart Shelf Alerts</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Active stock alerts</p>
      </div>

      <div className="p-6">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">No active alerts</p>
            <p className="text-sm text-gray-500">All shelves are properly stocked</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">
                        {alert.alert_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-orange-700 mb-2">{alert.message}</p>
                    <p className="text-xs text-orange-600">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                    className="ml-3"
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
