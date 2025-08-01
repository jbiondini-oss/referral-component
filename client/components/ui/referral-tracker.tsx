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
  // Progress is based on transferCount: 0 = joined only, 1-12 = completed transfers
  const progress = referral.transferCount;
  const isStageActive = (stage: number) => progress >= stage;

  const getTransferLabel = () => {
    if (referral.transferCount === 0) {
      return '1st transfer';
    }
    const nextTransfer = Math.min(referral.transferCount + 1, 12);
    if (nextTransfer === 1) return '1st transfer';
    if (nextTransfer === 2) return '2nd transfer';
    if (nextTransfer === 3) return '3rd transfer';
    return `${nextTransfer}th transfer`;
  };

  // Generate 13 dots: first is "joined", remaining 12 are for transfers
  const generateDots = () => {
    const dots = [];
    for (let i = 0; i <= 12; i++) {
      const cx = 4 + (i * (327 - 8) / 12); // Distribute 13 dots evenly across width
      const isActive = i === 0 || i <= progress; // First dot (joined) always active, others based on transfers

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
    if (progress === 0) return null;

    const progressWidth = (progress / 12) * (327 - 8) + 8; // Fill width based on completed transfers

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

          {/* Progress fills */}
          {progress >= 1 && (
            <rect width="168" height="8" rx="4" fill="#7633FF" fillOpacity="0.16"/>
          )}
          {progress >= 2 && (
            <rect x="160" width="167" height="8" rx="4" fill="#7633FF" fillOpacity="0.16"/>
          )}

          {/* Milestone circles */}
          <circle
            cx="4"
            cy="4"
            r="4"
            fill="#7633FF"
            fillOpacity="1"
          />
          <circle
            cx="164"
            cy="4"
            r="4"
            fill="#7633FF"
            fillOpacity={isStageActive(1) ? "1" : "0.4"}
          />
          <circle
            cx="323"
            cy="4"
            r="4"
            fill="#7633FF"
            fillOpacity={isStageActive(2) ? "1" : "0.4"}
          />
        </svg>
      </div>

      {/* Labels */}
      <div className="w-full h-10 relative">
        <div className={cn(
          "font-gerbera text-sm font-normal leading-5 absolute left-0 top-0 w-[43px] h-5",
          isStageActive(0) ? "text-gray-dark" : "text-gray-medium"
        )}>
          Joined
        </div>
        <div className={cn(
          "text-center font-gerbera text-sm font-normal leading-5 absolute left-[127px] top-0 w-[75px] h-5",
          isStageActive(1) ? "text-gray-dark" : "text-gray-medium"
        )}>
          1st transfer
        </div>
        <div className={cn(
          "w-[76px] text-right font-gerbera text-sm font-normal leading-5 absolute right-0 top-0 h-10",
          isStageActive(2) ? "text-gray-dark" : "text-gray-medium"
        )}>
          {getThirdStageLabel()}
        </div>
      </div>
    </div>
  );
};
