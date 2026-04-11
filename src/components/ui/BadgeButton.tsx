import React from "react";
import Link from "next/link";

interface BadgeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string | null;
  bgClass?: string;
  textClass?: string;
  borderClass?: string;
  hoverClass?: string;
  paddingClass?: string;
  href?: string;
}

export function BadgeButton({
  icon,
  label,
  bgClass = "bg-gray-900",
  textClass = "text-gray-300",
  borderClass = "border-gray-800",
  hoverClass = "hover:bg-gray-800 hover:border-gray-600",
  paddingClass = "sm:pr-3 pr-1 py-1",
  className = "",
  href,
  ...props
}: BadgeButtonProps) {
  const content = (
    <>
      <div className="flex items-center justify-center shrink-0">
        {icon}
      </div>
      {label && (
        <span className={`hidden sm:block text-[10px] sm:text-xs font-bold uppercase tracking-tight ${textClass}`}>
          {label}
        </span>
      )}
    </>
  );

  const classes = `group flex items-center gap-1 ${bgClass} border ${borderClass} ${paddingClass} ${hoverClass} transition-colors cursor-pointer ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={classes}
    >
      {content}
    </button>
  );
}
