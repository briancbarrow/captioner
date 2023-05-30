import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { DGEvent } from "@/types/event";

const supabase = createClient(
  "https://bztzviwntkfsgbkmbevu.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type TDProps = {
  eventId: string;
  textSize: string;
  height: string;
  bodyPadding?: string;
};

const TranscriptDisplay = (props: TDProps) => {
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (props.eventId) {
      const getPreviousTranscript = async () => {
        const { data, error } = await supabase
          .from("transcripts")
          .select("transcript")
          .eq("event_id", props.eventId)
          .order("created_at", { ascending: false })
          .limit(15);
        if (error) {
          throw error;
        }
        if (data) {
          for (let i = data.length - 1; i >= 0; i--) {
            setTranscript((prev) => {
              return prev + "\n" + data[i].transcript;
            });
          }
        }
      };
      getPreviousTranscript().catch((err) => console.log(err));
    }
    const channel = supabase
      .channel("transcript changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transcripts",
          filter: `event_id=eq.${props.eventId}`,
        },
        (payload) => {
          setTranscript((prev) => {
            return prev + "\n" + payload.new.transcript;
          });
          // const messageBody = document.getElementById("message-body");
          const anchor = document.getElementById("anchor");

          if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
        }
      )
      .subscribe();
    // }
    return () => {
      console.log("unsubscribing");
      supabase.removeChannel(channel);
    };
  }, [props.eventId]);

  return (
    <div
      className={`text-[${props.textSize}] max-h-[${props.height}] overflow-scroll`}
      style={{ overflowAnchor: "none" }}
    >
      <p
        id="message-body"
        className={`whitespace-pre-wrap m-6 text-center ${
          props.bodyPadding ? `pb-${props.bodyPadding}` : ""
        }`}
      >
        {transcript}
      </p>
      <div id="anchor"></div>
    </div>
  );
};

export default TranscriptDisplay;
