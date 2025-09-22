import { UpdateEventForm } from "@/components/forms/UpdateEventForm";
import { useParams } from "react-router-dom";

export default function EditEvent() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Event
            </h1>
            <p className="text-gray-600">Update fields you want to change.</p>
          </div>
          {Number.isNaN(id) ? null : <UpdateEventForm eventId={id} />}
        </div>
      </div>
    </div>
  );
}
