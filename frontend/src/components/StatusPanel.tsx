
import React from 'react';
import { X, Package, User, MapPin, Clock, CheckCircle } from 'lucide-react';

interface StatusPanelProps {
  status: string;
  product: any;
  onClose: () => void;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ status, product, onClose }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'requested':
        return {
          title: 'Request Sent',
          message: 'We received your request and are processing it...',
          icon: Package,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          progress: 25
        };
      case 'scanning':
        return {
          title: 'Item Located',
          message: 'Staff member is collecting your item from warehouse',
          icon: User,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          progress: 50
        };
      case 'en_route':
        return {
          title: 'On the Way',
          message: 'Staff member is heading to your location',
          icon: MapPin,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          progress: 75
        };
      case 'arriving':
        return {
          title: 'Almost Here!',
          message: 'Staff member will arrive in 1-2 minutes',
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          progress: 100
        };
      default:
        return {
          title: 'Processing',
          message: 'Please wait...',
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          progress: 0
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Request Status</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Status Content */}
      <div className="p-6">
        {/* Product Info */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover bg-gray-100"
            />
            <div>
              <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
              <p className="text-sm text-gray-600">{product.brand}</p>
            </div>
          </div>
        </div>

        {/* Status Icon and Info */}
        <div className={`p-4 rounded-xl ${statusInfo.bgColor} mb-4`}>
          <div className="flex items-center space-x-3 mb-2">
            <Icon className={`w-6 h-6 ${statusInfo.color}`} />
            <h4 className={`text-lg font-semibold ${statusInfo.color}`}>
              {statusInfo.title}
            </h4>
          </div>
          <p className="text-gray-700">{statusInfo.message}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{statusInfo.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${statusInfo.color.replace('text-', 'bg-')}`}
              style={{ width: `${statusInfo.progress}%` }}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <div className={`flex items-center space-x-3 ${status === 'requested' || status === 'scanning' || status === 'en_route' || status === 'arriving' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${status === 'requested' || status === 'scanning' || status === 'en_route' || status === 'arriving' ? 'bg-green-600' : 'bg-gray-300'}`} />
            <span className="text-sm">Request received</span>
          </div>
          <div className={`flex items-center space-x-3 ${status === 'scanning' || status === 'en_route' || status === 'arriving' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${status === 'scanning' || status === 'en_route' || status === 'arriving' ? 'bg-green-600' : 'bg-gray-300'}`} />
            <span className="text-sm">Item scanned by staff</span>
          </div>
          <div className={`flex items-center space-x-3 ${status === 'en_route' || status === 'arriving' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${status === 'en_route' || status === 'arriving' ? 'bg-green-600' : 'bg-gray-300'}`} />
            <span className="text-sm">Staff en route to customer</span>
          </div>
          <div className={`flex items-center space-x-3 ${status === 'arriving' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${status === 'arriving' ? 'bg-green-600' : 'bg-gray-300'}`} />
            <span className="text-sm">Arriving at location</span>
          </div>
        </div>

        {/* ETA */}
        {(status === 'en_route' || status === 'arriving') && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {status === 'arriving' ? 'ETA: 1-2 minutes' : 'ETA: 3-5 minutes'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPanel;
