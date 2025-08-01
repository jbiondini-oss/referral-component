import React from 'react';
import { cn } from '@/lib/utils';

export interface ReferralState {
  name: string;
  amount: number;
  stage: 'joined' | 'first_transfer' | 'second_transfer' | 'multiple_transfers';
  transferCount?: number;
}

interface ReferralTrackerProps {
  referral: ReferralState;
  className?: string;
}

export const ReferralTracker: React.FC<ReferralTrackerProps> = ({ referral, className }) => {
  const getProgress = () => {
    switch (referral.stage) {
      case 'joined':
        return 0;
      case 'first_transfer':
        return 1;
      case 'second_transfer':
        return 2;
      case 'multiple_transfers':
        return 2;
      default:
        return 0;
    }
  };

  const progress = getProgress();
  const isStageActive = (stage: number) => progress >= stage;
  const isStageCompleted = (stage: number) => progress > stage;

  const getThirdStageLabel = () => {
    if (referral.stage === 'multiple_transfers' && referral.transferCount) {
      return `${referral.transferCount}th transfer`;
    }
    return '2nd transfer';
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
        <svg className="w-full h-2" viewBox="0 0 327 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background track */}
          <rect width="327" height="8" rx="4" fill="#9F9DA3" fillOpacity="0.28"/>
          
          {/* Progress fills */}
          {progress >= 1 && (
            <rect width="168" height="8" rx="4" fill="#7633FF" fillOpacity="0.16"/>
          )}
          {progress >= 2 && (
            <rect width="327" height="8" rx="4" fill="#7633FF" fillOpacity="0.16"/>
          )}
          
          {/* Milestone circles */}
          <circle 
            cx="4" 
            cy="4" 
            r="4" 
            fill={isStageActive(0) ? "#7633FF" : "#7633FF"} 
            fillOpacity={isStageActive(0) ? "1" : "0.4"}
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
