import React from 'react';
import { cn } from '@/lib/utils';

export interface ReferralState {
  name: string;
  amount: number;
  transferCount: number; // 0 = joined only, 1-12 = number of transfers completed
}

interface ReferralTrackerProps {
  referral: ReferralState;
  className?: string;
}

export const ReferralTracker: React.FC<ReferralTrackerProps> = ({ referral, className }) => {
  // Progress logic: 1st dot = joined, 2nd dot = 1st transfer, etc.
  // So active dots = transferCount + 1 (joined + completed transfers)
  const activeDots = referral.transferCount + 1;

  const getTransferLabel = () => {
    if (referral.transferCount === 12) {
      return '12th transfer';
    }
    const nextTransfer = referral.transferCount + 1;
    if (nextTransfer === 1) return '1st transfer';
    if (nextTransfer === 2) return '2nd transfer';
    if (nextTransfer === 3) return '3rd transfer';
    return `${nextTransfer}th transfer`;
  };

  // Generate 13 dots: 1st = joined, 2nd = 1st transfer, ..., 13th = 12th transfer
  const generateDots = () => {
    const dots = [];
    for (let i = 0; i <= 12; i++) {
      const cx = 4 + (i * (327 - 8) / 12); // Distribute 13 dots evenly across width
      const isActive = i < activeDots; // Active if within completed milestones

      dots.push(
        <circle
          key={i}
          cx={cx}
          cy="4"
          r="4"
          fill="#7633FF"
          fillOpacity={isActive ? "1" : "0.4"}
        />
      );
    }
    return dots;
  };

  // Generate progress fill rectangles
  const generateProgressFill = () => {
    if (referral.transferCount === 0) return null;

    const progressWidth = (referral.transferCount / 12) * (327 - 8) + 8; // Fill width based on completed transfers

    return (
      <rect
        width={progressWidth}
        height="8"
        rx="4"
        fill="#7633FF"
        fillOpacity="0.16"
      />
    );
  };

  return (
    <div className={cn("inline-flex flex-col items-start gap-5 w-full max-w-[327px]", className)}>
      {/* Header with name and amount */}
      <div className="w-full h-6 relative">
        <div className="w-full text-gray-dark font-gerbera text-[17px] font-normal leading-6 absolute left-0 top-0 h-6">
          {referral.name}
        </div>
        <div className="text-gray-dark text-right font-gerbera text-[17px] font-normal leading-6 uppercase absolute right-0 top-0 h-6">
          {referral.amount} usd
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 relative">
        <svg className="w-full h-2" viewBox="0 0 327 8" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          {/* Background track */}
          <rect width="327" height="8" rx="4" fill="#9F9DA3" fillOpacity="0.28"/>

          {/* Progress fill */}
          {generateProgressFill()}

          {/* 13 Milestone dots */}
          {generateDots()}
        </svg>
      </div>

      {/* Labels */}
      <div className="w-full h-5 relative">
        <div className={cn(
          "font-gerbera text-sm font-normal leading-5 absolute left-0 top-0 w-[43px] h-5",
          "text-gray-dark" // Joined is always active
        )}>
          Joined
        </div>
        <div className={cn(
          "text-right font-gerbera text-sm font-normal leading-5 absolute right-0 top-0 h-5 whitespace-nowrap",
          referral.transferCount > 0 ? "text-gray-dark" : "text-gray-medium"
        )}>
          {getTransferLabel()}
        </div>
      </div>
    </div>
  );
};
