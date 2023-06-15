import AdminLayout from "@/components/layouts/AdminLayout";
import type { NextPage } from "next";
import EventCard from "@/components/EventCard";
import EventFormModal from "@/components/EventFormModal";
import { useEffect, useState } from "react";
import {
  createClientComponentClient,
  type User,
} from "@supabase/auth-helpers-nextjs";
import { DGEvent } from "@/types/event";

// Create a single supabase client for interacting with your database

const supabase = createClientComponentClient();
const EventHome: NextPage = () => {
  const [events, setEvents] = useState([] as DGEvent[]);
  const [showModal, setShowModal] = useState(false);
  const [eventToUpdate, setEventToUpdate] = useState({} as DGEvent);
  const closeModal = () => {
    setShowModal(false);
  };
  const getEvents = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    const { data, error } = await supabase
      .from("events")
      .select(
        "id, title, slug, publisher_key, dg_project, dg_key, approval_status, start_date, total_days, user_id, contact_email"
      )
      .eq("user_id", user?.id);
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
  const openModal = () => {
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <button onClick={openModal} className="bg-green-500 px-4 rounded-sm">
        Create new event
      </button>
      <div className="mt-8 flex">
        {events.map((event) => (
          <EventCard key={event.id} event={event} refreshEvents={getEvents} />
        ))}
      </div>
      {showModal && (
        <EventFormModal
          open={showModal}
          closeFunc={closeModal}
          refreshEvents={getEvents}
        />
      )}
    </AdminLayout>
  );
};

export default EventHome;
