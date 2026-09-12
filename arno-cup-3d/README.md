# ARNO iced-coffee cup

A real, rotatable glTF 2.0 model reconstructed from your supplied photograph.

Updated to follow the reference photograph: a creamy milk base blending into warm caramel coffee, uneven dark espresso ribbons beneath the rim, submerged ice, and a liquid surface just below the lid. The preview uses warm light from the right to reproduce the shaded left side.

## Files

- `arno-cup.glb` — the model, with embedded textures and separate named parts.
- `arno-cup-viewer.html` — an offline 360° preview. Open in a browser, then drag to rotate or scroll to zoom. It includes a model download button.
- `arno-cup-preview.png` — a rendering of the exported model.
- `ArnoCup.tsx` — a React Three Fiber loader for your existing cup rig.
- `ArnoStudioLighting.tsx` — the matching studio environment and lighting for your existing Canvas.
- `build-cup.mjs` — editable procedural geometry and texture source, built with Three.js 0.186.0.
- `reference.png` — your original reference photograph.

## Use in your existing hero

1. Copy `arno-cup.glb` to `public/models/arno-cup.glb`.
2. Copy `ArnoCup.tsx` and `ArnoStudioLighting.tsx` into your hero components directory.
3. Inside your existing `<group ref={spin}>`, replace the old assembly with:

```tsx
<ArnoCup spinDelta={spinDelta} height={3.6} motion={!reducedMotion} />
```

Import `ArnoCup` from the new component. `spinDelta` and `reducedMotion` above refer to your existing rotation-delta ref and reduced-motion boolean; use your project's variable names. Keep your existing Canvas, Suspense boundary, pointer handlers, and GSAP scroll rig. The component does not introduce another canvas or scroll trigger. Adjust `height` to match your existing composition; it includes the full straw.

To match the supplied preview's shading, replace the environment and lights inside your existing Canvas with:

```tsx
import ArnoStudioLighting from './ArnoStudioLighting';

// Inside Canvas, outside the rotating cup group:
<ArnoStudioLighting sceneScale={3.6 / 0.22095} />
```

Use the same cup height in both expressions. With the raw GLB at its original scale, use `sceneScale={1}`. Mount the lighting once, in place of the existing studio environment and lights. Enable shadows on your Canvas and provide a ground mesh with `receiveShadow` if you want the cast shadow. Your hero's Bloom or other color effects can change the final appearance; the supplied preview uses ACES tone mapping with no Bloom.

The coffee gradient is embedded in the model. The directional highlights and shadows come from the scene lights, so using different lighting will produce different shading. The lighting helper also sets the preview's exposure and restores the previous environment and tone mapping on unmount.

The React components are integration helpers. They were transpiled, but have not been run in your website repository, which was not available here. The model itself is checked separately in the supplied viewer.

## Model conventions

- +Y up; branding faces +Z.
- The asset is approximately centered vertically.
- Nominal physical height: about 22 cm including the straw. Dimensions are inferred from the photo, not measured.
- Named parts include `Cup_Shell`, `Latte_Contents`, `ARNO_Print`, `Lid`, `Straw`, `Ice`, and `Condensation`.
- The GLB contains the cup only. Lighting, background, floor, and shadows belong to the preview scene.
- Scroll, drag, and hover remain controlled by your parent rig. There are no baked animation clips. The React helper provides small optional ice movements driven by `spinDelta`.

## Appearance

The front branding is isolated from the photograph and approximately unwrapped onto the tapered surface. The milk and coffee map is procedurally reconstructed around the full circumference. The reverse side is inferred and unbranded because only one view was supplied. These are visual approximations, not a photogrammetry scan or a factory CAD model.

Use a lit environment with the model. Materials use the glTF transmission, volume, IOR, and clearcoat extensions. The lid and straw use alpha blending so nested parts remain visible in conventional viewers. Material appearance depends on the renderer and scene lighting. The preview uses a locally generated studio environment with no external HDRI requests.

## Verification

This update contains 21 meshes and 87,764 triangles and is approximately 3.5 MB. The GLB is validated before delivery, and the exported model is reloaded in the offline viewer for the supplied render. The viewer's drag, side/back controls, and model download are checked against this version. All model textures are embedded, and the viewer makes no external network requests. Both React helpers transpile successfully; integration in your actual website remains to be performed.

Three.js documentation: [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html), [GLTFExporter](https://threejs.org/docs/pages/GLTFExporter.html).

The included offline viewer bundles Three.js under its MIT license; see `THREE-LICENSE.txt`. The ARNO artwork comes from the supplied user reference.
