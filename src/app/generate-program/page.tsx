import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const GeneratePage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  //auto scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  //navigate user to profile page after the call ends
  useEffect(() => {
    if (callEnded) {
      const redierectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500);

      return () => clearTimeout(redierectTimer);
    }
  }, [callEnded, router]);

  //setUp event listener for vapi
  useEffect(() => {
    // Function to handle call start event
    const handleCallStart = () => {
      console.log("Call started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    // Function to handle call end event
    const handleCallend = () => {
      console.log("Call ended");
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    // Function to handle speech start event
    const handleSpeechStart = () => {
      console.log("Ai Speech started");
      setIsSpeaking(true);
    };

    // Function to handle speech end event
    const handleSpeechEnd = () => {
      console.log("Ai Speech ended");
      setIsSpeaking(false);
    };
    // Function to handle message event
    const handleMessage = (message: any) => {
      // setMessages((prevMessages) => [...prevMessages, message]);
      // if (messageContainerRef.current) {
      //   messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      // }
    };
    // Function to handle error event
    const handleError = (error: any) => {
      console.log("Vapi Error:", error);
      setConnecting(false);
      // setIsSpeaking(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallend)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    //cleanup event listeners on unmount
    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallend)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("Error", handleError);
    };
  }, []);

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);

        const fullName = user?.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : "There";

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: fullName,
            //TODO: Send user id as well later
          },
        });
      } catch (error) {
        console.log("failed to starting VAPI call:", error);
        setConnecting(false);
      }
    }
  };

  return <div>GeneratePage</div>;
};

export default GeneratePage;
