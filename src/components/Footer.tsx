"use client";

import { useState } from "react";
import Image from "next/image";
import { siteContent } from "@/data/content";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer className="w-full mt-auto flex flex-col items-center gap-6 pt-8 pb-4">
      <div className="flex items-center gap-8">
        <a
          href="https://github.com/hubertmilewski"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 hover:opacity-100 transition-all hover:scale-110 duration-300"
          aria-label="GitHub"
        >
          <Image
            src="/github.svg"
            alt="GitHub"
            width={28}
            height={28}
            className="invert"
          />
        </a>
        <a
          href="https://reddit.com/r/thinkpad"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 hover:opacity-100 transition-all hover:scale-110 duration-300"
          aria-label="Reddit"
        >
          <Image src="/reddit.svg" alt="Reddit" width={28} height={28} />
        </a>
      </div>

      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <p className="text-gray-600 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
          © {currentYear}{" "}
          <span className="text-gray-400 font-black">
            {siteContent.header.title}
          </span>
          .{" "}
          <span className="text-red-500">
            {siteContent.footer.copyrightHighlight}
          </span>{" "}
          {siteContent.footer.copyright}
        </p>

        <div className="flex items-center justify-center gap-2">
          <div className="relative flex flex-col items-center">
            <button
              onMouseEnter={() => setShowPrivacy(true)}
              onMouseLeave={() => setShowPrivacy(false)}
              onClick={() => setShowPrivacy(!showPrivacy)}
              className="text-[9px] sm:text-[10px] text-gray-700 hover:text-tp-red font-black uppercase tracking-widest transition-colors cursor-help"
            >
              {siteContent.footer.privacyPolicy.label}
            </button>

            <div
              className={`
            absolute bottom-full mb-2 w-64 p-3 bg-tp-card border border-gray-800 shadow-2xl transition-all duration-300 pointer-events-none
            ${showPrivacy ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
          `}
            >
              <p className="text-[10px] text-gray-400 leading-relaxed font-medium uppercase tracking-tight">
                {siteContent.footer.privacyPolicy.text1}
                <span className="text-white">
                  {siteContent.footer.privacyPolicy.highlight}
                </span>
                {siteContent.footer.privacyPolicy.text2}
              </p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-800" />
            </div>
          </div>
          <a
            href="mailto:kontakt@thinkpadle.com"
            className="text-[10px] sm:text-[11px] text-gray-500 hover:text-white transition-colors tracking-widest font-semibold mt-1 mb-1"
          >
          {siteContent.footer.contact}
          </a>
        </div>
      </div>
    </footer>
  );
}
