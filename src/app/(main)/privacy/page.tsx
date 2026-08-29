import { SecondContainer } from "@/components/general/layouts/second-container";
import PrivacyPolicyContent from "@/components/pages/privacy/privacy-policy-content";
import type { Metadata } from "next";

// ─────────────────────────────────────────────────────────────────────────
// REPLACE THESE WITH YOUR ACTUAL SHARED COMPONENTS
// I don't have access to your repository, so these paths are placeholders
// that follow common Next.js/shadcn conventions. Swap in the real ones —
// do not ship this file with unverified import paths.
// ─────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Privacy Policy — S.AZLAN",
  description:
    "How S.AZLAN handles account information, authentication, data storage, and your rights to access or delete your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* <Header /> */}
      <SecondContainer>
        <PrivacyPolicyContent />
      </SecondContainer>
    </>
  );
}
