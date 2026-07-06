import { Suspense } from 'react'
import { BotChat } from '@/features/bot-chat'

const BotPage = () => {
  return (
    <Suspense>
      <BotChat />
    </Suspense>
  )
}

export default BotPage
