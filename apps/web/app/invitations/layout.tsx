export default function InvitationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      {children}
    </div>
  );
}
