import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/types/supabase";

type ModalProps = {
  open: boolean;
  closeFunc: () => void;
  refreshEvents: () => void;
};

export default function MyModal({
  open,
  closeFunc,
  refreshEvents,
}: ModalProps) {
  let [isOpen, setIsOpen] = useState(open);
  const supabase = useSupabaseClient<Database>();

  const [title, setTitle] = useState("");
  const [start_date, setStartDate] = useState("");
  const [total_days, setTotalDays] = useState("");
  const [event_prospectus, setEventProspectus] = useState({} as File);
  const [successMessage, setSuccessMessage] = useState("");
  const [dateError, setDateError] = useState(false);

  function closeModal() {
    setIsOpen(false);
    closeFunc();
  }

  function openModal() {
    setIsOpen(true);
  }

  function validateDateFormat(date: string) {
    // Regular expression for mm/dd/yyyy format
    const dateFormat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])$/;

    if (date.match(dateFormat)) {
      return true;
    } else {
      return false;
    }
  }

  const submitNewEvent = async (updateEvent: any) => {
    updateEvent.preventDefault();
    if (!validateDateFormat(start_date)) {
      setDateError(true);
      setTimeout(() => {
        setDateError(false);
      }, 5000);
      return;
    }
    const totalDaysAsNumber = parseInt(total_days);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    const data = await supabase
      .from("events")
      .insert(
        {
          title,
          start_date,
          total_days: totalDaysAsNumber,
          approval_status: "pending",
          user_id: user?.id,
        },
        { count: "estimated" }
      )
      .select();
    console.log("data", { data });
    if (data.error) {
      updateSuccessMessage("Error creating event");
    } else {
      updateSuccessMessage("Event created");
      if (event_prospectus.name) {
        console.log("event-prospectus", event_prospectus);
        const { data: fileData, error: fileError } = await supabase.storage
          .from("event-prospectus")
          .upload(`${data.data[0].id}/Prospectus`, event_prospectus, {
            cacheControl: "3600",
            upsert: false,
          });
        console.log({ fileData, fileError });
      }
      closeModal();
      refreshEvents();
    }
  };

  const updateSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open dialog
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    New Event Form
                  </Dialog.Title>
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
                    <span
                      className={`text-red-500 ${dateError ? "" : "hidden"}`}
                    >
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
                      type="file"
                      onChange={(e) => {
                        if (e.target.files)
                          setEventProspectus(e.target.files[0]);
                      }}
                    />

                    <button
                      className="p-2 bg-green-500 text-white rounded-sm"
                      onClick={submitNewEvent}
                    >
                      Update
                    </button>
                  </div>

                  <button onClick={closeModal}>Cancel</button>

                  {/* <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeFunc}
                    >
                      Got it, thanks!
                    </button> 
                  </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
