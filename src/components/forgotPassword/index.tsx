import { useState } from "react";
import EmailVerification from "./sections/emailVerification";
import PasswordChange from "./sections/passwordChange";
import type { User } from "@/api/users";

const enum ForgotPasswordStep {
  EmailVerification = "emailVerification",
  PasswordChange = "passwordChange",
}

const ForgotPassword = () => {
  const [step, setStep] = useState<ForgotPasswordStep>(
    ForgotPasswordStep.EmailVerification
  );

  const [user, setUser] = useState<User | null>(null);

  return (
    <div className="flex w-screen h-screen">
      <div className="w-1/2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
        <h1 className="text-white text-5xl font-bold text-center leading-tight tracking-tight">
          A Place
          <br />
          for the Youth
        </h1>
      </div>

      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-[400px] max-w-full">
          {step === ForgotPasswordStep.EmailVerification && (
            <EmailVerification
              onFoundUser={(u: User) => {
                setUser(u);
                setStep(ForgotPasswordStep.PasswordChange);
              }}
            />
          )}

          {step === ForgotPasswordStep.PasswordChange && user && (
            <PasswordChange
              user={user}
              onSuccess={() => setStep(ForgotPasswordStep.EmailVerification)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
