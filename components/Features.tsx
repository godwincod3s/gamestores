"use client";
import { GlowingEffect } from "./ui/glowing-effect";
import {
  IconRocket,
  IconShield,
  IconBolt,
  IconPackage,
  IconTrendingUp,
  IconHeadphones,
} from "@tabler/icons-react";
import vars from "@/globalvars";

const {name} = vars;

const features = [
  {
    icon: IconRocket,
    title: "Fast Shipping",
    description: "Get your games and gear delivered quickly to your doorstep.",
  },
  {
    icon: IconShield,
    title: "Secure Checkout",
    description: "Shop with confidence with our secure payment processing.",
  },
  {
    icon: IconBolt,
    title: "Instant Activation",
    description: "Digital products activated instantly after purchase.",
  },
  {
    icon: IconPackage,
    title: "Quality Guaranteed",
    description: "All products are genuine and come with manufacturer warranty.",
  },
  {
    icon: IconTrendingUp,
    title: "Best Prices",
    description: "Competitive pricing and regular deals on your favorite titles.",
  },
  {
    icon: IconHeadphones,
    title: "24/7 Support",
    description: "Our dedicated support team is always here to help.",
  },
];

export default function Features() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black dark:bg-gray-950 overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose <span className="capitalize">{name}</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Experience the ultimate gaming shopping destination with features
            designed for gamers, by gamers.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="relative group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 overflow-hidden"
            >
              {/* Glowing Effect */}
              <GlowingEffect
                blur={15}
                spread={60}
                glow={false}
                borderWidth={2}
                inactiveZone={0.5}
                variant="default"
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 rounded-xl" />
            </div>
          );
        })}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </section>
  );
}