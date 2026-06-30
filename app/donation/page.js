import React from "react";
import DonationPage from "../../components/DonationPage";
import { getCampaigns } from "../../lib/db";

export const revalidate = 0;

// SEO Friendly Metadata for Donation Page
export const metadata = {
  title: "Donation Seva & Contributions | Neelmani Kripalu Satsang",
  description: "Offer offline donations and seva contributions to support our spiritual mission, daily Annadan food distribution in Vrindavan, child education (Gyan-Daan), and temple services. Read bank transfer details and UPI instructions here.",
  keywords: "Donation, Seva, Annadan, Food Distribution, Child Education, Temple Seva, Offline Bank Transfer, UPI, Vrindavan, Delhi Satsang"
};

export default async function Page() {
  // Fetch campaigns from Firebase (or fallback mock data)
  const campaigns = await getCampaigns();

  return <DonationPage campaigns={campaigns} />;
}
