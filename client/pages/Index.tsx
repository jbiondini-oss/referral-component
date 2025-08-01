import React from "react";
import {
  ReferralTracker,
  ReferralState,
} from "@/components/ui/referral-tracker";

// Generate all 13 states (joined + 12 transfers)
const referralStates: ReferralState[] = Array.from({ length: 13 }, (_, i) => ({
  userId: "user_mark_001", // Database ID for linking
  name: "Mark A.", // Removed "referral", just name + initial
  amount: i * 3, // Each transfer = 3 USD
  transferCount: i, // 0 = joined, 1-12 = completed transfers
}));

export default function Index() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
            Referral Tracking System
          </h1>
          <p className="text-lg text-gray-medium">
            Track your referrals' progress through different milestones
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            {referralStates.map((referral, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-dark mb-2">
                    State {index + 1}:{" "}
                    {getStateDescription(referral.transferCount)}
                  </h3>
                </div>
                <ReferralTracker referral={referral} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-dark mb-4">
              How It Works
            </h2>
            <div className="grid gap-6 md:grid-cols-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-primary rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-gray-dark mb-1">Joined</h4>
                <p className="text-gray-medium">Referral signs up</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-primary rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-gray-dark mb-1">
                  1st Transfer
                </h4>
                <p className="text-gray-medium">
                  First money transfer completed
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-primary rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-gray-dark mb-1">
                  2nd Transfer
                </h4>
                <p className="text-gray-medium">
                  Second transfer milestone reached
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-primary rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-gray-dark mb-1">
                  Multiple Transfers
                </h4>
                <p className="text-gray-medium">
                  3rd+ transfers continue earning
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStateDescription(transferCount: number): string {
  if (transferCount === 0) {
    return "Referral has joined";
  } else if (transferCount === 1) {
    return "Referral has sent their 1st money transfer";
  } else if (transferCount === 2) {
    return "Referral has sent their 2nd money transfer";
  } else if (transferCount === 3) {
    return "Referral has sent their 3rd money transfer";
  } else {
    return `Referral has sent their ${transferCount}th money transfer`;
  }
}
