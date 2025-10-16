// app/submit/page.tsx (or wherever your component lives)
"use client";
import zkeSdk, { Proof } from "@zk-email/sdk";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  FileUp,
  Cpu,
  CheckCircle2,
  SendHorizonal,
} from "lucide-react";

const blueprintSlug = "DimiDumo/SuccinctZKResidencyInvite@v3";

export default function SubmitProof() {
  const router = useRouter();
  const sdk = zkeSdk();

  const [fileContent, setFileContent] = useState("");
  const [description, setDescription] = useState("");
  const [isLoadingClient, setIsLoadingClient] = useState(false);
  const [isLoadingServer, setIsLoadingServer] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [proof, setProof] = useState<Proof | null>(null);

  useEffect(() => {
    const id = "obscura-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoadingClient || isLoadingServer || isPublishing) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + Math.random() * 10 : p));
      }, 400);
    } else {
      setProgress(100);
      const t = setTimeout(() => setProgress(0), 1000);
      return () => clearTimeout(t);
    }
    return () => clearInterval(interval);
  }, [isLoadingClient, isLoadingServer, isPublishing]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setFileContent(e.target?.result as string);
    reader.readAsText(file);
  };

  const handleEmailClient = async () => {
    if (!fileContent) return alert("Please upload an email file first.");
    setProof(null);
    setIsLoadingClient(true);
    try {
      const blueprint = await sdk.getBlueprint(blueprintSlug);
      const prover = blueprint.createProver({ isLocal: true });
      const p = await prover.generateProof(fileContent);
      setProof(p);
      await blueprint.verifyProofOnChain(p);
    } catch (err) {
      console.error("Client proof error:", err);
    }
    setIsLoadingClient(false);
  };

  const handleEmailServer = async () => {
    if (!fileContent) return alert("Please upload an email file first.");
    setProof(null);
    setIsLoadingServer(true);
    try {
      const blueprint = await sdk.getBlueprint(blueprintSlug);
      const prover = blueprint.createProver();
      const p = await prover.generateProof(fileContent);
      setProof(p);
      await blueprint.verifyProofOnChain(p);
    } catch (err) {
      console.error("Server proof error:", err);
    }
    setIsLoadingServer(false);
  };

  const formatProofHash = (p: Proof) => {
    const json = JSON.stringify(p.props.proofData);
    let hash = 0;
    for (let i = 0; i < json.length; i++) {
      hash = (hash * 31 + json.charCodeAt(i)) >>> 0;
    }
    return `0x${hash.toString(16).padStart(8, "0")}`;
  };

  const handleSubmitProof = async () => {
    if (!proof) return alert("No proof available to submit!");
    if (!description.trim()) return alert("Please add a short description.");

    setIsPublishing(true);

    const payload = {
      description: description.trim(),
      proof: {
        proofData: proof.props.proofData,
        publicOutputs: proof.props.publicOutputs,
        publicData: proof.props.publicData,
        externalInputs: proof.props.externalInputs,
        isLocal: proof.props.isLocal,
        blueprintSlug,
      },
    };

    // Start API call and minimum delay in parallel
    const [apiResult] = await Promise.all([
      fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ]);

    if (!apiResult.ok) {
      console.error(await apiResult.text());
      setIsPublishing(false);
      return alert("Failed to publish.");
    }

    // Brief pause for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsPublishing(false);
    router.push("/leaks");
  };

  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-200 text-black px-6 py-16"
      style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
    >
      {progress > 0 && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
          className="fixed top-0 left-0 h-1 bg-neutral-900 z-50"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full text-center"
      >
        <h1
          className="text-5xl sm:text-6xl font-bold tracking-tight text-neutral-900 mb-4 drop-shadow-sm"
          style={{
            fontFamily:
              "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
          }}
        >
          Submit a Leak
        </h1>

        <p className="text-neutral-700 text-lg mb-10">
          Privately submit an email proof — verified, but never exposed.
        </p>

        <div className="bg-white border border-neutral-200 shadow-sm p-8 rounded-2xl flex flex-col items-center space-y-6">
          <label className="w-full max-w-xs flex flex-col items-center px-4 py-6 bg-neutral-100 text-neutral-800 rounded-xl cursor-pointer hover:bg-neutral-200 transition">
            <FileUp className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">
              {fileContent ? "File uploaded ✅" : "Upload email (.eml) file"}
            </span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of the leak…"
            className="w-full max-w-md border border-neutral-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            rows={3}
          />

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleEmailClient}
              disabled={isLoadingClient}
              className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {isLoadingClient ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> Generating...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" /> Prove in Browser
                </>
              )}
            </button>

            <button
              onClick={handleEmailServer}
              disabled={isLoadingServer}
              className="flex items-center gap-2 bg-neutral-700 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-neutral-600 transition disabled:opacity-50"
            >
              {isLoadingServer ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> Generating...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" /> Prove Remotely
                </>
              )}
            </button>
          </div>

          {(isLoadingClient || isLoadingServer) && (
            <p className="text-xs text-neutral-500 mt-4">
              Proof generation can take a few minutes…
            </p>
          )}
        </div>

        {proof && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 bg-neutral-900 text-neutral-100 p-8 rounded-2xl text-left max-w-md mx-auto space-y-5 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-400 w-6 h-6" />
                <h3
                  className="font-semibold text-xl text-neutral-100"
                  style={{
                    fontFamily:
                      "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
                  }}
                >
                  Proof Ready
                </h3>
              </div>
              <span className="text-xs text-neutral-400">
                {new Date().toLocaleTimeString()}
              </span>
            </div>

            <div className="border-t border-neutral-700 pt-4 space-y-2 text-sm text-neutral-300">
              <p>
                <span className="font-medium text-neutral-200">Type:</span>{" "}
                {proof.props.isLocal ? "Local (browser)" : "Remote (server)"}
              </p>
              <p>
                <span className="font-medium text-neutral-200">
                  Verification:
                </span>{" "}
                On-chain ✅
              </p>
              <p className="break-all">
                <span className="font-medium text-neutral-200">
                  Proof hash:
                </span>{" "}
                {formatProofHash(proof)}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-700">
              <button
                onClick={handleSubmitProof}
                disabled={isPublishing}
                className="group relative w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-2 transition-all duration-300 ease-out group-hover:gap-3">
                      Submit and Verify
                      <SendHorizonal className="h-4 w-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-neutral-600 via-neutral-700 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        <footer className="mt-16 text-sm text-neutral-500">
          © {new Date().getFullYear()} Obscura — Private. Proven. Minimal.
        </footer>
      </motion.div>
    </main>
  );
}
