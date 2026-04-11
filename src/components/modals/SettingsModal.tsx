import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, UserCircle, Eye, LogOut, UploadCloud } from "lucide-react";
import { signOut, uploadAvatar } from "@/lib/auth-helpers";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { TRANSITION_SETTINGS, MOBILE_DRAWER_VARIANTS, DESKTOP_MODAL_VARIANTS } from "@/lib/animations";

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 640;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useAuth();

  const initialNickname = user?.user_metadata?.nickname || user?.user_metadata?.full_name || user?.user_metadata?.name || ("User");
  const initialAvatarUrl = user?.user_metadata?.avatar_url || "";
  const email = user?.email || "";
  const isGithub = user?.app_metadata?.provider === "github" || user?.identities?.some(id => id.provider === "github");

  const [nickname, setNickname] = useState(initialNickname);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setNickname(initialNickname);
      setAvatarUrl(initialAvatarUrl);
      setPassword("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialNickname, initialAvatarUrl]);

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let finalAvatarUrl = avatarUrl;

      if (avatarFile && user?.id) {
        const uploadedUrl = await uploadAvatar(avatarFile, user.id);
        if (uploadedUrl) {
          finalAvatarUrl = uploadedUrl;
          setAvatarUrl(uploadedUrl);
        }
      }

      const updates: { data: { nickname: string; avatar_url: string }; password?: string } = { data: { nickname, avatar_url: finalAvatarUrl } };
      if (!isGithub && password && password.length >= 6) {
        updates.password = password;
      }
      await supabase.auth.updateUser(updates);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 flex items-start justify-start sm:items-center sm:justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-transparent sm:bg-black/80"
          />

          <motion.div
            variants={isMobile() ? MOBILE_DRAWER_VARIANTS : DESKTOP_MODAL_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={TRANSITION_SETTINGS}
            className="relative w-full h-full pb-0 sm:pb-6 sm:h-auto sm:max-h-[90vh] sm:max-w-md bg-[#1C1C1E] border-0 sm:border-2 border-gray-800 p-6 pt-3 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex justify-between items-center w-full mb-8 pt-4 shrink-0">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors z-210 font-semibold tracking-wide"
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-400 p-2"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex flex-col items-center justify-center mb-8 shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1C1C1E] flex items-center justify-center overflow-hidden border-[3px] border-gray-700/50 mb-4 shadow-xl shrink-0 relative aspect-square box-border">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="User Avatar" fill className="object-cover rounded-full" />
                  ) : (
                    <UserCircle size={48} className="text-gray-500 relative z-10" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {initialNickname}
                </h2>
                <p className="text-sm font-semibold text-red-500 mt-1 uppercase tracking-widest">
                  Thinkpadle Player
                </p>
              </div>

              <div className="flex flex-col gap-5 text-left w-full mb-8">
              <div className="flex flex-col gap-1.5">
                <label className="block text-[13px] font-bold text-white ml-1">
                  Your Email
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2A2A2C] border border-transparent  px-4 py-3.5 text-gray-400 focus:outline-none text-[15px]"
                  value={email}
                  disabled
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block text-[13px] font-bold text-white ml-1">
                  Nickname
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2A2A2C] border border-transparent  px-4 py-3.5 text-white focus:outline-none focus:border-red-500/50 transition-colors text-[15px]"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block text-[13px] font-bold text-white ml-1">
                  Avatar
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-between w-full bg-[#2A2A2C] border border-transparent  px-4 py-3.5 text-white transition-colors text-[15px]">
                    <span className="truncate max-w-[200px] text-gray-400">
                      {avatarFile ? avatarFile.name : (avatarUrl ? "Update picture..." : "Select picture...")}
                    </span>
                    <UploadCloud size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>

              {!isGithub && (
                <div className="flex flex-col gap-1.5">
                  <label className="block text-[13px] font-bold text-white ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-[#2A2A2C] border border-transparent  pl-4 pr-12 py-3.5 text-white focus:outline-none focus:border-red-500/50 transition-colors text-[15px] font-mono tracking-wider"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 pb-2 w-full shrink-0">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white  py-4 font-bold tracking-wide transition-all active:scale-95 text-[15px] shadow-lg shadow-red-900/20 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Complete"}
              </button>
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}