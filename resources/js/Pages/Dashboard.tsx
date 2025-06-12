import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl leading-tight text-gray-800">Dashboard</h2>}>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">You're logged in!</div>
    </AuthenticatedLayout>
  );
}
