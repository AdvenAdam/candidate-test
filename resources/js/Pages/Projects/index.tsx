import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const index = () => {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl leading-tight text-gray-800">Project</h2>}>
      index
    </AuthenticatedLayout>
  );
};
export default index;
