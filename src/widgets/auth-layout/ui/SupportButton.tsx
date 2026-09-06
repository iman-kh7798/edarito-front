import { cn } from "@/shared/lib";
import { HeadsetIcon } from "@/shared/ui/icon";

type Props = {
  /** When provided the control renders as a link, otherwise as a button. */
  href?: string;
  onClick?: () => void;
  className?: string;
};

const classes =
  "inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-[22px] text-white shadow-fab transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

export const SupportButton = ({ href, onClick, className }: Props) => {
  if (href) {
    return (
      <a
        href={href}
        aria-label="پشتیبانی"
        className={cn(classes, className)}
        target="_blank"
        rel="noreferrer"
      >
        <HeadsetIcon />
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label="پشتیبانی"
      onClick={onClick}
      className={cn(classes, className)}
    >
      <HeadsetIcon />
    </button>
  );
};
