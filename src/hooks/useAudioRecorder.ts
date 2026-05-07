import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "recording" | "stopping" | "transcribing";

const TRANSCRIBE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`;

function pickMime(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/mpeg",
  ];
  for (const c of candidates) {
    // @ts-ignore
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(c)) return c;
  }
  return "";
}

export function useAudioRecorder() {
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setElapsed(0);
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const start = useCallback(async () => {
    if (status !== "idle") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Microphone not supported in this browser");
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
    streamRef.current = stream;
    const mimeType = pickMime();
    const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    recorderRef.current = rec;
    chunksRef.current = [];

    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.start(250);
    startedAtRef.current = Date.now();
    setStatus("recording");
    timerRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 250);
  }, [status]);

  const stopAndTranscribe = useCallback(
    async (language?: string): Promise<string> => {
      const rec = recorderRef.current;
      if (!rec) return "";
      setStatus("stopping");

      const blob: Blob = await new Promise((resolve) => {
        rec.onstop = () => {
          const type = rec.mimeType || "audio/webm";
          resolve(new Blob(chunksRef.current, { type }));
        };
        rec.stop();
      });

      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Guard against empty/very short clips
      if (blob.size < 1000) {
        cleanup();
        setStatus("idle");
        throw new Error("Recording too short");
      }

      setStatus("transcribing");
      try {
        const ext = blob.type.includes("mp4")
          ? "mp4"
          : blob.type.includes("mpeg")
          ? "mp3"
          : "webm";
        const fd = new FormData();
        fd.append("file", blob, `voice.${ext}`);
        if (language) fd.append("language", language);

        const resp = await fetch(TRANSCRIBE_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: fd,
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.error || `Transcription failed (${resp.status})`);
        }
        const data = await resp.json();
        return (data.text || "").trim();
      } finally {
        cleanup();
        setStatus("idle");
      }
    },
    [cleanup]
  );

  const cancel = useCallback(() => {
    try {
      recorderRef.current?.stop();
    } catch {}
    cleanup();
    setStatus("idle");
  }, [cleanup]);

  return { status, elapsed, start, stopAndTranscribe, cancel };
}
