
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Request {
  id: string;
  product_id: string;
  status: string;
  district: string;
  requested_at: string;
  delivered_at: string | null;
  scanned_at: string | null;
  handled_by: string | null;
}

const RequestsPanel: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
    setupRealtimeSubscription();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .in('status', ['pending', 'scanning', 'en_route'])
        .order('requested_at', { ascending: false });

      if (error) throw error;
      if (data) setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('requests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => {
        fetchRequests();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        handled_by: 'current_employee' // In a real app, use actual employee ID
      };

      if (newStatus === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
        
        // Decrease shelf stock when item is delivered
        const request = requests.find(r => r.id === requestId);
        if (request) {
          const { error: stockError } = await supabase.rpc('decrease_shelf_stock', {
            product_id: request.product_id
          });
          
          if (stockError) console.error('Error updating stock:', stockError);
        }
      } else if (newStatus === 'scanning') {
        updateData.scanned_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Request Updated",
        description: `Request status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to update request status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'scanning': return 'text-blue-600 bg-blue-50';
      case 'en_route': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Active Requests</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Customer requests in progress</p>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">No active requests</p>
            <p className="text-sm text-gray-500">All requests have been fulfilled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Package className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Request #{request.id.slice(0, 8)}</span>
                    </div>
                    <p className="text-sm text-gray-600">District: {request.district}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.requested_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="flex space-x-2">
                  {request.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => updateRequestStatus(request.id, 'scanning')}
                    >
                      Start Scanning
                    </Button>
                  )}
                  {request.status === 'scanning' && (
                    <Button
                      size="sm"
                      onClick={() => updateRequestStatus(request.id, 'en_route')}
                    >
                      Mark En Route
                    </Button>
                  )}
                  {request.status === 'en_route' && (
                    <Button
                      size="sm"
                      onClick={() => updateRequestStatus(request.id, 'delivered')}
                    >
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPanel;
