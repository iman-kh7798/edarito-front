import { useState } from "react";

import { LoginForm } from "@/features/auth/login";
import { PasswordRecoveryForm } from "@/features/auth/password-recovery";
import { AuthLayout } from "@/widgets/auth-layout";

type Mode = "login" | "recovery";

export const Login = () => {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <AuthLayout>
      {mode === "login" ? (
        <LoginForm onForgotPassword={() => setMode("recovery")} />
      ) : (
        <PasswordRecoveryForm
          onBack={() => setMode("login")}
          onDone={() => setMode("login")}
        />
      )}
    </AuthLayout>
  );
};
