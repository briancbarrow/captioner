import EventLayout from "@/components/layouts/EventLayout";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import type { DGEvent } from "@/types/event";
import { createClient } from "@supabase/supabase-js";
import TranscriptDisplay from "@/components/TranscriptDisplay";

const supabase = createClient(
  "https://bztzviwntkfsgbkmbevu.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const EventHome: NextPage = () => {
  const [transcript, setTranscript] = useState("");
  const [event, setEvent] = useState({} as DGEvent);
  const router = useRouter();
  const slug: string | string[] | undefined = router.query.slug;
  useEffect(() => {
    if (slug) {
      const getEvent = async () => {
        const { data, error } = await supabase
          .from("events")
          .select("id, title")
          .eq("slug", slug);
        if (error) {
          throw error;
        }
        if (data) {
          setEvent(data[0]);
        }
      };
      getEvent().catch((err) => console.log(err));
    }
  }, [slug]);

  return (
    <EventLayout eventName={event.title}>
      <TranscriptDisplay
        eventId={event.id}
        height="81vh"
        bodyPadding="16"
        textSize="40px"
      />
    </EventLayout>
  );
};

export default EventHome;
