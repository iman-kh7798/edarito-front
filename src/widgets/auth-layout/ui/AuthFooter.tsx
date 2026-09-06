import { cn } from "@/shared/lib";
import { KavanoLogo, PartnerLogos } from "@/shared/ui/logo";

export const AuthFooter = ({ className }: { className?: string }) => (
  <footer
    className={cn(
      "flex flex-col items-center gap-4 text-on-gradient",
      className
    )}
  >
    <PartnerLogos className="opacity-30" />
    <div className="flex items-center gap-2 text-[11px] text-on-gradient-muted">
      <KavanoLogo className="w-4" />
      <span dir="ltr">Copyrighted by kavano.co 2024</span>
    </div>
  </footer>
);
