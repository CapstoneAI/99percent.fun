"use client";

import { useState, useRef } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function CreatePage() {
  const { isConnected } = useAccount();
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleLaunch = async () => {
    if (!name || !ticker) return;
    setLaunching(true);
    // TODO: call Clanker SDK
    await new Promise((r) => setTimeout(r, 2000));
    setLaunching(false);
    alert("Token launched! (mock)");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050d18" }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-12">

        {/* Back */}
        <Link href="/" style={{ fontSize: "12px", color: "#4a6080", display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
          ← back to dashboard
        </Link>

        {/* Title */}
        <div className="mb-8">
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "28px", color: "#e0eaf8", marginBottom: "6px" }}>
            Cook a Token
          </h1>
          <p style={{ fontSize: "12px", color: "#4a6080" }}>
            Cook your token. Live on Base in 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* Form — 3/5 */}
          <div className="md:col-span-3 flex flex-col gap-4">

            {/* Name */}
            <div>
              <label style={{ fontSize: "11px", color: "#8ba0bf", fontFamily: "Syne, sans-serif", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                TOKEN NAME *
              </label>
              <input
                className="input-field w-full px-3 py-2.5 text-sm"
                placeholder="e.g. Based Chad"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Ticker */}
            <div>
              <label style={{ fontSize: "11px", color: "#8ba0bf", fontFamily: "Syne, sans-serif", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                TICKER *
              </label>
              <div className="flex items-center gap-0">
                <span className="input-field px-3 py-2.5 text-sm"
                  style={{ borderRight: "none", borderRadius: "6px 0 0 6px", color: "#4a6080" }}>
                  $
                </span>
                <input
                  className="input-field flex-1 px-3 py-2.5 text-sm"
                  style={{ borderRadius: "0 6px 6px 0" }}
                  placeholder="CHAD"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 8))}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: "11px", color: "#8ba0bf", fontFamily: "Syne, sans-serif", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                DESCRIPTION <span style={{ color: "#4a6080", fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                className="input-field w-full px-3 py-2.5 text-sm"
                rows={3}
                placeholder="What is this token about?"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 280))}
                style={{ resize: "none" }}
              />
              <div style={{ fontSize: "10px", color: "#4a6080", textAlign: "right", marginTop: "2px" }}>
                {description.length}/280
              </div>
            </div>

            {/* Image */}
            <div>
              <label style={{ fontSize: "11px", color: "#8ba0bf", fontFamily: "Syne, sans-serif", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                TOKEN IMAGE <span style={{ color: "#4a6080", fontWeight: 400 }}>(optional)</span>
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="card flex items-center justify-center cursor-pointer"
                style={{ height: "80px", borderStyle: "dashed" }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="h-full object-contain rounded" />
                ) : (
                  <span style={{ fontSize: "12px", color: "#4a6080" }}>
                    Click to upload image
                  </span>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>

            {/* Fee box */}
            <div className="card p-3">
              <div style={{ fontSize: "11px", color: "#8ba0bf", fontFamily: "Syne, sans-serif", fontWeight: 600, marginBottom: "8px" }}>
                LAUNCH COST
              </div>
              <div className="flex justify-between mb-1.5">
                <span style={{ fontSize: "12px", color: "#4a6080" }}>99percent fee</span>
                <span style={{ fontSize: "12px", color: "#e0eaf8" }}>0.001 ETH</span>
              </div>
              <div className="flex justify-between mb-2">
                <span style={{ fontSize: "12px", color: "#4a6080" }}>gas (est.)</span>
                <span style={{ fontSize: "12px", color: "#e0eaf8" }}>~$0.30</span>
              </div>
              <div style={{ height: "1px", background: "#1a2a45", marginBottom: "8px" }} />
              <div className="flex justify-between">
                <span style={{ fontSize: "12px", color: "#8ba0bf", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: "14px", color: "#29d4f5", fontFamily: "Syne, sans-serif", fontWeight: 800 }}>~$3.30</span>
              </div>
              <p style={{ fontSize: "10px", color: "#4a6080", marginTop: "8px", lineHeight: 1.5 }}>
                Token creators earn <strong style={{ color: "#29d4f5" }}>40% of all trading fees in ETH</strong> — automatically, forever.
              </p>
            </div>

            {/* Launch button */}
            {isConnected ? (
              <button
                className="btn-primary py-3 w-full"
                style={{ fontSize: "14px", opacity: (!name || !ticker || launching) ? 0.5 : 1 }}
                onClick={handleLaunch}
                disabled={!name || !ticker || launching}
              >
                {launching ? "Launching…" : "🚀 Launch Token"}
              </button>
            ) : (
              <div className="flex justify-center">
                <ConnectButton label="Connect wallet to launch" />
              </div>
            )}
          </div>

          {/* Preview — 2/5 */}
          <div className="md:col-span-2">
            <div style={{ fontSize: "11px", color: "#8ba0bf", fontFamily: "Syne, sans-serif", fontWeight: 600, marginBottom: "10px" }}>
              PREVIEW
            </div>
            <div className="card p-4">
              {/* Token avatar */}
              <div className="w-14 h-14 rounded-lg mb-3 flex items-center justify-center mx-auto"
                style={{ background: "#080f1e", border: "1px solid #1a2a45" }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span style={{ fontSize: "24px" }}>🔵</span>
                )}
              </div>

              {/* Name */}
              <div className="text-center mb-3">
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "16px", color: "#e0eaf8" }}>
                  {name || "Token Name"}
                </div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#29d4f5" }}>
                  ${ticker || "TICK"}
                </div>
              </div>

              {/* Description */}
              {description && (
                <p style={{ fontSize: "11px", color: "#4a6080", textAlign: "center", lineHeight: 1.5, marginBottom: "12px" }}>
                  {description}
                </p>
              )}

              {/* Human badge */}
              <div className="flex justify-center">
                <span style={{
                  fontSize: "10px", fontFamily: "Syne, sans-serif", fontWeight: 700,
                  color: "#29d4f5", background: "#29d4f515",
                  border: "1px solid #29d4f530", padding: "3px 8px", borderRadius: "4px"
                }}>
                  👤 HUMAN
                </span>
              </div>

              {/* Starting price */}
              <div style={{ height: "1px", background: "#1a2a45", margin: "12px 0" }} />
              <div className="flex justify-between">
                <span style={{ fontSize: "11px", color: "#4a6080" }}>Starting price</span>
                <span style={{ fontSize: "11px", color: "#e0eaf8" }}>$0.00001</span>
              </div>
              <div className="flex justify-between mt-1">
                <span style={{ fontSize: "11px", color: "#4a6080" }}>Network</span>
                <span style={{ fontSize: "11px", color: "#0052ff", fontWeight: 600 }}>Base</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
