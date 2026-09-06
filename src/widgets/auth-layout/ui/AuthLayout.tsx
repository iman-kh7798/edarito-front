import { type ReactNode } from "react";

import { KavanoLogo } from "@/shared/ui/logo";

import { AuthFooter } from "./AuthFooter";
import { SupportButton } from "./SupportButton";

type Props = {
  children: ReactNode;
  /** Show the floating support button (default true). */
  showSupport?: boolean;
  /** Optional support link; without it the button is a no-op placeholder. */
  supportHref?: string;
};

/**
 * Shell for every auth screen: a white side panel, the brand gradient stage with
 * the Kavano mark and a centred content slot, the footer, and the support FAB.
 */
export const AuthLayout = ({
  children,
  showSupport = true,
  supportHref,
}: Props) => (
  <div className="relative flex min-h-dvh w-full font-sans" dir="rtl">
    <aside
      aria-hidden="true"
      className="hidden shrink-0 bg-white lg:block lg:w-[clamp(180px,14vw,320px)]"
    />

    <main className="auth-gradient relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div className="flex w-full max-w-[26rem] flex-col items-center gap-12">
        <KavanoLogo
          title="کاوانو"
          className="h-auto w-[68px] text-on-gradient"
        />
        <div className="w-full">{children}</div>
      </div>

      <AuthFooter className="absolute inset-x-0 bottom-6" />
    </main>

    {showSupport && (
      <SupportButton
        href={supportHref}
        className="fixed bottom-6 left-6 z-50"
      />
    )}
  </div>
);
