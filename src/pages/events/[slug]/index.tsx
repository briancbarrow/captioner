import EventLayout from "@/components/layouts/EventLayout";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
let socket: SocketIOClient.Socket;
let mediaRecorder: MediaRecorder;

const EventHome: NextPage = () => {
  const [transcript, setTranscript] = useState("");
  useEffect(() => {
    socketInitializer();
  }, []);
  const router = useRouter();

  const socketInitializer = async () => {
    // await fetch("/api/socket");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        console.log("mediaRecorder", mediaRecorder);
        socket = io("http://localhost:3333", {
          transports: ["websocket"],
        });
        console.log("socket", socket);
      })
      .then(() => {
        console.log("other then");
        socket.on("connect", async () => {
          console.log("connected");
          if (mediaRecorder.state == "inactive") mediaRecorder.start(500);

          mediaRecorder.addEventListener("dataavailable", (event) => {
            socket.emit("packet-sent", event.data);
          });

          socket.addEventListener("print-transcript", (msg: any) => {
            // console.log("msg", msg);
            // console.log("transcript", transcript);
            // let newTranscript = transcript + "\n" + msg;
            // console.log("newTranscript", newTranscript);
            // setTranscript(newTranscript);
            const messageBody = document.getElementById("message-body");
            const anchor = document.getElementById("anchor");
            messageBody ? (messageBody.innerText += "\n" + msg) : null;
            function scrollBottom(element: HTMLElement) {
              element.scroll({ top: element.scrollHeight, behavior: "smooth" });
            }

            if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
          });
        });
        socket.on("connect_error", (err: any) => {
          console.log("connect_error due to ", err);
        });
      });
  };

  return (
    <EventLayout>
      <div
        className={`text-[40px] max-h-[80vh] overflow-scroll`}
        style={{ overflowAnchor: "none" }}
      >
        <p id="message-body">{transcript}</p>
        <div id="anchor"></div>
      </div>
    </EventLayout>
  );
};

export default EventHome;
