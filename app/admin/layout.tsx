type AdminRootLayoutProps = {
  children: React.ReactNode;
};

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return <div className="min-h-screen bg-slate-100 text-slate-900">{children}</div>;
}
