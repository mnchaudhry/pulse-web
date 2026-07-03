import { PageContainer } from '@/components/page-container'
import { DeviceRow } from './components/device-row'
import { devices } from './device.data'

export const DeviceManager = () => {
  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-[-.4px]">Devices</h1>
        <p className="mt-1.5 text-[13.5px] text-ink-2">
          Every Chrome profile and machine reporting to your account. Removing one stops it contributing new data.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {devices.map(device => (
          <DeviceRow key={device.id} device={device} />
        ))}
      </div>

      <p className="mt-5 text-xs text-ink-3">
        Reinstalling the extension on a profile registers a fresh device — old and new aren’t merged.
      </p>
    </PageContainer>
  )
}
