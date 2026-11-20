// Usage: node scripts/replace-cv-texture.mjs <texture.jpg>
// Swaps the CV image on the papers model (public/obj/kartki.glb).
import { readFile } from 'node:fs/promises'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
const path = 'public/obj/kartki.glb'
const doc = await io.read(path)
const material = doc.getRoot().listMaterials().find((m) => m.getName() === 'cv')
const texture = material.getBaseColorTexture()
texture.setImage(await readFile(process.argv[2])).setMimeType('image/jpeg').setName('cv')
await io.write(path, doc)
