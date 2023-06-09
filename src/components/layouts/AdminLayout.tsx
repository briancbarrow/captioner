import EventHeader from "../EventHeader";

type EventLayout = {
  children?: React.ReactNode;
  eventName?: string;
  type?: "broadcast" | "viewer";
};

const EventLayout = ({ eventName, type, children }: EventLayout) => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <EventHeader
        eventName={eventName}
        isBroadcast={type === "broadcast" ? true : false}
      />
      <div className="bg-zinc-900 flex justify-start pb-2 px-14 w-full">
        <h1 className="font-bold ">
          <a href={`/events/`}>Events</a>
        </h1>
      </div>
      <div className="w-full h-full bg-black">
        <div>
          <main className="px-8 pt-3 h-[80vh] max-w-none">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default EventLayout;
