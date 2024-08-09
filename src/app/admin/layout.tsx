import { Metadata } from "next";
import AdminClientLayout from "./components/AdminLayout";
import AdminProtected from "@/_hooks/useAdminProtected";

export const metadata: Metadata = {
  title: "Admin - Morsache Clothing",
  description: "Search through the morsache store",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    // <AdminProtected>
      <AdminClientLayout>
      {children} 
      </AdminClientLayout>
    // </AdminProtected>
  );
}
