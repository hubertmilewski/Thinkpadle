"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import { BadgeButton } from "@/components/ui/BadgeButton";
import { signOut } from "@/lib/auth-helpers";

interface UserMenuProps {
  nickname: string | null;
  avatarUrl: string | null;
  onOpenSettings: () => void;
}

export function UserMenu({ nickname, avatarUrl, onOpenSettings }: UserMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <BadgeButton
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        icon={
          avatarUrl ? (
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative border-r border-gray-700">
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2A2A2C] border-r border-gray-700 flex items-center justify-center">
              <UserCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
            </div>
          )
        }
        label={nickname || "Player"}
        bgClass="bg-[#1C1C1E] sm:bg-gray-900"
        borderClass="border-gray-700"
        hoverClass="hover:bg-gray-800 hover:border-gray-500"
        textClass="text-gray-200"
        paddingClass="p-0 sm:pr-3"
        className="overflow-hidden h-10 sm:h-12 gap-2 sm:gap-3"
      />
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1C1C1E] border-2 border-gray-800 shadow-2xl flex flex-col z-50">
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onOpenSettings();
            }}
            className="w-full text-left px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-gray-800 border-b border-gray-800 transition-colors uppercase tracking-widest"
          >
            Settings
          </button>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              signOut();
            }}
            className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:text-red-500 hover:bg-gray-800 transition-colors uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
