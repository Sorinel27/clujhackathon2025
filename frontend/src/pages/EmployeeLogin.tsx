
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_code: '',
    password: ''
  });

  const handleBack = () => {
    navigate('/');
  };

  const handleLogin = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        employee_code: formData.employee_code,
        password: formData.password,
      })
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();
    console.log("Logged in:", data);
    
    // Save to localStorage/sessionStorage if needed
    localStorage.setItem("employee", JSON.stringify(data));
    
    // Redirect to dashboard
    window.location.href = "/employee-dashboard";
  } catch (err) {
    alert("Login failed: " + err.message);
  }
};

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-6 p-2 hover:bg-white/50 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Login</h1>
          <p className="text-gray-600">Access the Smart Shelf management system</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="employee_code" className="text-sm font-medium text-gray-700">
              Employee ID
            </Label>
            <Input
              id="employee_code"
              type="text"
              value={formData.employee_code}
              onChange={(e) => handleInputChange('employee_code', e.target.value)}
              placeholder="Enter your employee ID"
              className="h-12 text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                className="h-12 text-base pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-lg font-medium transition-all duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Demo Instructions */}
        <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">Demo Instructions:</p>
          <p className="text-xs text-blue-700">
            Use any Employee ID (e.g., "EMP001") and password (e.g., "password123"). 
            Account will be created automatically for demo purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
