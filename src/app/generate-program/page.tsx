"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GeneratePage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);

  const isReady = !isSpeaking && !callActive && !callEnded;

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
    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    console.log("Workflow ID", workflowId);

    // Function to handle speech end event
    const handleSpeechEnd = () => {
      console.log("Ai Speech ended");
      setIsSpeaking(false);
    };
    // Function to handle message event
    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    // Function to handle error event
    const handleError = (error: any) => {
      console.log("Vapi Error", error);
      setConnecting(false);
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
            user_id: user?.id,
          },
        });
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden  pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        {/* Title */}
        <div className="text-center mb-8"></div>

        {/* video call area  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Ai Assistant card */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* Ai voice annimation */}
              <div
                className={`absolute inset-0 ${
                  isSpeaking ? "opacity-30" : "opacity-0"
                } transition-opacity duration-300`}
              >
                {/* Voice wave animation when speaking */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                        isSpeaking ? "animate-sound-wave" : ""
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isSpeaking
                          ? `${Math.random() * 50 + 20}%`
                          : "5%",
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Ai Assistant Image */}
              <div className="relative size-34 mb-4">
                {/* Glowing outer pulse ring */}
                <div
                  className={`absolute inset-0 rounded-full bg-primary blur-lg  opacity-10 ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                ></div>

                {/* Halo ring */}
                {/* <div className="absolute inset-1 rounded-full border-4 border-primary/30 z-0"></div> */}

                {/* Avatar container with frosted glass effect */}
                <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden ">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10 " />
                  <img
                    src="/ai-avatar.png"
                    alt="AI Assistant"
                    className=" w-full h-full object-cover "
                  />
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground">FitGenix AI</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fitness & Diet Coach
              </p>

              {/* SPEAKING INDICATOR */}

              <div
                className={`mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300
                ${
                  isSpeaking
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/30"
                    : "border-border bg-card"
                }`}
              >
                {/* Animated Dot */}
                <div className="relative flex items-center justify-center w-3 h-3">
                  <div
                    className={`absolute inline-flex w-full h-full rounded-full ${
                      isSpeaking
                        ? "bg-primary animate-ping opacity-75"
                        : "bg-muted"
                    }`}
                  />
                  <div
                    className={`relative w-2 h-2 rounded-full ${
                      isSpeaking ? "bg-primary" : "bg-muted-foreground"
                    }`}
                  />
                </div>

                {/* Animated Text */}
                <span
                  className={`text-xs font-medium text-muted-foreground ${
                    isSpeaking
                      ? "animate-textPulse text-primary font-semibold"
                      : ""
                  }`}
                >
                  {isSpeaking
                    ? "Speaking..."
                    : callActive
                      ? "Listening..."
                      : callEnded
                        ? "Redirecting to profile..."
                        : "Waiting..."}
                </span>
              </div>
            </div>
          </Card>

          {/* User Card  */}
          <Card
            className={`bg-card/90 backdrop-blur-sm border overflow-hidden relative`}
          >
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* User Image */}
              <div className="relative size-32 mb-4">
                <img
                  src={user?.imageUrl}
                  alt="User"
                  // ADD THIS "size-full" class to make it rounded on all images
                  className="size-full object-cover rounded-full"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground">You</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user
                  ? (user.firstName + " " + (user.lastName || "")).trim()
                  : "Guest"}
              </p>

              {/* User Ready Text */}
              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}
              >
                {/* <div className={`w-2 h-2 rounded-full bg-muted`} /> */}
                {/* <span className="text-xs text-muted-foreground">Ready</span> */}

                {/* Animated Dot */}
                <div className="relative flex items-center justify-center w-3 h-3">
                  {/* Outer ring */}
                  <div
                    className={`absolute inline-flex w-full h-full rounded-full ${
                      isSpeaking || callActive
                        ? "bg-primary animate-ping opacity-75"
                        : isReady
                          ? "bg-muted"
                          : "bg-muted"
                    }`}
                  />
                  {/* Inner dot */}
                  <div
                    className={`relative w-2 h-2 rounded-full ${
                      isSpeaking || callActive
                        ? "bg-primary"
                        : isReady
                          ? "bg-muted-foreground"
                          : "bg-muted"
                    }`}
                  />
                </div>

                {/* Animated Text */}
                <span
                  className={`text-xs font-medium text-muted-foreground ${
                    isSpeaking || isReady
                      ? ""
                      : "animate-textPulse text-primary font-semibold"
                  }`}
                >
                  {isSpeaking
                    ? "Listening..."
                    : callActive
                      ? "Speaking..."
                      : callEnded
                        ? "Redirecting to profile..."
                        : "Ready..."}
                </span>
              </div>
            </div>
          </Card>
        </div>
        {/* Message container*/}
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
          >
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    {msg.role === "assistant" ? "FitGenix AI" : "You"}:
                  </div>
                  <p className="text-foreground">{msg.content}</p>
                </div>
              ))}

              {callEnded && (
                <div className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-primary mb-1">
                    System:
                  </div>
                  <p className="text-foreground">
                    Your fitness program has been created! Redirecting to your
                    profile...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call controls */}
        <div className="w-full flex justify-center gap-4">
          <Button
            className={`w-40 text-xl rounded-3xl ${
              callActive
                ? "bg-destructive hover:bg-destructive/90"
                : callEnded
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary hover:bg-primary/90"
            } text-white relative`}
            onClick={toggleCall}
            disabled={connecting || callEnded}
          >
            {connecting && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
            )}

            <span>
              {callActive
                ? "End Call"
                : connecting
                  ? "Connecting..."
                  : callEnded
                    ? "View Profile"
                    : "Start Call"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
