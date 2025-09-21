import { CreateEventForm } from "@/components/forms/CreateEventForm";

export function EventManagement() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Event
            </h1>
            <p className="text-gray-600">
              Fill out the form below to create a new event.
            </p>
          </div>
          <CreateEventForm />
        </div>
      </div>
    </div>
  );
}
