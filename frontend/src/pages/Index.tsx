import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import StatusPanel from '../components/StatusPanel';
import AIAssistant from '../components/AIAssistant';
import { Search, MapPin, Clock, Package } from 'lucide-react';
import { Product } from '../types/Product';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products", err));
  }, []);


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductRequest = (product: Product) => {
    setSelectedProduct(product);
    if (product.availability === 'warehouse') {
      setRequestStatus('requested');
      setShowAssistant(true);
      // Simulate status progression
      setTimeout(() => setRequestStatus('scanning'), 2000);
      setTimeout(() => setRequestStatus('en_route'), 5000);
      setTimeout(() => setRequestStatus('arriving'), 8000);
    } else if (product.availability === 'out_of_stock') {
      setShowAssistant(true);
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Smart-Shelf Agent </h1>
                <p className="text-sm text-gray-600">BitStorm Solutions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Bosch Center, Cluj-Napoca </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search for drills, saws, tools..."
              />
            </div>

            {/* Products Grid */}
            <div className="space-y-4">
              {searchQuery && (
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Search Results ({filteredProducts.length})
                  </h2>
                  <div className="text-sm text-gray-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Updated 2 min ago
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onRequest={() => handleProductRequest(product)}
                  />
                ))}
              </div>

              {searchQuery && filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or browse by category</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Panel */}
            {requestStatus && selectedProduct && (
              <StatusPanel
                status={requestStatus}
                product={selectedProduct}
                onClose={() => {
                  setRequestStatus(null);
                  setSelectedProduct(null);
                }}
              />
            )}

            {/* AI Assistant */}
            <AIAssistant
              product={selectedProduct}
              onClose={() => setShowAssistant(false)}
            />
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Search className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Browse All Categories</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Store Map</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Package className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">My Requests</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
