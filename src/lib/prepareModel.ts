import { Box3, Group, Mesh, Vector3, type BufferGeometry, type Material } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

// Build an independent centered instance; only owned buffers are disposable.
export function prepareModel(scene: Group, batch = false) {
    let clone = scene.clone(true)
    const owned: BufferGeometry[] = []
    // The CAD FC contains thousands of static mesh primitives. Batch them by
    // material in world space while preserving its exact shapes and materials.
    // These new buffers belong to About; never dispose cached GLTF resources.
    if (batch) {
      clone.updateMatrixWorld(true)
      const batches = new Map<string, { material: Material; geometries: BufferGeometry[] }>()
      clone.traverse(node => {
        if (!(node instanceof Mesh) || Array.isArray(node.material)) return
        const geometry = node.geometry.clone().applyMatrix4(node.matrixWorld)
        const key = `${node.material.uuid}:${Object.keys(geometry.attributes).sort().join(',')}:${!!geometry.index}`
        const batch: { material: Material; geometries: BufferGeometry[] } = batches.get(key) ?? { material: node.material, geometries: [] }
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
    return { scene: clone, scale: 1 / Math.max(size.x, size.y, size.z, .001), owned }
}
