"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StepProgress } from "@/components/onboarding/stepProgress";
import { StepWrapper } from "@/components/onboarding/stepWrapper";
import { useAuth } from "@/contexts/auth-context";
import { enterpriseService } from "@/lib/api/enterprise-service";
import CompanyForm from "../../components/onboarding/steps/CompanyForm";
import CompanyIntro from "../../components/onboarding/steps/CompanyIntro";
import DocumentsIntro from "../../components/onboarding/steps/DocumentsIntro";
import DocumentsUpload from "../../components/onboarding/steps/DocumentsUpload";
import EndScreen from "../../components/onboarding/steps/EndScreen";
import Intro from "../../components/onboarding/steps/Intro";
import Welcome from "../../components/onboarding/steps/Welcome";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function defineInitialStep() {
      if (!user) return;

      if (user.approved) {
        router.push("/seller/enterprise");
      }

      try {
        const response = await enterpriseService.get();
        let nextStep = 1;

        if (!response.success || !response.data) {
          nextStep = 1;
        } else {
          const enterprise = Array.isArray(response.data)
            ? response.data.find((e) => e.userId === user.id)
            : response.data;

          if (enterprise?.documents && enterprise.documents.length === 0) {
            nextStep = 5;
          }

          if (enterprise?.documents && enterprise.documents.length > 0) {
            nextStep = 7;
          }
        }

        setStep(nextStep);
      } catch (error) {
        console.error("Erro ao definir step inicial:", error);
        setStep(1);
      } finally {
        setLoading(false);
      }
    }

    defineInitialStep();
  }, [user, router.push]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="absolute top-0 left-0 w-full z-50">
        <StepProgress currentStep={step} totalSteps={7} />
      </div>

      <div className="flex-1">
        <StepWrapper step={step}>
          {step === 1 && <Welcome onNext={() => setStep(2)} />}
          {step === 2 && <Intro onPrev={() => setStep(1)} onNext={() => setStep(3)} />}
          {step === 3 && <CompanyIntro onPrev={() => setStep(2)} onNext={() => setStep(4)} />}
          {step === 4 && <CompanyForm onPrev={() => setStep(3)} onNext={() => setStep(5)} />}
          {step === 5 && <DocumentsIntro onNext={() => setStep(6)} />}
          {step === 6 && <DocumentsUpload onPrev={() => setStep(5)} onNext={() => setStep(7)} />}
          {step === 7 && <EndScreen />}
        </StepWrapper>
      </div>
    </div>
  );
}
