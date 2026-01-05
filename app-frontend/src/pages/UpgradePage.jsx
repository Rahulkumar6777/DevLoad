// UpgradePage.jsx
import React, { useState, useEffect } from 'react';
import { FaProjectDiagram, FaDatabase, FaKey, FaServer, FaBolt, FaInfinity, FaHeadset, FaTimes, FaCrown, FaGem } from 'react-icons/fa';
import PaymentGateway from '../components/PaymentGateway';
import { useSelector } from 'react-redux';

const UpgradePage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const { subscription } = useSelector((state) => state.bootstrap);
  

  const isPro = subscription?.plan === 'member';

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "₹0 / month",
      features: [
        { icon: <FaProjectDiagram className="text-blue-400" />, text: "1 Project", highlight: false },
        { icon: <FaDatabase className="text-blue-400" />, text: "1024MB Storage", highlight: false },
        { icon: <FaKey className="text-blue-400" />, text: "1 API Key per Project", highlight: false },
        { icon: <FaServer className="text-blue-400" />, text: "10GB Bandwidth", highlight: false },
        { icon: <FaBolt className="text-yellow-400" />, text: "1500 Requests", highlight: true },
        { icon: <FaInfinity className="text-blue-400" />, text: "Caching on Public URLs", highlight: false }
      ],
      buttonText: "Get Started",
      buttonColor: "from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700",
      bgColor: "bg-gradient-to-br from-gray-800/50 to-gray-900/70",
      borderColor: "border-gray-700",
      textColor: "text-blue-400",
      isPopular: false
    },
    {
      id: "pro",
      name: "Member Plan",
      price: "₹499 / month",
      features: [
        { icon: <FaProjectDiagram className="text-blue-400" />, text: "5 Projects", highlight: false },
        { icon: <FaDatabase className="text-blue-400" />, text: "5120MB Storage", highlight: false },
        { icon: <FaKey className="text-blue-400" />, text: "5 API Keys per Project", highlight: false },
        { icon: <FaInfinity className="text-purple-500" />, text: "100GB Bandwidth", highlight: true },
        { icon: <FaBolt className="text-blue-400" />, text: "15,000 Requests", highlight: false },
        { icon: <FaHeadset className="text-yellow-400" />, text: "Priority Support", highlight: true }
      ],
      buttonText: "Upgrade Now",
      buttonColor: "from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500",
      bgColor: "bg-gradient-to-br from-blue-900/30 to-purple-900/30",
      borderColor: "border-blue-500/50",
      textColor: "text-white",
      isPopular: true,
      glow: true
    }
  ];

  
  const DISCOUNT_RATES = {
    1: 2,
    3: 4,
    6: 8,
    12: 10,
    24: 15
  };

  
  const calculatePrice = (months) => {
    const basePrice = 299;
    const discount = DISCOUNT_RATES[months] || 0;
    const total = months * basePrice;
    return total * (1 - discount / 100);
  };

  const currentPrice = calculatePrice(selectedMonths);
  const savings = (499 * selectedMonths) - currentPrice;

  const handlePlanSelect = (plan) => {
    if (plan.id === "free") {
      window.history.back();
    } else {
      setSelectedPlan(plan);
      setShowCart(true);
    }
  };

  const handleBackToPlans = () => {
    setShowCart(false);
    setSelectedPlan(null);
  };

  if (showCart && selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8 flex justify-center items-start pt-6 md:pt-12">
        <div className="bg-gray-900 rounded-2xl w-full max-w-4xl border border-gray-700 shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <FaGem className="text-purple-500 text-xl" />
              <h2 className="text-white text-xl font-bold">Your Cart</h2>
            </div>
            <button onClick={() => window.history.back()} className="text-gray-400 hover:text-white transition-colors">
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                <FaCrown className="text-yellow-400" /> {selectedPlan.name}
              </h3>
              
              <div className="mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-gray-300 text-sm font-medium mb-1">Subscription Period</h4>
                    <div className="flex flex-wrap gap-2">
                      {[1, 3, 6, 12, 24].map(monthsOption => (
                        <button
                          key={monthsOption}
                          onClick={() => setSelectedMonths(monthsOption)}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            selectedMonths === monthsOption
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {monthsOption} {monthsOption === 1 ? 'month' : 'months'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 text-sm font-semibold">SAVE ₹{savings.toFixed(2)}</div>
                    <div className="text-white font-bold text-xl">₹{currentPrice.toFixed(2)}</div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm mt-3">
                  <span className="line-through">₹{(499 * selectedMonths).toFixed(2)}</span>
                  <span> (₹{(currentPrice / selectedMonths).toFixed(2)}/month)</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Renews at ₹499/month after {selectedMonths} months.
              </p>

              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-800/30 rounded-lg p-4 mb-4">
                <p className="text-green-400 text-sm">
                   Instant upgrade after payment
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Plan Features:</h3>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, idx) => (
                    <li 
                      key={idx} 
                      className={`flex items-center text-sm ${feature.highlight ? 'text-blue-300' : 'text-gray-400'}`}
                    >
                      <span className="mr-2">{feature.icon}</span>
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                Order Summary
              </h3>
              
              <div className="mb-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-300">{selectedMonths} months plan</span>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm line-through">₹{(499 * selectedMonths).toFixed(2)}</div>
                    <div className="text-white font-medium">₹{currentPrice.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-300">Discount ({DISCOUNT_RATES[selectedMonths]}%)</span>
                  <span className="text-green-400 font-medium">-₹{savings.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Priority Support</span>
                  <span className="text-green-400">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-700 mt-4">
                <div>
                  <span className="text-gray-300 font-medium">Subtotal</span>
                </div>
                <span className="text-white text-xl font-bold">₹{currentPrice.toFixed(2)}</span>
              </div>

              <div className="mt-6">
                <PaymentGateway
                  amount={currentPrice * 100}
                  months={selectedMonths}
                  description={`${selectedPlan.name} for ${selectedMonths} months`}
                  buttonText={`Pay ₹${currentPrice.toFixed(2)} Now`}
                />
              </div>

              <div className="mt-5 pt-4 border-t border-gray-700">
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={handleBackToPlans}
                    className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
                  >
                    ← Back to plans
                  </button>
                  
                  <button 
                    onClick={() => window.history.back()}
                    className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8 flex justify-center items-start pt-4 md:pt-6">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-6xl border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
          <div>
            <h1 className="text-white text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-gray-400 mt-2">Select the plan that works best for you</p>
          </div>
          <button onClick={() => window.history.back()} className="text-gray-400 hover:text-white transition-colors">
            <FaTimes className="w-7 h-7" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`${plan.bgColor} rounded-xl p-7 border ${plan.borderColor} relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.glow ? 'ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                  MOST POPULAR
                </div>
              )}
              
              <div className="mb-5">
                <h3 className={`text-xl font-bold mb-1 ${plan.textColor}`}>{plan.name}</h3>
                <div className="text-2xl font-bold text-white">{plan.price}</div>
                {plan.id === "pro" && (
                  <p className="text-gray-400 text-sm mt-1">Billed annually or monthly</p>
                )}
              </div>
              
              <ul className="space-y-3.5 mb-7">
                {plan.features.map((feature, idx) => (
                  <li 
                    key={idx} 
                    className={`flex items-center text-base ${feature.highlight ? 'text-blue-300 font-medium' : 'text-gray-400'}`}
                  >
                    <span className="mr-3 text-lg">{feature.icon}</span>
                    {feature.text}
                  </li>
                ))}
              </ul>
              
              {plan.id === "pro" && isPro ? (
                <div className="bg-green-900/30 text-green-400 font-semibold py-3 px-4 rounded-lg text-center border border-green-800/50">
                   You're already a Member
                </div>
              ) : (
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full bg-gradient-to-r ${plan.buttonColor} text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg ${
                    plan.isPopular ? 'shadow-blue-500/30' : 'shadow-gray-700/30'
                  }`}
                >
                  {plan.buttonText}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="bg-blue-900/20 px-4 py-2 rounded-full text-blue-400 text-sm border border-blue-800/30 flex items-center gap-2">
            <span></span> Secure payments
          </div>
          <div className="bg-purple-900/20 px-4 py-2 rounded-full text-purple-400 text-sm border border-purple-800/30 flex items-center gap-2">
            <span></span> Instant activation
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;