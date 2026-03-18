import { useState, useRef, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const VoiceInputButton = ({ onTranscript, disabled }: Props) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const toggle = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        title: "Not supported",
        description: "Your browser doesn't support voice input. Try Chrome or Safari.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0]?.[0]?.transcript;
      if (transcript) onTranscript(transcript);
    };

    recognition.onerror = (e: any) => {
      if (e.error !== "aborted") {
        toast({
          title: "Voice error",
          description: e.error === "not-allowed" ? "Microphone access denied." : "Could not recognize speech.",
          variant: "destructive",
        });
      }
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening, onTranscript, toast]);

  return (
    <Button
      type="button"
      variant={listening ? "destructive" : "ghost"}
      size="icon"
      className="rounded-full shrink-0"
      onClick={toggle}
      disabled={disabled}
      title={listening ? "Stop listening" : "Voice input"}
    >
      {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </Button>
  );
};

export default VoiceInputButton;
