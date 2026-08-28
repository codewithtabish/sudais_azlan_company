// src/app/dashboard/layout.tsx
import { Container } from "@/components/general/layouts/conatiner";
import DashboardSidebar from "@/components/pages/dashboard/dashboard-sidebar";
import type { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-red-900">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        <Container>{children}</Container>
      </main>
    </div>
  );
};

export default DashboardLayout;
