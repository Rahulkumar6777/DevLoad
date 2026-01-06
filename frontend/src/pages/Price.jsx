import React from "react";
import {
  Check,
  Zap,
  Star,
  Database,
  Key,
  Package,
  Wifi,
  Users,
} from "lucide-react";
import { privateAppDomain } from "../components/PrivateAppDomain";

const plans = [
  {
    name: "Free Plan",
    price: "₹0",
    period: "forever",
    description: "Perfect for trying out DevLoad",
    features: [
      {
        icon: <Package className="w-5 h-5" />,
        text: "1 Project",
        available: true,
      },
      {
        icon: <Database className="w-5 h-5" />,
        text: "1024MB Storage",
        available: true,
      },
      {
        icon: <Key className="w-5 h-5" />,
        text: "1 API Key per Project",
        available: true,
      },
      {
        icon: <Wifi className="w-5 h-5" />,
        text: "10GB Bandwidth",
        available: true,
      },
      {
        icon: <Zap className="w-5 h-5" />,
        text: "1,500 Requests/month",
        available: true,
        highlight: true,
      },
    ],
    buttonText: "Get Started",
    buttonStyle: "bg-white/10 hover:bg-white/20 border-white/20",
    cardStyle: "bg-slate-800/30 border-white/10",
    popular: false,
  },
  {
    name: "Pro Plan",
    price: "₹299",
    period: "per month",
    description: "For serious developers and small teams",
    features: [
      {
        icon: <Package className="w-5 h-5" />,
        text: "5 Projects",
        available: true,
      },
      {
        icon: <Database className="w-5 h-5" />,
        text: "5120MB Storage (5GB)",
        available: true,
      },
      {
        icon: <Key className="w-5 h-5" />,
        text: "5 API Keys per Project",
        available: true,
      },
      {
        icon: <Wifi className="w-5 h-5" />,
        text: "100GB Bandwidth",
        available: true,
        highlight: true,
      },
      {
        icon: <Zap className="w-5 h-5" />,
        text: "15,000 Requests/month",
        available: true,
        highlight: true,
      },
      {
        icon: <Users className="w-5 h-5" />,
        text: "Priority Support",
        available: true,
        highlight: true,
      },
    ],
    buttonText: "Upgrade Now",
    buttonStyle:
      "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500",
    cardStyle:
      "bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-cyan-500/50",
    popular: true,
  },
];

export default function Price() {
  const handleButtonClick = (planName) => {
    if (planName === "Pro Plan") {
      window.location.href = `${privateAppDomain}/subscription`;
    } else {
      window.location.href = `${privateAppDomain}/signup`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-blue-300">
              Simple Pricing
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border backdrop-blur-sm ${
                plan.cardStyle
              } overflow-hidden hover:-translate-y-2 transition-all duration-300 ${
                plan.popular ? "shadow-2xl shadow-cyan-500/20" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-6 py-2 rounded-bl-xl">
                  <Star className="w-3 h-3 inline mr-1" />
                  MOST POPULAR
                </div>
              )}

              {/* Glow Effect for Pro */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
              )}

              <div className="relative p-8">
                {/* Plan Header */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-white">
                      {plan.name}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl sm:text-5xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-gray-400">/ {plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                        feature.highlight
                          ? "bg-cyan-500/10 border border-cyan-500/30"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`mt-0.5 shrink-0 ${
                          feature.highlight ? "text-cyan-400" : "text-blue-400"
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <span
                        className={`${
                          feature.available ? "text-gray-200" : "text-gray-500"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleButtonClick(plan.name)}
                  className={`w-full py-4 rounded-lg font-semibold border transition-all hover:scale-105 hover:shadow-xl ${
                    plan.buttonStyle
                  } ${plan.popular ? "hover:shadow-cyan-500/25" : ""}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Info */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              What's Included
            </h3>
            <p className="text-gray-400">All plans include these features</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Simple REST API",
              "Project-based organization",
              "Secure file storage",
              "Fast upload/download",
              "Public URL support",
              "Developer-friendly docs",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
              >
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ/Notes */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              Important Notes
            </span>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-left">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Request limits</strong> apply
                  only to upload and delete operations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Public URL access</strong> is
                  unlimited and cached automatically
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">
                    No credit card required
                  </strong>{" "}
                  for the free plan
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">
                    1-day money-back guarantee
                  </strong>{" "}
                  on Pro plan
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
