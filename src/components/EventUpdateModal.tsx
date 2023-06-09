import { useState } from "react";
import { Dialog } from "@headlessui/react";
import type { DGEvent } from "@/types/event";
import { approval_status } from "@/components/EventCard";

function EventUpdateModal({
  event,
  showModal,
  closeModal,
}: {
  event: DGEvent;
  showModal: boolean;
  closeModal: () => void;
}) {
  // let [isOpen, setIsOpen] = useState(showModal);
  const [title, setTitle] = useState(event.title);
  const [slug, setSlug] = useState(event.slug);
  const [start_date, setStartDate] = useState(event.start_date);
  const [total_days, setTotalDays] = useState(event.total_days);

  const submitUpdatedEvent = async (event: any) => {
    event.preventDefault();
    const { data, error } = await supabase.from("events").update({
      title,
      slug,
      start_date,
      total_days,
      approval_status: "pending",
    });
  };
  const initiateCloseModal = () => {
    // setIsOpen(false);
    closeModal();
  };
  return (
    <Dialog open={showModal} onClose={closeModal}>
      <Dialog.Panel>
        <Dialog.Title>Edit Event</Dialog.Title>
        <Dialog.Description>
          Update the details of your event.
        </Dialog.Description>
        <p>
          Note: Updating your event will require re-approval if it is already
          approved.
        </p>
        <p
          className={`flex justify-center p-3 text-${
            approval_status[event.approval_status]
          } mb-2 border border-${approval_status[event.approval_status]}`}
        >
          Status: {event.approval_status}
        </p>
        <div className="flex flex-col justify-center py-4 px-6 bg-zinc-700 border border-white rounded">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold mb-4"
          >
            {title}
          </input>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="text-gray-400 mb-2"
          >
            {slug}
          </input>
          <input
            value={start_date}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-gray-400 mb-2"
          >
            Start Date: {event.start_date}
          </input>
          <input
            value={total_days}
            onChange={(e) => setTotalDays(parseInt(e.target.value))}
            className="text-gray-400 mb-2"
          >
            Total Days: {event.total_days}
          </input>
          <button onClick={submitUpdatedEvent}>Update</button>
        </div>

        <button onClick={initiateCloseModal}>Cancel</button>
      </Dialog.Panel>
    </Dialog>
  );
}

export default EventUpdateModal;
