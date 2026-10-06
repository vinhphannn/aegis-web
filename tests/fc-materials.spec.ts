import { readFile } from 'node:fs/promises'
import { test, expect } from '@playwright/test'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Mesh } from 'three'
import { prepareModel } from '../src/lib/prepareModel'

test('FC ink and mask are opaque without changing cached source materials', async () => {
  const bytes = await readFile('public/models/aegis-fc.glb')
  const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  const original: { name: string; transparent: boolean; opacity: number }[] = []
  gltf.scene.traverse(node => { if (node instanceof Mesh && !Array.isArray(node.material)) original.push({ name: node.material.name, transparent: node.material.transparent, opacity: node.material.opacity }) })
  const model = prepareModel(gltf.scene, true)
  for (const name of ['mat_23', 'mat_24', 'mat_25', 'mat_26', 'mat_27']) {
    const material = model.ownedMaterials.find(material => material.name === name)!
    expect(material).toBeDefined()
    expect(material.transparent).toBe(false)
    expect(material.opacity).toBe(1)
    expect(material.depthTest).toBe(true)
    if (name === 'mat_23' || name === 'mat_24') expect(material.polygonOffset).toBe(true)
  }
  const after: typeof original = []
  gltf.scene.traverse(node => { if (node instanceof Mesh && !Array.isArray(node.material)) after.push({ name: node.material.name, transparent: node.material.transparent, opacity: node.material.opacity }) })
  expect(after).toEqual(original)
  model.owned.forEach(geometry => geometry.dispose())
  model.ownedMaterials.forEach(material => material.dispose())
})
