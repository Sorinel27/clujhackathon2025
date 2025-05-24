
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Users, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleClientContinue = () => {
    navigate('/store');
  };

  const handleEmployeeLogin = () => {
    navigate('/employee-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Assistant</h1>
          <p className="text-gray-600">Welcome to your shopping companion</p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          {/* Client Button */}
          <Button
            onClick={handleClientContinue}
            className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-between px-6 text-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6" />
              <span>Continue as Client</span>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Button>

          {/* Employee Button */}
          <Button
            onClick={handleEmployeeLogin}
            variant="outline"
            className="w-full h-16 border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 text-gray-700 hover:text-orange-700 rounded-xl flex items-center justify-between px-6 text-lg font-medium transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6" />
              <span>Login as Employee</span>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? Ask our staff for assistance
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
