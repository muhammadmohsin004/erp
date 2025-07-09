import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Shield, Check, AlertCircle, Key } from 'lucide-react';
import { useAuth } from '../../Contexts/AuthContexts/AuthContextsApi';


const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError } = useAuth();
  
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Clear errors when user starts typing
  useEffect(() => {
    if (formErrors.password || formErrors.confirmPassword) {
      setFormErrors({});
    }
    if (error) clearError();
  }, [password, confirmPassword]);

  // Check for token on component mount
  useEffect(() => {
    if (!token) {
      setMessage('Invalid or missing reset token. Please request a new password reset.');
      setMessageType('error');
    }
  }, [token]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!token) {
      newErrors.token = 'Invalid or missing token';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateForm()) {
      return;
    }

    try {
      const resetData = {
        token: token,
        newPassword: password,
        confirmPassword: confirmPassword
      };

      const result = await resetPassword(resetData);
      
      if (result) {
        setMessage('Password has been reset successfully! Redirecting to login...');
        setMessageType('success');
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setMessage(err.message || 'Failed to reset password. Please try again.');
      setMessageType('error');
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    let label = '';
    let color = '';
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    switch (strength) {
      case 0:
      case 1:
        label = 'Weak';
        color = 'bg-red-500';
        break;
      case 2:
      case 3:
        label = 'Medium';
        color = 'bg-yellow-500';
        break;
      case 4:
      case 5:
        label = 'Strong';
        color = 'bg-green-500';
        break;
      default:
        label = '';
        color = '';
    }
    
    return { strength: (strength / 5) * 100, label, color };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
         }}>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-white/10 rounded-full top-[15%] left-[10%] animate-pulse"></div>
        <div className="absolute w-48 h-48 bg-white/10 rounded-full bottom-[25%] right-[15%] animate-pulse delay-1000"></div>
        <div className="absolute w-32 h-32 bg-white/5 rounded-full top-[60%] left-[80%] animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center">
          <div className="w-full max-w-md">

            {/* Main Card */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="p-8">

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                       style={{
                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                         boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                       }}>
                    <Key size={32} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Reset Password
                  </h2>
                  <p className="text-gray-600">
                    Enter your new password below to secure your account.
                  </p>
                </div>

                {/* Alert Messages */}
                {(message || error) && (
                  <div className={`border rounded-xl p-4 mb-6 ${
                    messageType === 'success'
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-red-50 border-red-200 text-red-700'
                  } transition-all duration-300`}>
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {messageType === 'success' ? (
                          <Check size={20} />
                        ) : (
                          <AlertCircle size={20} />
                        )}
                      </div>
                      <span className="text-sm">
                        {message || error}
                      </span>
                    </div>
                  </div>
                )}

                {/* Token Error */}
                {!token && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    <div className="flex items-center">
                      <AlertCircle className="mr-2" size={18} />
                      <span className="text-sm">Invalid or missing reset token. Please request a new password reset.</span>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* New Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block w-full pl-10 pr-12 py-4 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                          formErrors.password ? 'ring-2 ring-red-500' : ''
                        }`}
                        style={{
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Password Strength</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.label === 'Strong' ? 'text-green-600' :
                            passwordStrength.label === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {formErrors.password && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`block w-full pl-10 pr-12 py-4 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                          formErrors.confirmPassword ? 'ring-2 ring-red-500' : ''
                        }`}
                        style={{
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Password Match Indicator */}
                  {password && confirmPassword && (
                    <div className={`flex items-center text-sm ${
                      password === confirmPassword ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {password === confirmPassword ? (
                        <Check className="mr-2" size={16} />
                      ) : (
                        <AlertCircle className="mr-2" size={16} />
                      )}
                      <span>
                        {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                      </span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !token || !password || !confirmPassword}
                    className="w-full py-4 px-4 border border-transparent rounded-xl shadow-sm text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    style={{
                      background: (isLoading || !token || !password || !confirmPassword)
                        ? '#9CA3AF' 
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Resetting Password...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Key className="mr-2" size={20} />
                        Reset Password
                      </div>
                    )}
                  </button>
                </form>

                {/* Footer Links */}
                <div className="text-center mt-8 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 mb-2">
                    Remember your password?
                  </p>
                  <Link 
                    to="/login"
                    className="text-blue-600 font-semibold hover:text-blue-500 transition-colors duration-200"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-md">
              <div className="flex items-center text-white text-sm">
                <Shield className="mr-2" size={16} />
                <span>Your connection is secure and encrypted</span>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="mt-4 p-4 rounded-xl bg-white/10 backdrop-blur-md">
              <h4 className="text-white font-semibold mb-2 text-sm">Password Requirements:</h4>
              <ul className="text-white text-xs space-y-1">
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${password.length >= 8 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  At least 8 characters long
                </li>
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(password) ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  Contains uppercase letter
                </li>
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(password) ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  Contains lowercase letter
                </li>
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${/[0-9]/.test(password) ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  Contains number
                </li>
                <li className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  Contains special character
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;