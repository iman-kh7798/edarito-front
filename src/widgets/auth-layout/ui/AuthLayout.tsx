import { type ReactNode } from "react";

import { KavanoLogo } from "@/shared/ui/logo";

import { AuthFooter } from "./AuthFooter";
import { SupportButton } from "./SupportButton";

type Props = {
  children: ReactNode;
};

/**
 * Shell for every auth screen: a white side panel, the brand gradient stage with
 * the Kavano mark and a centred content slot, the footer, and the support FAB.
 */
export const AuthLayout = ({ children }: Props) => (
  <div className="relative flex min-h-dvh w-full font-sans" dir="rtl">
    <main className="auth-gradient relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div className="flex w-full max-w-[26rem] flex-col items-center gap-12">
        <KavanoLogo
          title="کاوانو"
          className="h-auto w-[68px] text-on-gradient"
        />
        <div className="w-full">{children}</div>
      </div>

      <AuthFooter className="absolute inset-x-0 bottom-6" />
      {/* Physically left regardless of RTL, matching the legacy panel's fixed
          chat-widget corner. */}
      <SupportButton className="absolute bottom-6 left-6" />
    </main>
  </div>
);
