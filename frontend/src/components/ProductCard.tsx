
import React from 'react';
import { Package, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { Product } from '@/types/Product';

interface ProductCardProps {
  product: Product;
  onRequest: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onRequest }) => {
  const getAvailabilityInfo = () => {
    switch (product.availability) {
      case 'shelf':
        return {
          icon: CheckCircle,
          text: 'On Shelf',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          buttonText: 'View Location',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'warehouse':
        return {
          icon: Package,
          text: 'In Warehouse',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          buttonText: 'Request Item',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'out_of_stock':
        return {
          icon: AlertCircle,
          text: 'Out of Stock',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonText: 'Show Alternatives',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
      default:
        return {
          icon: AlertCircle,
          text: 'Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          buttonText: 'Check Status',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const availabilityInfo = getAvailabilityInfo();
  const Icon = availabilityInfo.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img 
          src={product.image || "/placeholder.jpg"} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border ${availabilityInfo.bgColor} ${availabilityInfo.borderColor}`}>
          <div className="flex items-center space-x-1">
            <Icon className={`w-4 h-4 ${availabilityInfo.color}`} />
            <span className={`text-sm font-medium ${availabilityInfo.color}`}>
              {availabilityInfo.text}
            </span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
              {product.brand}
            </span>
            <span className="text-2xl font-bold text-gray-900">
              €{product.price}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Stock Info */}
        {product.availability !== 'out_of_stock' && (
          <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>
              {product.availability === 'shelf' 
                ? `${product.shelf_stock} available on shelf`
                : `${product.warehouse_stock} available in warehouse`
              }
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onRequest}
          className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-colors duration-200 ${availabilityInfo.buttonColor}`}
        >
          {availabilityInfo.buttonText}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
