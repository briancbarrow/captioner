import AdminLayout from "@/components/layouts/AdminLayout";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import type { DGEvent } from "@/types/event";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database

const supabase = createClient(
  "https://bztzviwntkfsgbkmbevu.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

let ws: WebSocket;
let mediaRecorder: MediaRecorder;

const EventHome: NextPage = () => {
  const router = useRouter();
  const slug: string | string[] | undefined = router.query.slug;
  const [publisherKey, setpublisherKey] = useState("TestingBrian");
  const [event, setEvent] = useState({} as DGEvent);
  const [dgKey, setDgKey] = useState("");
  const [showMicCheck, setShowMicCheck] = useState(false);
  const [diableSubmit, setDisableSubmit] = useState(false);

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

  function start() {
    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0 && ws.readyState == 1) {
        ws.send(event.data);
      }
    });
    mediaRecorder.start(250);
  }

  async function handleResponse(message: MessageEvent) {
    const data = JSON.parse(message.data);
    const transcript = data.channel.alternatives[0].transcript;
    if (transcript.length > 0) {
      const insertData = await supabase.from("transcripts").insert({
        transcript_json: data,
        event_id: event.id,
        transcript,
      });
      if (insertData.error) {
        throw insertData.error;
      }
    }
  }

  const getDGKey = async () => {
    const res = await fetch("/api/tempKey", {
      body: JSON.stringify({ eventId: event.id, key: publisherKey }),
      method: "POST",
    });
    const resp = await res.json();
    if (resp.error) {
      console.log("error", resp.error);
      return alert(resp.error);
    }
    setDgKey(resp.deepgramToken);

    ws = new WebSocket(
      "wss://api.deepgram.com/v1/listen?tier=enhanced&punctuate=true",
      ["token", resp.deepgramToken]
    );
    ws.onopen = start;
    ws.onmessage = handleResponse;
  };
  const getMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      setShowMicCheck(true);
    } catch (err) {
      alert("You must provide access to the microphone");
    }
  };

  return (
    <AdminLayout type="broadcast" eventName={event.title}>
      <div className="bg-black border-gray-200 border m-6 p-6 text-gray-200 rounded grid md:grid-cols-3 gap-4 md:gap-6 ">
        <div>
          <h2>Step 1</h2>
          <p>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Ensure your speaker's voice can be captured as a mic in this
            browser.
          </p>
          <div className="flex gap-4 items-center">
            <button
              id="access-mic"
              className="bg-[#208f68] px-4 py-2 mt-2 rounded"
              onClick={getMicAccess}
            >
              Access mic
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="mic-success"
              className={`h-5 w-5 mt-2 text-grass ${
                showMicCheck ? "" : "hidden"
              }`}
              viewBox="0 0 20 20"
              fill="#208f68"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div>
          <h2>Step 2</h2>
          <p>Enter the broadcaster key provided to you by the Deepgram team.</p>
          <form
            className="flex gap-4 items-center mt-2"
            onSubmit={(e: React.SyntheticEvent) => {
              e.preventDefault();
              getDGKey();
            }}
          >
            <input
              type="text"
              id="key"
              name="key"
              value={publisherKey}
              onChange={(e) => setpublisherKey(e.target.value)}
              className="border-2 text-black text-base"
            />
            <input
              type="submit"
              value="Submit"
              id="submit-key"
              disabled={diableSubmit}
              className="!mt-0 cursor-pointer bg-[#208f68] px-4 py-2 rounded"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="key-success"
              className={`h-5 w-5 mt-2 text-grass ${
                dgKey !== "" ? "" : "hidden"
              }`}
              viewBox="0 0 20 20"
              fill="#208f68"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </form>
        </div>
        <div>
          <h2>Step 3</h2>
          <p>
            Open the audience page in another browser. Keep this page open in
            the background.
          </p>
          <a
            id="public"
            href={`/events/${slug}`}
            className="button underline text-blue-400"
            target="_blank"
          >
            Open audience page
          </a>
        </div>
      </div>
      <TranscriptDisplay
        textSize="20px"
        height="50%"
        bodyPadding="4"
        eventId={event.id}
      />
    </AdminLayout>
  );
};

export default EventHome;
