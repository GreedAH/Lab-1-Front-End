import { CreateAdminForm } from "@/components/forms/CreateAdminForm";

export default function AdminUserManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Create a new Admin
          </h1>
          <p className="mt-2 text-gray-600">
            Set up credentials and details for the new administrator
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <CreateAdminForm />
        </div>
      </div>
    </div>
  );
}
