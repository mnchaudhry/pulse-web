import { ProductPreview } from '@/features/auth/login-form/components/product-preview'
import { BrandPanel } from '@/features/auth/components/brand-panel'
import { LoginForm } from '@/features/auth/login-form'

const LoginPage = () => {
  return (
    <div className="flex min-h-screen">
      <BrandPanel
        headline="Know where your attention actually goes."
        description="Private, honest browsing analytics. A quiet mirror for your day — never a scoreboard, never a nudge."
      >
        <ProductPreview />
      </BrandPanel>
      <div className="flex flex-1 items-center justify-center bg-base p-12">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
