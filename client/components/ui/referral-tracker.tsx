import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Production-ready interfaces for Paysend API
export interface ReferralUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationDate: string;
}

export interface ReferralData {
  id: string;
  referrerId: string;
  referralId: string;
  referralUser: ReferralUser;
  promoCode: string;
  transferCount: number; // 0-12
  totalEarnings: number;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  transfers: TransferRecord[];
}

export interface TransferRecord {
  id: string;
  amount: number;
  currency: string;
  completedAt: string;
  referralEarning: number; // 3 USD per transfer
}

interface ReferralTrackerProps {
  referralData: ReferralData;
  onComplete?: (referralData: ReferralData) => void;
  className?: string;
}

export const ReferralTracker: React.FC<ReferralTrackerProps> = ({
  referralData,
  onComplete,
  className,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate display values
  const activeDots = referralData.transferCount + 1; // +1 for joined
  const displayName = `${referralData.referralUser.firstName} ${referralData.referralUser.lastName.charAt(0)}.`;
  const earnings = referralData.transferCount * 3; // 3 USD per transfer

  // Handle completion (12 transfers)
  useEffect(() => {
    if (referralData.transferCount >= 12 && onComplete) {
      onComplete(referralData);
    }
  }, [referralData.transferCount, onComplete, referralData]);

  const getTransferLabel = () => {
    if (referralData.transferCount === 12) {
      return "12th transfer";
    }
    const nextTransfer = referralData.transferCount + 1;
    if (nextTransfer === 1) return "1st transfer";
    if (nextTransfer === 2) return "2nd transfer";
    if (nextTransfer === 3) return "3rd transfer";
    return `${nextTransfer}th transfer`;
  };

  // Generate 13 dots: 1st = joined, 2nd = 1st transfer, ..., 13th = 12th transfer
  const generateDots = () => {
    const dots = [];
    for (let i = 0; i <= 12; i++) {
      const cx = 4 + (i * (327 - 8)) / 12;
      const isActive = i < activeDots;

      dots.push(
        <circle
          key={i}
          cx={cx}
          cy="4"
          r="4"
          fill="#7633FF"
          fillOpacity={isActive ? "1" : "0.4"}
          className={cn(
            "transition-all duration-300 ease-in-out",
            isUpdating && "animate-pulse"
          )}
        />,
      );
    }
    return dots;
  };

  // Generate progress fill
  const generateProgressFill = () => {
    if (referralData.transferCount === 0) return null;

    const progressWidth = (referralData.transferCount / 12) * (327 - 8) + 8;

    return (
      <rect
        width={progressWidth}
        height="8"
        rx="4"
        fill="#7633FF"
        fillOpacity="0.16"
        className={cn(
          "transition-all duration-500 ease-in-out",
          isUpdating && "animate-pulse"
        )}
      />
    );
  };

  return (
    <div
      className={cn(
        "inline-flex flex-col items-start gap-5 w-full max-w-[327px]",
        "transition-all duration-300",
        referralData.status === 'completed' && "opacity-75",
        className,
      )}
      data-referral-id={referralData.id}
      data-testid="referral-tracker"
    >
      {/* Header with name and earnings */}
      <div className="w-full h-6 relative">
        <div 
          className="w-full text-gray-dark font-gerbera text-[17px] font-normal leading-6 absolute left-0 top-0 h-6 cursor-pointer hover:text-purple-primary transition-colors"
          title={`${referralData.referralUser.firstName} ${referralData.referralUser.lastName} - ID: ${referralData.referralUser.id}`}
          onClick={() => {
            // Could trigger user profile modal or navigation
            console.log(`Navigate to user profile: ${referralData.referralUser.id}`);
          }}
        >
          {displayName}
        </div>
        <div className="text-gray-dark text-right font-gerbera text-[17px] font-normal leading-6 uppercase absolute right-0 top-0 h-6">
          {earnings} USD
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 relative">
        <svg
          className="w-full h-2"
          viewBox="0 0 327 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          role="progressbar"
          aria-valuenow={referralData.transferCount}
          aria-valuemin={0}
          aria-valuemax={12}
          aria-label={`${referralData.transferCount} of 12 transfers completed`}
        >
          {/* Background track */}
          <rect
            width="327"
            height="8"
            rx="4"
            fill="#9F9DA3"
            fillOpacity="0.28"
          />

          {/* Progress fill */}
          {generateProgressFill()}

          {/* 13 Milestone dots */}
          {generateDots()}
        </svg>
      </div>

      {/* Labels */}
      <div className="w-full h-5 relative">
        <div
          className={cn(
            "font-gerbera text-sm font-normal leading-5 absolute left-0 top-0 w-[43px] h-5",
            "text-gray-dark", // Joined is always active
          )}
        >
          Joined
        </div>
        <div
          className={cn(
            "text-right font-gerbera text-sm font-normal leading-5 absolute right-0 top-0 h-5 whitespace-nowrap",
            referralData.transferCount > 0 ? "text-gray-dark" : "text-gray-medium",
          )}
        >
          {getTransferLabel()}
        </div>
      </div>

      {/* Completion indicator */}
      {referralData.transferCount >= 12 && (
        <div className="w-full text-center">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            ✓ Completed
          </span>
        </div>
      )}
    </div>
  );
};
