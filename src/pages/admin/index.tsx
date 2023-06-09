import AdminLayout from "@/components/layouts/AdminLayout";
import type { NextPage } from "next";
import EventCardAdmin from "@/components/EventCardAdmin";
import EventUpdateModal from "@/components/EventUpdateModal";
import { useEffect, useState } from "react";
import {
  createClientComponentClient,
  type User,
} from "@supabase/auth-helpers-nextjs";
import { DGEvent } from "@/types/event";

// Create a single supabase client for interacting with your database

const supabase = createClientComponentClient();
const AdminHome: NextPage = () => {
  const [events, setEvents] = useState([] as DGEvent[]);
  const getEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select(
        "id, title, slug, publisher_key, approval_status, start_date, total_days, user_id, contact_email"
      );
    if (error) {
      throw error;
    }
    if (data) {
      setEvents(data);
    }
  };
  useEffect(() => {
    getEvents().catch((err) => console.log(err));
  }, []);
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Admin Home</h1>
      <div className="mt-8 flex">
        {events.map((event) => (
          <EventCardAdmin
            key={event.id}
            event={event}
            refreshEvents={getEvents}
          />
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
