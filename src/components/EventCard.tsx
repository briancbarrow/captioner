import Link from "next/link";
import { useEffect, useState } from "react";
import type { DGEvent } from "@/types/event";
// import { createClient } from "@supabase/supabase-js";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DatePicker from "react-datepicker";
import debounce from "lodash.debounce";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/types/supabase";
// const supabase = createClient(
//   "https://bztzviwntkfsgbkmbevu.supabase.co",
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
// );
type EventCardProps = {
  event: DGEvent;
  refreshEvents: () => void;
};

export const approval_status = {
  approved: "green-500",
  pending: "yellow-500",
  rejected: "red-400",
};

const EventCard = ({ event, refreshEvents }: EventCardProps) => {
  console.log("event", event);
  // const supabase = createClientComponentClient();
  const supabase = useSupabaseClient<Database>();

  const [editMode, setEditMode] = useState(false);
  const [revealKey, setRevealKey] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [slug, setSlug] = useState(event.slug);
  const [start_date, setStartDate] = useState(event.start_date);
  const [total_days, setTotalDays] = useState(`${event.total_days}`);
  const [event_prospectus, setEventProspectus] = useState({} as File);
  const [prospectusExists, setProspectusExists] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [dateError, setDateError] = useState(false);
  const toggleRevealKey = () => {
    setRevealKey(!revealKey);
  };

  useEffect(() => {
    const listAllFiles = async () => {
      const { data } = await supabase.storage
        .from("event-prospectus")
        .list(event.id);
      console.log("list data", data);
      if (data && data.length > 0) {
        data.filter((file) => {
          if (file.name === "Prospectus") {
            setProspectusExists(true);
          }
        });
      }
    };
    listAllFiles();
  }, [event.id]);
  function validateDateFormat(date: string) {
    // Regular expression for mm/dd/yyyy format
    const dateFormat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])$/;

    if (date.match(dateFormat)) {
      return true;
    } else {
      return false;
    }
  }

  const deleteProspectus = async () => {
    const { data, error } = await supabase.storage
      .from("event-prospectus")
      .remove([`${event.id}/Prospectus`]);
    if (error) {
      console.log("error", error);
    }
    if (data) {
      console.log("data", data);
      setProspectusExists(false);
    }
  };

  const updateSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const submitUpdatedEvent = async (updateEvent: any) => {
    updateEvent.preventDefault();
    if (!validateDateFormat(start_date)) {
      setDateError(true);
      setTimeout(() => {
        setDateError(false);
      }, 5000);
      return;
    }
    if (event_prospectus.name) {
      console.log("event-prospectus", event_prospectus);
      const { data: fileData, error: fileError } = await supabase.storage
        .from("event-prospectus")
        .upload(`${event.id}/Prospectus`, event_prospectus, {
          cacheControl: "3600",
          upsert: false,
        });
      console.log({ fileData, fileError });
      if (!fileError) {
        setProspectusExists(true);
      }
    }

    console.log("event", event);
    const totalDaysAsNumber = parseInt(total_days);
    const data = await supabase
      .from("events")
      .update(
        {
          title,
          slug,
          start_date,
          total_days: totalDaysAsNumber,
          approval_status: "pending",
        },
        { count: "estimated" }
      )
      .eq("id", event.id);
    console.log("data", { data });
    if (data.error) {
      updateSuccessMessage("Error updating event");
    } else {
      updateSuccessMessage("Event updated");
      refreshEvents();
      setEditMode(false);
    }
  };
  const updateEventStatus = async (status: string) => {
    const data = await supabase
      .from("events")
      .update({ approval_status: status })
      .eq("id", event.id);
    console.log("data", { data });
    if (data.error) {
      updateSuccessMessage("Error updating event");
    } else {
      updateSuccessMessage("Event updated");
      refreshEvents();
      setEditMode(false);
    }
  };
  return (
    <div className="flex flex-col justify-center py-4 px-6 bg-zinc-700 border border-white rounded">
      <p
        className={`flex justify-center p-3 text-${
          approval_status[event.approval_status]
        } mb-2 border border-${approval_status[event.approval_status]}`}
      >
        Status: {event.approval_status}
      </p>
      {!editMode ? (
        <>
          <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
          {event.approval_status === "approved" && (
            <>
              <p className="text-gray-400 mb-2">Slug: {event.slug}</p>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <Link
                  target="_blank"
                  className="text-sm text-link whitespace-nowrap"
                  href={`/events/${event.slug}/broadcast`}
                >
                  Broadcast Page
                </Link>
                <Link
                  target="_blank"
                  className="text-sm text-link whitespace-nowrap"
                  href={`/events/${event.slug}`}
                >
                  Viewer Page
                </Link>
              </div>
              <p className="text-gray-400 mb-2" onClick={toggleRevealKey}>
                Publisher Key: {revealKey ? event.publisher_key : "**********"}
              </p>
              <p className="text-gray-400 mb-2">
                Start Date: {event.start_date}
              </p>
              <p className="text-gray-400 mb-2">
                Total Days: {event.total_days}
              </p>
            </>
          )}
          <button
            className="bg-[#208f68] px-4 py-2 mt-2 rounded"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        </>
      ) : (
        <>
          <p>
            Note: Updating your event will require re-approval if it is already
            approved.
          </p>
          <div className="flex flex-col justify-center py-4 px-6 text-black bg-zinc-700 border border-white rounded">
            <label htmlFor="title" className="text-white">
              Event Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold mb-4"
            />

            <label htmlFor="start_date" className="text-white">
              Start Date (yyyy-mm-dd)
            </label>
            <span className={`text-red-500 ${dateError ? "" : "hidden"}`}>
              Date formatted incorrectly
            </span>
            <input
              id="start_date"
              value={start_date}
              onChange={(e) => setStartDate(e.target.value)}
              className=" mb-2"
            />
            <label htmlFor="total_days" className="text-white">
              Days of use
            </label>
            <input
              id="total_days"
              value={total_days}
              onChange={(e) => {
                setTotalDays(e.target.value);
              }}
              className=" mb-2"
            />
            <label htmlFor="event_prospectus" className="text-white">
              Prospectus
            </label>
            <input
              id="event_prospectus"
              className={`${prospectusExists ? "hidden" : ""}`}
              type="file"
              onChange={(e) => {
                if (e.target.files) setEventProspectus(e.target.files[0]);
              }}
            />
            <button
              onClick={deleteProspectus}
              className={`text-white bg-red-300 text-xs p-2 mb-2 ${
                prospectusExists ? "" : "hidden"
              }`}
            >
              Delete Uploaded Prospectus
            </button>
            <button
              className="p-2 bg-green-500 text-white rounded-sm"
              onClick={submitUpdatedEvent}
            >
              Update
            </button>
          </div>

          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default EventCard;
