"use client";

import { useState } from "react";
import Image from "next/image";
import { siteContent } from "@/data/content";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer className="w-full mt-4 border-t border-white/5 px-2 md:px-6 ">

      <div className="hidden flex-col items-center gap-3 py-6">
        <div className="text-center px-4">
          <p className="text-[#888] text-[10px] uppercase tracking-widest">
            © {currentYear}{" "}
            <span className="text-gray-300 font-semibold">{siteContent.header.title}</span>
            <span className="mx-2 opacity-30">|</span>
            <span className="text-red-500/90">{siteContent.footer.copyrightHighlight}</span>{" "}
            {siteContent.footer.copyright}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4">
          <div className="relative flex flex-col items-center">
            <button
              onMouseEnter={() => setShowPrivacy(true)}
              onMouseLeave={() => setShowPrivacy(false)}
              onClick={() => setShowPrivacy(!showPrivacy)}
              className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors cursor-help"
            >
              {siteContent.footer.privacyPolicy.label}
            </button>
            <div
              className={`absolute bottom-full mb-3 w-56 p-3 bg-[#1C1C1E] border border-white/10 shadow-2xl transition-all duration-200 pointer-events-none z-50
                ${showPrivacy ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
            >
              <p className="text-[10px] text-gray-400 leading-relaxed text-center">
                {siteContent.footer.privacyPolicy.text1}
                <span className="text-white font-medium mx-1">{siteContent.footer.privacyPolicy.highlight}</span>
                {siteContent.footer.privacyPolicy.text2}
              </p>
            </div>
          </div>

          <a
            href="mailto:contact@thinkpadle.com"
            className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            {siteContent.footer.contact}
          </a>

          <div className="flex items-center gap-4">
            <a href="https://github.com/hubertmilewski" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity" aria-label="GitHub">
              <Image src="/github.svg" alt="GitHub" width={16} height={16} className="invert" />
            </a>
            <a href="https://reddit.com/r/thinkpad" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity" aria-label="Reddit">
              <Image src="/reddit.svg" alt="Reddit" width={16} height={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-3 items-center py-4">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
          © {currentYear}{" "}
          <span className="text-gray-300">{siteContent.header.title}</span>
          <span className="mx-1 opacity-30">|</span>
          <span className="text-red-500">{siteContent.footer.copyrightHighlight}</span>{" "}
          {siteContent.footer.copyright}
        </p>

        <div className="flex items-center justify-center gap-3">
          <div className="relative flex items-center">
            <button
              onMouseEnter={() => setShowPrivacy(true)}
              onMouseLeave={() => setShowPrivacy(false)}
              onClick={() => setShowPrivacy(!showPrivacy)}
              className="text-xs text-gray-500 hover:text-gray-200 font-bold uppercase tracking-widest transition-colors"
            >
              {siteContent.footer.privacyPolicy.label}
            </button>
            <div
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-[#1C1C1E] border border-gray-800 shadow-2xl transition-all duration-200 pointer-events-none z-50
                ${showPrivacy ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
            >
              <p className="text-[10px] text-gray-400 leading-relaxed font-medium uppercase tracking-tight">
                {siteContent.footer.privacyPolicy.text1}
                <span className="text-white">{siteContent.footer.privacyPolicy.highlight}</span>
                {siteContent.footer.privacyPolicy.text2}
              </p>
            </div>
          </div>

          <span className="text-gray-700">·</span>

          <a
            href="mailto:contact@thinkpadle.com"
            className="text-xs text-gray-500 hover:text-gray-200 font-bold uppercase tracking-widest transition-colors"
          >
            {siteContent.footer.contact}
          </a>
        </div>

        <div className="flex items-center justify-end gap-4">
          <a href="https://github.com/hubertmilewski" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-80 transition-opacity" aria-label="GitHub">
            <Image src="/github.svg" alt="GitHub" width={24} height={24} className="invert" />
          </a>
          <a href="https://reddit.com/r/thinkpad" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-80 transition-opacity" aria-label="Reddit">
            <Image src="/reddit.svg" alt="Reddit" width={24} height={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}