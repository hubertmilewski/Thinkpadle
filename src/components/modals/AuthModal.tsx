"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GithubIcon, UploadCloud, Eye, EyeOff } from "lucide-react";
import { siteContent } from "@/data/content";
import { supabase } from "@/lib/supabase";
import { signInWithGithub, uploadAvatar } from "@/lib/auth-helpers";
import { TRANSITION_SETTINGS, MOBILE_DRAWER_VARIANTS, DESKTOP_MODAL_VARIANTS } from "@/lib/animations";

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 640;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorObj, setErrorObj] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nickname, setNickname] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setEmail("");
      setPassword("");
      setNickname("");
      setAvatarFile(null);
      setErrorObj(null);
      setSuccessMsg(null);
      setActiveTab("login");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const authStrings = (siteContent as { auth: {
    tabs: { login: string; register: string };
    nicknameLabel: string;
    nicknamePlaceholder: string;
    avatarLabel: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    loginSubmit: string;
    registerSubmit: string;
    githubButton: string;
    orDivider: string;
    errors: { missingNickname: string; general: string };
  } }).auth;
  if (!authStrings) return null;

  const handleGitHub = async () => {
    setIsLoading(true);
    await signInWithGithub();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorObj(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        onClose();
      } else {
        if (!nickname) {
          throw new Error(authStrings.errors.missingNickname || "Nickname required");
        }

        // Set flag to prevent AuthProvider reload during the multi-step registration
        if (typeof window !== "undefined") (window as any).__SKIP_AUTH_RELOAD = true;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nickname: nickname,
              avatar_url: "",
            },
          },
        });

        if (error) {
          if (typeof window !== "undefined") (window as any).__SKIP_AUTH_RELOAD = false;
          throw error;
        }

        // If email confirmation is disabled, user gets a session immediately.
        // We can safely upload the avatar now because they are authenticated.
        if (data.session && data.user && avatarFile) {
           const uploadedUrl = await uploadAvatar(avatarFile, data.user.id);
           if (uploadedUrl) {
             await supabase.auth.updateUser({
               data: { avatar_url: uploadedUrl }
             });
           }
        } 
        
        // If email confirmation is enabled, data.session is null.
        // We cannot upload the avatar because of RLS (Anonymous user cannot upload).
        // It will have to be set in Settings later.

        // The user explicitly requested to show a login prompt instead of auto-logging in/refreshing.
        if (data.session) {
          await supabase.auth.signOut();
        }

        if (typeof window !== "undefined") {
          (window as any).__SKIP_AUTH_RELOAD = false;
        }

        setActiveTab("login");
        setSuccessMsg("Account created successfully. You can now log in.");
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorObj(err instanceof Error ? err.message : authStrings.errors.general);
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
            className="relative w-full h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto sm:max-w-md bg-tp-card border-0 sm:border-2 border-gray-800 p-6 sm:p-8 shadow-2xl flex flex-col no-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-500 hover:text-white transition-colors z-210"
            >
              <X size={isMobile() ? 28 : 24} />
            </button>

            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-6 text-center mt-4">
              THINKPADLE AUTH
            </h2>

            <button
              type="button"
              onClick={handleGitHub}
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-200 py-3 px-4 font-bold uppercase transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <GithubIcon size={20} />
              {authStrings.githubButton}
            </button>

            <div className="flex items-center gap-4 my-6 opacity-30">
              <div className="flex-1 h-px bg-white"></div>
              <span className="text-xs font-bold uppercase">{authStrings.orDivider}</span>
              <div className="flex-1 h-px bg-white"></div>
            </div>

            <div className="flex w-full mb-8 bg-[#1C1C1E] border border-gray-800 p-1  gap-1">
              <button
                className={`flex-1 py-3 text-[13px] font-black tracking-widest uppercase transition-all ${
                  activeTab === "login" ? "bg-red-600 text-white shadow-md " : "text-gray-500 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("login")}
              >
                {authStrings.tabs.login}
              </button>
              <button
                className={`flex-1 py-3 text-[13px] font-black tracking-widest uppercase transition-all ${
                  activeTab === "register" ? "bg-red-600 text-white shadow-md " : "text-gray-500 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("register")}
              >
                {authStrings.tabs.register}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {activeTab === "register" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      {authStrings.nicknameLabel}
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                      placeholder={authStrings.nicknamePlaceholder}
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      {authStrings.avatarLabel} (Optional)
                    </label>
                    <div
                      className="w-full border border-dashed border-gray-800 bg-black p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-500 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {avatarFile ? (
                        <div className="text-sm font-bold text-red-500 truncate max-w-full">
                          {avatarFile.name}
                        </div>
                      ) : (
                        <>
                          <UploadCloud size={20} className="text-gray-500" />
                          <span className="text-xs font-bold text-gray-500 uppercase">Click to browse file</span>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  {authStrings.emailLabel}
                </label>
                <input
                  required
                  type="email"
                  className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                  placeholder={authStrings.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  {authStrings.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-black border border-gray-800 pl-4 pr-12 py-3 text-white focus:outline-none focus:border-red-600 transition-colors tracking-wider"
                    placeholder={authStrings.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {errorObj && (
                <div className="text-red-500 text-xs font-bold uppercase mt-2 text-center">
                  {errorObj}
                </div>
              )}

              {successMsg && activeTab === "login" && (
                <div className="text-green-500 text-xs font-bold uppercase mt-2 text-center">
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-black uppercase tracking-widest transition-all active:scale-95 text-base sm:text-lg mt-2 disabled:opacity-50"
              >
                {isLoading
                  ? "Processing..."
                  : activeTab === "login"
                    ? authStrings.loginSubmit
                    : authStrings.registerSubmit}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
