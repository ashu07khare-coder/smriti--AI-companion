import React from 'react';
import { Check } from 'lucide-react';
import { AuthUiStrings } from '../../utils/authLocalization';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
  completedSteps: number[];
  ui: AuthUiStrings;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  totalSteps = 4,
  onStepClick,
  completedSteps,
  ui,
}) => {
  const steps = [
    {
      num: 1,
      title: ui.steps.step1Title,
      desc: ui.steps.step1Desc,
    },
    {
      num: 2,
      title: ui.steps.step2Title,
      desc: ui.steps.step2Desc,
    },
    {
      num: 3,
      title: ui.steps.step3Title,
      desc: ui.steps.step3Desc,
    },
    {
      num: 4,
      title: ui.steps.step4Title,
      desc: ui.steps.step4Desc,
    },
  ];

  return (
    <div className="w-full pb-4 pt-2">
      {/* Mobile concise progress bar */}
      <div className="flex sm:hidden flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#173C36]">
          <span>{steps[currentStep - 1]?.title}</span>
          <span className="text-[#173C36]/70 font-semibold text-[11px]">
            {ui.common.stepCount(currentStep, totalSteps)}
          </span>
        </div>
        {/* Progress track */}
        <div className="w-full h-2 bg-[#173C36]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2F9E76] via-[#173C36] to-[#F5C244] transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop & Tablet expanded 4-step stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Continuous connector line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#173C36]/15 -z-0">
          <div
            className="h-full bg-[#2F9E76] transition-all duration-500"
            style={{
              width: `${((Math.max(1, currentStep) - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.num);
          const isCurrent = currentStep === step.num;
          const isAccessible = isCompleted || isCurrent;

          return (
            <button
              type="button"
              key={step.num}
              disabled={!isAccessible && !onStepClick}
              onClick={() => isAccessible && onStepClick?.(step.num)}
              className={`flex flex-col items-center group relative z-10 focus:outline-hidden transition-all ${
                isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              {/* Circle Badge */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-xs ${
                  isCurrent
                    ? 'bg-[#173C36] text-[#F5C244] ring-4 ring-[#F5C244]/40 scale-110'
                    : isCompleted
                    ? 'bg-[#2F9E76] text-white'
                    : 'bg-[#FFFDF6] text-[#173C36]/60 border-2 border-[#173C36]/20'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>{step.num}</span>
                )}
              </div>

              {/* Title & Short Label */}
              <div className="text-center mt-1.5 max-w-[100px]">
                <p
                  className={`text-[11px] font-bold leading-tight transition-colors ${
                    isCurrent
                      ? 'text-[#173C36]'
                      : isCompleted
                      ? 'text-[#2F9E76]'
                      : 'text-[#173C36]/50'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
