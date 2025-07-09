import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, Shield, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../Contexts/AuthContexts/AuthContextsApi';

const ForgotPassword = () => {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [formError, setFormError] = useState('');

  // Clear errors when user starts typing
  useEffect(() => {
    if (formError) setFormError('');
    if (error) clearError();
  }, [email]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setMessage('');

    // Validation
    if (!email) {
      setFormError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    try {
      const result = await forgotPassword(email);
      
      if (result) {
        setMessage('If your email is correct, please check your inbox. We have sent you a password reset link.');
        setMessageType('success');
        setEmail(''); // Clear form on success
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setMessage(err.message || 'Something went wrong. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
         }}>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-white/10 rounded-full top-[10%] left-[10%] animate-pulse"></div>
        <div className="absolute w-48 h-48 bg-white/10 rounded-full bottom-[20%] right-[15%] animate-pulse delay-1000"></div>
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
                    <Mail size={32} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-gray-600">
                    No worries! Enter your email and we'll send you a reset link.
                  </p>
                </div>

                {/* Alert Messages */}
                {(message || error || formError) && (
                  <div className={`border rounded-xl p-4 mb-6 ${
                    messageType === 'success' || message
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-red-50 border-red-200 text-red-700'
                  } transition-all duration-300`}>
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {messageType === 'success' || message ? (
                          <Check size={20} />
                        ) : (
                          <AlertCircle size={20} />
                        )}
                      </div>
                      <span className="text-sm">
                        {message || error || formError}
                      </span>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block w-full pl-10 pr-3 py-4 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                          formError && !email ? 'ring-2 ring-red-500' : ''
                        }`}
                        style={{
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-4 border border-transparent rounded-xl shadow-sm text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    style={{
                      background: isLoading 
                        ? '#9CA3AF' 
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending Reset Link...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="mr-2" size={20} />
                        Send Reset Link
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
                    Back to Sign In
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;