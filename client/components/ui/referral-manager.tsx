import React, { useState, useEffect, useCallback } from "react";
import { ReferralTracker, ReferralData } from "./referral-tracker";
import { cn } from "@/lib/utils";
import { generateDemoReferrals } from "@/lib/demo-data";

interface ReferralManagerProps {
  referrerId: string;
  className?: string;
}

// API service functions (would be in separate service file in production)
class ReferralService {
  private static readonly BASE_URL = '/api/referrals';

  static async getActiveReferrals(referrerId: string): Promise<ReferralData[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/active/${referrerId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch active referrals');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching active referrals:', error);
      return [];
    }
  }

  static async getCompletedReferrals(referrerId: string): Promise<ReferralData[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/completed/${referrerId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch completed referrals');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching completed referrals:', error);
      return [];
    }
  }

  static async moveToCompleted(referralId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/${referralId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error moving referral to completed:', error);
      return false;
    }
  }

  private static getAuthToken(): string {
    // In production, this would get token from secure storage
    return localStorage.getItem('authToken') || '';
  }
}

export const ReferralManager: React.FC<ReferralManagerProps> = ({
  referrerId,
  className,
}) => {
  const [activeReferrals, setActiveReferrals] = useState<ReferralData[]>([]);
  const [completedReferrals, setCompletedReferrals] = useState<ReferralData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load referrals data
  const loadReferrals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For demo purposes, use generated data
      // In production, this would call the actual API
      const demoData = generateDemoReferrals();
      const active = demoData.filter(r => r.transferCount < 12);
      const completed = demoData.filter(r => r.transferCount >= 12);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setActiveReferrals(active);
      setCompletedReferrals(completed);
    } catch (err) {
      setError('Failed to load referrals. Please try again.');
      console.error('Error loading referrals:', err);
    } finally {
      setIsLoading(false);
    }
  }, [referrerId]);

  // Handle referral completion (12 transfers reached)
  const handleReferralComplete = useCallback(async (referralData: ReferralData) => {
    const success = await ReferralService.moveToCompleted(referralData.id);
    
    if (success) {
      // Move from active to completed
      setActiveReferrals(prev => prev.filter(r => r.id !== referralData.id));
      setCompletedReferrals(prev => [...prev, { ...referralData, status: 'completed' }]);
      
      // Show success notification (in production, use toast/notification system)
      console.log(`Referral ${referralData.referralUser.firstName} completed all transfers!`);
    }
  }, []);

  // Load data on mount and set up polling for real-time updates
  useEffect(() => {
    loadReferrals();
    
    // Poll for updates every 30 seconds (in production, use WebSocket or Server-Sent Events)
    const pollInterval = setInterval(loadReferrals, 30000);
    
    return () => clearInterval(pollInterval);
  }, [loadReferrals]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-primary"></div>
        <span className="ml-2 text-gray-medium">Loading referrals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center p-8", className)}>
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadReferrals}
          className="px-4 py-2 bg-purple-primary text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Active Referrals Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-dark">
            Active Referrals
          </h2>
          <button
            onClick={loadReferrals}
            className="text-sm text-purple-primary hover:text-purple-600 transition-colors"
            title="Refresh data"
          >
            ↻ Refresh
          </button>
        </div>

        {activeReferrals.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <div className="text-gray-medium mb-2">No active referrals yet</div>
            <div className="text-sm text-gray-400">
              Share your promo code to start earning from referrals!
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeReferrals.map((referral) => (
              <div
                key={referral.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow h-fit"
              >
                <div className="mb-4">
                  {/* Simplified card header - removed ID, date, and promo code */}
                </div>
                <ReferralTracker
                  referralData={referral}
                  onComplete={handleReferralComplete}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Referrals Section */}
      <div>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-dark">
            All Referrals
          </h3>
          <span className={cn(
            "transition-transform duration-200",
            showCompleted ? "rotate-180" : ""
          )}>
            ▼
          </span>
        </button>

        {showCompleted && (
          <div className="mt-4 space-y-4">
            {completedReferrals.length === 0 ? (
              <div className="text-center p-6 text-gray-medium">
                No completed referrals yet
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow h-fit"
                  >
                    <div className="mb-4">
                      {/* Simplified completed referral header */}
                    </div>
                    <ReferralTracker referralData={referral} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
