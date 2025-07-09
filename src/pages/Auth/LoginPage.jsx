import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Shield, Check, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../../Contexts/AuthContexts/AuthContextsApi';

const ESolutionsLogo = ({ width = 60, height = 60, className = "" }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 100 100" 
    className={className}
    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#667eea' }} />
        <stop offset="100%" style={{ stopColor: '#764ba2' }} />
      </linearGradient>
      <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffc107' }} />
        <stop offset="100%" style={{ stopColor: '#ff8f00' }} />
      </linearGradient>
    </defs>
    
    {/* Background Circle */}
    <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
    
    {/* Inner Geometric Pattern */}
    <circle cx="50" cy="50" r="35" fill="rgba(255,255,255,0.1)" />
    
    {/* Letter "E" */}
    <g transform="translate(35, 30)">
      <rect x="0" y="0" width="4" height="25" fill="white" />
      <rect x="0" y="0" width="15" height="4" fill="white" />
      <rect x="0" y="10.5" width="12" height="4" fill="url(#accentGradient)" />
      <rect x="0" y="21" width="15" height="4" fill="white" />
    </g>
    
    {/* Connecting dots/nodes pattern */}
    <circle cx="25" cy="25" r="2" fill="rgba(255,255,255,0.6)" />
    <circle cx="75" cy="25" r="2" fill="rgba(255,255,255,0.6)" />
    <circle cx="25" cy="75" r="2" fill="rgba(255,255,255,0.6)" />
    <circle cx="75" cy="75" r="2" fill="rgba(255,255,255,0.6)" />
    
    {/* Connecting lines */}
    <line x1="25" y1="25" x2="35" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    <line x1="75" y1="25" x2="65" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    <line x1="25" y1="75" x2="35" y2="65" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    <line x1="75" y1="75" x2="65" y2="65" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
  </svg>
);

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, user, clearError, requirePasswordChange } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Helper function to save authentication data to localStorage
  const saveAuthDataToLocalStorage = (authData) => {
    try {
      // Save token
      localStorage.setItem('token', authData.Token);
      
      // Save user data
      localStorage.setItem('user', JSON.stringify(authData.User));
      
      // Save role
      localStorage.setItem('role', authData.Role);
      
      // Save permissions
      localStorage.setItem('permissions', JSON.stringify(authData.Permissions));
      
      // Save company data
      localStorage.setItem('company', JSON.stringify(authData.Company));
      
      // Save additional auth info
      localStorage.setItem('isAdmin', authData.IsAdmin.toString());
      localStorage.setItem('requirePasswordChange', authData.RequirePasswordChange.toString());
      
      console.log('Authentication data saved to localStorage successfully');
    } catch (error) {
      console.error('Error saving authentication data to localStorage:', error);
    }
  };

  // Helper function to determine redirect path based on role
  const getRedirectPath = (role) => {
    switch (role) {
      case 'SuperAdmin':
        return '/admin/superadmin/dashboard';
      case 'Admin':
        return '/admin/dashboard';
      case 'Manager':
        return '/admin/dashboard';
      case 'Employee':
        return '/admin/dashboard';
      case 'User':
        return '/dashboard';
      case 'Viewer':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Load remembered credentials on component mount
  useEffect(() => {
    const rememberedCredentials = localStorage.getItem('rememberedCredentials');
    if (rememberedCredentials) {
      try {
        const { email: savedEmail, password: savedPassword } = JSON.parse(rememberedCredentials);
        setEmail(savedEmail || '');
        setPassword(savedPassword || '');
        setRememberMe(true);
      } catch (error) {
        console.error('Error parsing remembered credentials:', error);
        localStorage.removeItem('rememberedCredentials');
      }
    }
  }, []);

  // Role-based navigation after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      // Clear any previous errors
      clearError();
      
      // Handle password change requirement
      if (requirePasswordChange) {
        navigate('/change-password', { replace: true });
        return;
      }

      // Get the user role and navigate accordingly
      const userRole = user.role || user.Role;
      const redirectPath = getRedirectPath(userRole);
      
      console.log('Login successful, user role:', userRole, 'Redirecting to:', redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, clearError, requirePasswordChange]);

  // Form validation
  useEffect(() => {
    setIsFormValid(email.includes('@') && password.length >= 6);
  }, [email, password]);

  // Clear errors when user starts typing
  useEffect(() => {
    if (formError) {
      setFormError('');
    }
    if (error) {
      clearError();
    }
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Call login function which should return the auth response
      const authResponse = await login({ email, password });
      
      console.log('Login response:', authResponse);

      // Save authentication data to localStorage
      if (authResponse && authResponse.Success) {
        saveAuthDataToLocalStorage(authResponse);
        
        // Handle remember me functionality
        if (rememberMe) {
          const credentialsToSave = { email, password };
          localStorage.setItem('rememberedCredentials', JSON.stringify(credentialsToSave));
        } else {
          localStorage.removeItem('rememberedCredentials');
        }
        
        // Navigate based on role
        const redirectPath = getRedirectPath(authResponse.Role);
        console.log('Navigating to:', redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        setFormError(authResponse?.Message || 'Login failed. Please try again.');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setFormError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    
    if (token && storedUser && storedRole) {
      try {
        // const userData = JSON.parse(storedUser);
        const redirectPath = getRedirectPath(storedRole);
        navigate(redirectPath, { replace: true });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
         }}>
      
      {/* Background Elements */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-[40px]"></div>
      <div className="absolute -bottom-16 -left-10 w-96 h-96 bg-white/5 rounded-full blur-[60px]"></div>

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
              <div className="flex flex-col lg:flex-row h-full">
                
                {/* Left Side - Hero Section */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center text-white relative p-16"
                     style={{
                       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                     }}>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-5 right-5 w-15 h-15 bg-white/10 rounded-full"></div>
                  <div className="absolute bottom-8 left-8 w-10 h-10 bg-white/15 rounded-full"></div>

                  <div className="text-center">
                    <div className="mb-12">
                      <div className="bg-white/20 rounded-full p-4 inline-flex mb-6">
                        <ESolutionsLogo width={60} height={60} />
                      </div>
                      <h1 className="text-5xl font-bold mb-4">
                        Welcome Back to <span className="text-yellow-400">E</span>Solution
                      </h1>
                      <div className="bg-white/20 text-gray-900 px-4 py-2 rounded-full inline-block text-lg font-medium">
                        Enterprise Resource Planning
                      </div>
                    </div>
                    
                    <div className="mb-12">
                      <h3 className="text-2xl mb-6 font-semibold">Your Business Command Center</h3>
                      <p className="text-xl mb-6 opacity-90 leading-relaxed">
                        Access your comprehensive business management platform and take control of your operations.
                      </p>
                    </div>
                    
                    <div className="space-y-4 text-left max-w-sm mx-auto">
                      <div className="flex items-center">
                        <div className="bg-green-500/20 p-2 rounded-full mr-4">
                          <Shield size={20} />
                        </div>
                        <span className="font-medium text-lg">Secure Authentication</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-green-500/20 p-2 rounded-full mr-4">
                          <Check size={20} />
                        </div>
                        <span className="font-medium text-lg">Real-time Dashboard</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-green-500/20 p-2 rounded-full mr-4">
                          <Star size={20} />
                        </div>
                        <span className="font-medium text-lg">Advanced Analytics</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center">
                  <div className="w-full p-6 md:p-12">
                    
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8">
                      <ESolutionsLogo width={60} height={60} />
                      <h2 className="text-2xl font-bold mt-2">
                        <span className="text-blue-600">E</span>Solution
                      </h2>
                      <p className="text-gray-600">Enterprise Resource Planning</p>
                    </div>

                    {/* Login Form Header */}
                    <div className="text-center mb-8">
                      <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                        <Lock size={28} className="text-blue-600" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                      <p className="text-gray-600 text-lg">Sign in to access your dashboard</p>
                    </div>

                    {/* Error Alert */}
                    {(formError || error) && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                        <div className="flex items-center">
                          <Shield className="mr-2" size={18} />
                          <span>{formError || error}</span>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="block w-full pl-10 pr-3 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                            required
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="block w-full pl-10 pr-12 py-3 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="rememberMe"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                            Remember credentials
                          </label>
                        </div>
                        <Link 
                          to="/forgot-password" 
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                        >
                          Forgot Password?
                        </Link>
                      </div>

                      {/* Login Button */}
                      <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        style={{
                          background: isLoading || !isFormValid 
                            ? '#9CA3AF' 
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Signing you in...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <span>Sign In to Dashboard</span>
                            <ArrowRight className="ml-2" size={18} />
                          </div>
                        )}
                      </button>

                      {/* Form Validation Indicator */}
                      {email && password && (
                        <div className="text-center">
                          <span className={`text-sm font-medium ${isFormValid ? 'text-green-600' : 'text-gray-500'}`}>
                            {isFormValid ? (
                              <span className="flex items-center justify-center">
                                <Check className="mr-1" size={14} />
                                Form is ready to submit
                              </span>
                            ) : (
                              'Please check your email format and password length'
                            )}
                          </span>
                        </div>
                      )}

                      {/* Signup Link */}
                      <div className="text-center">
                        <p className="text-gray-600">
                          Don't have an account?{' '}
                          <Link 
                            to="/signup" 
                            className="font-bold text-blue-600 hover:text-blue-500 transition-colors duration-200"
                          >
                            Create Account
                          </Link>
                        </p>
                      </div>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-6 p-3 rounded-xl bg-gray-50">
                      <div className="flex items-center text-gray-600">
                        <Shield className="mr-2" size={16} />
                        <small>Your connection is secure and encrypted</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;