export const hardware = {
  fc: { name: 'AEGIS FC', role: 'Flight control', status: 'WORKING PROTOTYPE', product: '/products/fc', docs: '/docs/fc', configurator: '/configurator/fc', description: 'Custom flight controller hardware with an AEGIS-specific PX4 firmware workflow.' },
  controller: { name: 'AEGIS Controller', role: 'Operator control', status: 'WORKING PROTOTYPE', product: '/products/controller', docs: '/docs/controller', configurator: '/configurator/controller', description: 'An ESP32-based handheld controller project connecting operator inputs, radio control, and BLE simulator use.' },
} as const
