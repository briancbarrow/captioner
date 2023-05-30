import EventLayout from "@/components/layouts/EventLayout";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { io, Socket } from "socket.io-client";
import { Event } from "socket.io";
let socket: Socket;
const EventBroadcast: NextPage = () => {
  const [transcript, setTranscript] = useState("");
  const router = useRouter();
  const slug: string | string[] | undefined = router.query.slug;
  useEffect(() => {
    if (!router.isReady) return;
    console.log("router.isReady", router.isReady);
    initializeSocket();
  }, [router.isReady, slug]);

  const initializeSocket = () => {
    fetch("/api/socket").finally(() => {
      const socket = io();

      socket.on("connect", () => {
        console.log("connect");
        socket.emit("hello");
      });

      socket.on("hello", (data) => {
        console.log("hello", data);
      });

      socket.on("a user connected", () => {
        console.log("a user connected");
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });
    });
  };
  return (
    <EventLayout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl text-white">Broadcast</h1>
      </div>
    </EventLayout>
  );
};

export default EventBroadcast;
