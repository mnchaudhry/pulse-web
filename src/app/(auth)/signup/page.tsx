import { BrandPanel } from '@/features/auth/components/brand-panel'
import { SignupForm } from '@/features/auth/signup-form'

const SIGNUP_STEPS = [
  { n: '1', title: 'Create your account', desc: 'Email or Google — nothing else required.' },
  { n: '2', title: 'Add the Chrome extension', desc: 'A one-time consent screen shows exactly what is captured.' },
  { n: '3', title: 'Watch your day take shape', desc: 'Aggregates and insights appear within minutes.' },
]

const SignupPage = () => {
  return (
    <div className="flex min-h-screen">
      <BrandPanel
        headline="Start seeing your attention clearly."
        description="Two minutes to set up. Private from the first second — nothing is tracked until you say so."
      >
        <div className="flex max-w-[400px] flex-col gap-3.5">
          {SIGNUP_STEPS.map(step => (
            <div key={step.n} className="flex items-start gap-3.5">
              <div className="mono flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] border border-white/[.22] bg-white/[.14] text-[13px] font-bold">
                {step.n}
              </div>
              <div>
                <div className="mb-0.5 text-[14.5px] font-semibold">{step.title}</div>
                <div className="text-[12.5px] leading-[1.5] text-white/[.72]">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </BrandPanel>
      <div className="flex flex-1 items-center justify-center bg-base p-12">
        <SignupForm />
      </div>
    </div>
  )
}

export default SignupPage
