import { RequestHandler } from "express";
import { z } from "zod";

// Validation schemas for Paysend API compliance
const ReferralUserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  registrationDate: z.string().datetime(),
});

const TransferRecordSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  completedAt: z.string().datetime(),
  referralEarning: z.number().min(0),
});

const ReferralDataSchema = z.object({
  id: z.string().uuid(),
  referrerId: z.string().uuid(),
  referralId: z.string().uuid(),
  referralUser: ReferralUserSchema,
  promoCode: z.string().min(6).max(20),
  transferCount: z.number().int().min(0).max(12),
  totalEarnings: z.number().min(0),
  status: z.enum(['active', 'completed', 'archived']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  transfers: z.array(TransferRecordSchema),
});

// Types for TypeScript
export type ReferralUser = z.infer<typeof ReferralUserSchema>;
export type TransferRecord = z.infer<typeof TransferRecordSchema>;
export type ReferralData = z.infer<typeof ReferralDataSchema>;

// Mock database service (in production, this would use PostgreSQL with proper ORM)
class ReferralDatabaseService {
  private static mockData: ReferralData[] = [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      referrerId: "550e8400-e29b-41d4-a716-446655440000",
      referralId: "550e8400-e29b-41d4-a716-446655440002",
      referralUser: {
        id: "550e8400-e29b-41d4-a716-446655440002",
        firstName: "Mark",
        lastName: "Anderson",
        email: "mark.anderson@email.com",
        registrationDate: "2024-01-15T10:30:00Z",
      },
      promoCode: "MARK2024",
      transferCount: 3,
      totalEarnings: 9,
      status: 'active' as const,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:22:00Z",
      transfers: [
        {
          id: "transfer-001",
          amount: 150.00,
          currency: "USD",
          completedAt: "2024-01-16T09:15:00Z",
          referralEarning: 3,
        },
        {
          id: "transfer-002",
          amount: 200.00,
          currency: "USD", 
          completedAt: "2024-01-18T11:30:00Z",
          referralEarning: 3,
        },
        {
          id: "transfer-003",
          amount: 75.00,
          currency: "USD",
          completedAt: "2024-01-20T14:22:00Z",
          referralEarning: 3,
        },
      ],
    },
    // Add more mock data as needed
  ];

  static async getActiveReferrals(referrerId: string): Promise<ReferralData[]> {
    // Simulate async database call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return this.mockData.filter(
      referral => referral.referrerId === referrerId && 
      referral.status === 'active' &&
      referral.transferCount < 12
    );
  }

  static async getCompletedReferrals(referrerId: string): Promise<ReferralData[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return this.mockData.filter(
      referral => referral.referrerId === referrerId && 
      (referral.status === 'completed' || referral.transferCount >= 12)
    );
  }

  static async updateReferralStatus(referralId: string, status: 'active' | 'completed' | 'archived'): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const referral = this.mockData.find(r => r.id === referralId);
    if (referral) {
      referral.status = status;
      referral.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  static async createReferral(referralData: Omit<ReferralData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReferralData> {
    const newReferral: ReferralData = {
      ...referralData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.mockData.push(newReferral);
    return newReferral;
  }
}

// API route handlers compatible with Paysend's Express.js backend
export const getActiveReferrals: RequestHandler = async (req, res) => {
  try {
    const { referrerId } = req.params;

    if (!referrerId) {
      return res.status(400).json({
        error: 'Referrer ID is required',
        code: 'MISSING_REFERRER_ID'
      });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(referrerId)) {
      return res.status(400).json({
        error: 'Invalid referrer ID format',
        code: 'INVALID_REFERRER_ID'
      });
    }

    const activeReferrals = await ReferralDatabaseService.getActiveReferrals(referrerId);
    
    res.json({
      success: true,
      data: activeReferrals,
      count: activeReferrals.length
    });

  } catch (error) {
    console.error('Error fetching active referrals:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const getCompletedReferrals: RequestHandler = async (req, res) => {
  try {
    const { referrerId } = req.params;

    if (!referrerId) {
      return res.status(400).json({
        error: 'Referrer ID is required',
        code: 'MISSING_REFERRER_ID'
      });
    }

    const completedReferrals = await ReferralDatabaseService.getCompletedReferrals(referrerId);
    
    res.json({
      success: true,
      data: completedReferrals,
      count: completedReferrals.length
    });

  } catch (error) {
    console.error('Error fetching completed referrals:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const completeReferral: RequestHandler = async (req, res) => {
  try {
    const { referralId } = req.params;

    if (!referralId) {
      return res.status(400).json({
        error: 'Referral ID is required',
        code: 'MISSING_REFERRAL_ID'
      });
    }

    const success = await ReferralDatabaseService.updateReferralStatus(referralId, 'completed');
    
    if (!success) {
      return res.status(404).json({
        error: 'Referral not found',
        code: 'REFERRAL_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Referral marked as completed'
    });

  } catch (error) {
    console.error('Error completing referral:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Webhook handler for transfer completion events
export const handleTransferWebhook: RequestHandler = async (req, res) => {
  try {
    // Validate webhook signature (implement based on Paysend's webhook security)
    const signature = req.headers['x-paysend-signature'] as string;
    if (!signature) {
      return res.status(401).json({
        error: 'Missing webhook signature',
        code: 'MISSING_SIGNATURE'
      });
    }

    // Parse transfer completion data
    const { userId, transferId, amount, currency } = req.body;

    // Find referral by user ID and update transfer count
    // This would integrate with Paysend's user and transfer systems
    
    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Error processing transfer webhook:', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      code: 'WEBHOOK_ERROR'
    });
  }
};
