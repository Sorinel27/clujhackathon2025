import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Users, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleClientContinue = () => navigate('/store');
  const handleEmployeeLogin = () => navigate('/employee-login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-orange-500 rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-5 animate-slow-pulse">
            <Package className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-1">Smart Shelf</h1>
          <p className="text-gray-500 text-base">Your in-store shopping companion</p>
        </div>

        {/* Login Options */}
        <div className="space-y-6">
          <Button
            onClick={handleClientContinue}
            className="w-full h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-between px-8 text-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <Users className="w-7 h-7" />
              <span>Continue as Client</span>
            </div>
            <ArrowRight className="w-6 h-6" />
          </Button>

          <Button
            onClick={handleEmployeeLogin}
            variant="outline"
            className="w-full h-20 border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 text-gray-700 hover:text-orange-700 rounded-2xl flex items-center justify-between px-8 text-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center space-x-4">
              <Package className="w-7 h-7" />
              <span>Login as Employee</span>
            </div>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-400 hover:text-gray-600 transition">
            Need help? Ask a staff member for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
