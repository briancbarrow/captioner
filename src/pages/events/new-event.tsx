import { NextPage } from "next";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/types/supabase";
import { useEffect, useState } from "react";
import EventLayout from "@/components/layouts/EventLayout";

const NewEvent: NextPage = () => {
  const [userEmail, setUserEmail] = useState("");

  const supabase = useSupabaseClient<Database>();
  useEffect(() => {
    const getUserFromSession = async () => {
      const {
        data: { session: session },
      } = await supabase.auth.getSession();
      console.log("session", session);
      const userEmail = session?.user.email ? session?.user.email : "";
      setUserEmail(userEmail);
    };
    getUserFromSession();
  }, []);
  return (
    <EventLayout>
      <h1>New Event</h1>
      <form
        action="/api/create-event"
        method="post"
        className="flex flex-col max-w-xl m-auto"
      >
        <label htmlFor="title" className="my-1">
          Title of event
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="mt-1 mb-4 text-black"
        />
        {/* Start date */}
        <label htmlFor="start_date" className="my-1">
          Start date
        </label>
        <input
          type="date"
          id="start_date"
          name="start_date"
          className="mt-1 mb-4 text-black"
        />
        {/* total days */}
        <label htmlFor="total_days" className="my-1">
          Total days
        </label>
        <input
          type="number"
          id="total_days"
          name="total_days"
          className="mt-1 mb-4 text-black"
        />
        {/* contact email */}
        <label htmlFor="contact_email" className="my-1">
          Contact email
        </label>
        <input
          type="email"
          id="contact_email"
          name="contact_email"
          className="bg-black border-none mb-4 text-white pl-0 pt-0 italic"
          disabled
          value={userEmail}
        />
        <button type="submit" className="bg-green-500 text-white rounded py-4">
          Submit
        </button>
      </form>
    </EventLayout>
  );
};

export default NewEvent;
