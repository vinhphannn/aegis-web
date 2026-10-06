import { Box3, Group, Mesh, MeshStandardMaterial, Vector3, type BufferGeometry, type Material } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

// Build an independent centered instance; only owned buffers are disposable.
export function prepareModel(scene: Group, batch = false) {
    let clone = scene.clone(true)
    const owned: BufferGeometry[] = []
    const ownedMaterials: Material[] = []
    // The CAD FC contains thousands of static mesh primitives. Batch them by
    // material in world space while preserving its exact shapes and materials.
    // These new buffers belong to About; never dispose cached GLTF resources.
    if (batch) {
      clone.updateMatrixWorld(true)
      const materials = new Map<string, Material>()
      const batches = new Map<string, { material: Material; geometries: BufferGeometry[] }>()
      clone.traverse(node => {
        if (!(node instanceof Mesh) || Array.isArray(node.material)) return
        let layer = ''
        for (let part = node as import('three').Object3D | null; part; part = part.parent) {
          if (/silkscreen/i.test(part.name)) { layer = 'silkscreen'; break }
          if (/soldermask/i.test(part.name)) { layer = 'soldermask'; break }
          if (/_PCB/i.test(part.name)) { layer = 'pcb'; break }
        }
        // This CAD export gives its single-primitive mask nodes generated
        // names, so identify those two bundled layers by their material names.
        if (!layer && ['mat_25', 'mat_26'].includes(node.material.name)) layer = 'soldermask'
        const materialKey = `${node.material.uuid}:${layer}`
        let material = materials.get(materialKey)
        if (!material) {
          material = (node.material as Material).clone()
          if (material instanceof MeshStandardMaterial) {
            // CAD glTF defaults unspecified materials to metal. PCB, plastic,
            // ink and mask are dielectrics; keep the original exported colors.
            material.metalness = 0
            material.roughness = .8
            if (layer) { material.transparent = false; material.opacity = 1; material.depthWrite = true }
            if (layer === 'silkscreen') {
              material.polygonOffset = true
              material.polygonOffsetFactor = -1
              material.polygonOffsetUnits = -1
            }
          }
          materials.set(materialKey, material)
          ownedMaterials.push(material)
        }
        const geometry = node.geometry.clone().applyMatrix4(node.matrixWorld)
        const key = `${material.uuid}:${Object.keys(geometry.attributes).sort().join(',')}:${!!geometry.index}`
        const batch: { material: Material; geometries: BufferGeometry[] } = batches.get(key) ?? { material, geometries: [] }
        batch.geometries.push(geometry)
        batches.set(key, batch)
      })
      const batched = new Group()
      for (const batch of batches.values()) {
        const merged = mergeGeometries(batch.geometries)
        if (merged) { owned.push(merged); batched.add(new Mesh(merged, batch.material)) }
        else { batch.geometries.forEach(geometry => { owned.push(geometry); batched.add(new Mesh(geometry, batch.material)) }) }
        if (merged) batch.geometries.forEach(geometry => geometry.dispose())
      }
      if (batched.children.length) clone = batched
    }
    const bounds = new Box3().setFromObject(clone)
    const size = bounds.getSize(new Vector3())
    const center = bounds.getCenter(new Vector3())
    clone.position.sub(center)
    return { scene: clone, scale: 1 / Math.max(size.x, size.y, size.z, .001), radius: size.length() / (2 * Math.max(size.x, size.y, size.z, .001)), owned, ownedMaterials }
}
