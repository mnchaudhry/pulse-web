// Static design-mock devices (US-09..12). Every Chrome profile/machine reporting
// to the account. Swapped for services/devices/list-devices once wired.
export interface Device {
  id: string
  name: string
  platform: string
  synced: string
  online: boolean
  active: string
  excl: string
  current: boolean
}

export const devices: Device[] = [
  {
    id: 'd1',
    name: 'MacBook Pro — Personal',
    platform: 'macOS · Chrome 126',
    synced: 'synced 40s ago',
    online: true,
    active: '6h 12m today',
    excl: '3 exclusions',
    current: true,
  },
  {
    id: 'd2',
    name: 'MacBook Pro — Work',
    platform: 'macOS · Chrome 126',
    synced: 'synced 2m ago',
    online: true,
    active: '4h 48m today',
    excl: '5 exclusions',
    current: false,
  },
  {
    id: 'd3',
    name: 'Linux desktop',
    platform: 'Ubuntu · Chrome 125',
    synced: 'synced 3d ago',
    online: false,
    active: '0m today',
    excl: '3 exclusions',
    current: false,
  },
]
