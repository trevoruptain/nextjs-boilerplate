"use client";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Hash, Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function Component() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState("Ready");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
  };

  const handleCallToggle = () => {
    if (isCallActive) {
      setIsCallActive(false);
      setCallStatus("Call Ended");
      setCallDuration(0);
    } else {
      setIsCallActive(true);
      setCallStatus("Calling AI Agent...");
      // Simulate connecting to AI agent after 2 seconds
      setTimeout(() => setCallStatus("Connected to AI Agent"), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          AI Agent Caller
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="tel"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className="text-lg"
          disabled={isCallActive}
        />
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">{callStatus}</div>
          <div className="text-sm font-medium">{formatTime(callDuration)}</div>
        </div>
        {isCallActive && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
              <Button
                key={key}
                variant="outline"
                className="h-12 text-lg"
                onClick={() => setPhoneNumber((prev) => prev + key)}
              >
                {key === "#" ? <Hash size={18} /> : key}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant={isMuted ? "destructive" : "outline"}
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          disabled={!isCallActive}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </Button>
        <Button
          variant={isCallActive ? "destructive" : "default"}
          size="lg"
          className="w-32"
          onClick={handleCallToggle}
        >
          {isCallActive ? (
            <PhoneOff className="mr-2" />
          ) : (
            <Phone className="mr-2" />
          )}
          {isCallActive ? "End Call" : "Call"}
        </Button>
      </CardFooter>
    </Card>
  );
}
