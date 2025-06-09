import { CreateUserForm } from "@/components/forms/CreateUserForm";

export default function SuperAdminUserManagement() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New User</h1>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
}
