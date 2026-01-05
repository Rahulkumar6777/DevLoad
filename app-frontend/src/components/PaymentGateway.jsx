// PaymentGateway.jsx (updated)
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BaseUrl } from '../api/ApiUrl';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { fetchSubscription } from "../store/slices/subscriptionSlice";
import { fetchBootstrapData } from "../store/slices/bootstrapSlice";
import { useSelector } from 'react-redux';

const PaymentGateway = ({ amount, description, months }) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { makeAuthenticatedRequest } = useAuth();

  const { profile, subscription, loading, error } = useSelector((state) => state.bootstrap);

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const email= subscription?.email || '';
  const name  = profile?.name || '';

  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error("❌ Failed to load Razorpay SDK");
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded || isProcessing) return;

    try {
      setIsProcessing(true);

      const { data: orderData } = await makeAuthenticatedRequest(`${BaseUrl}/payment`, {
        method: 'POST',
        data: {
          amount: amount,
          months: months
        }
      });

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: "INR",
        name: "DevLoad",
        description: description,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const { data: verifyResponse } = await makeAuthenticatedRequest(`${BaseUrl}/payment/verify`, {
              method: 'POST',
              data: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              }
            });

            if (verifyResponse.success) {
              dispatch(fetchSubscription(makeAuthenticatedRequest));
              dispatch(fetchBootstrapData(makeAuthenticatedRequest));
              
              alert("Payment Successful! Your subscription has been upgraded.");
              navigate('/subscription');
            } else {
              alert("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error("❌ Error verifying payment:");
            alert("❌ Error verifying payment.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: { 
          color: "#6366F1",
          hide_topbar: false
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("❌ Payment Error:");
      alert("Something went wrong while initiating payment.");
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={!razorpayLoaded || isProcessing}
      className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${
        !razorpayLoaded || isProcessing
          ? "opacity-70 cursor-not-allowed"
          : "hover:from-green-500 hover:to-emerald-500 hover:shadow-lg"
      }`}
    >
      {isProcessing 
        ? "Processing Payment..." 
        : `Pay ₹${amount / 100} Now`}
    </button>
  );
};

export default PaymentGateway;