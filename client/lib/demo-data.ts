import { ReferralData } from "@/components/ui/referral-tracker";

export const generateDemoReferrals = (): ReferralData[] => {
  const mockUsers = [
    {
      firstName: "Mark",
      lastName: "Anderson",
      email: "mark.anderson@email.com",
    },
    {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
    },
    {
      firstName: "Alex",
      lastName: "Thompson",
      email: "alex.thompson@email.com",
    },
    { firstName: "Emma", lastName: "Wilson", email: "emma.wilson@email.com" },
    { firstName: "David", lastName: "Brown", email: "david.brown@email.com" },
    { firstName: "Lisa", lastName: "Garcia", email: "lisa.garcia@email.com" },
    {
      firstName: "Michael",
      lastName: "Davis",
      email: "michael.davis@email.com",
    },
  ];

  return mockUsers.map((user, index) => {
    // First 5 users have active referrals (1-8 transfers)
    // Last 2 users have completed referrals (12 transfers)
    const transferCount = index >= 5 ? 12 : Math.floor(Math.random() * 8) + 1;
    const baseDate = new Date("2024-01-01");
    const createdAt = new Date(
      baseDate.getTime() + index * 7 * 24 * 60 * 60 * 1000,
    );

    const transfers = Array.from({ length: transferCount }, (_, i) => ({
      id: `transfer-${index}-${i}`,
      amount: Math.floor(Math.random() * 500) + 50,
      currency: "USD",
      completedAt: new Date(
        createdAt.getTime() + (i + 1) * 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      referralEarning: 3,
    }));

    return {
      id: `referral-${index + 1}`,
      referrerId: "550e8400-e29b-41d4-a716-446655440000",
      referralId: `user-${index + 1}`,
      referralUser: {
        id: `user-${index + 1}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        registrationDate: createdAt.toISOString(),
      },
      promoCode: `${user.firstName.toUpperCase()}${new Date().getFullYear()}`,
      transferCount,
      totalEarnings: transferCount * 3,
      status:
        transferCount >= 12 ? ("completed" as const) : ("active" as const),
      createdAt: createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
      transfers,
    };
  });
};
