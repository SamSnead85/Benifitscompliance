import DashboardLayout from '../dashboard/layout';

export default function DashboardGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
