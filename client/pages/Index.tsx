import React from "react";
import { ReferralManager } from "@/components/ui/referral-manager";

export default function Index() {
  // In production, this would come from authenticated user context
  const currentReferrerId = "550e8400-e29b-41d4-a716-446655440000";

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
            Paysend Referral Dashboard
          </h1>
          <p className="text-lg text-gray-medium">
            Manage your referrals and track earnings in real-time
          </p>
        </div>

        {/* Production-ready referral management */}
        <ReferralManager referrerId={currentReferrerId} />

        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-dark mb-4">
              How Paysend Referrals Work
            </h2>
            <div className="grid gap-6 md:grid-cols-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-primary rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h4 className="font-semibold text-gray-dark mb-1">
                  Share Code
                </h4>
                <p className="text-gray-medium">
                  Share your unique promo code with friends
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-primary rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h4 className="font-semibold text-gray-dark mb-1">
                  Friend Joins
                </h4>
                <p className="text-gray-medium">
                  They register using your code
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-primary rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h4 className="font-semibold text-gray-dark mb-1">
                  Transfers Made
                </h4>
                <p className="text-gray-medium">
                  Earn $3 USD for each transfer (up to 12)
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-green-600 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <h4 className="font-semibold text-gray-dark mb-1">
                  Maximum Earned
                </h4>
                <p className="text-gray-medium">
                  $36 USD total per completed referral
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
