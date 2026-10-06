# AEGIS brand assets

Prepared from the user-provided brand sheet using the built-in image_gen tool, with a second pass for edge/background cleanup. These are raster exports, not the original font or editable vector master. Transparent PNG copies are kept for reuse; WebP files serve the website. PNG favicon variants preserve alpha.

Files in `public/images/brand/`:
- `aegis-lockup.png` / `.webp`: navbar, footer, boot and About loading.
- `aegis-symbol.png` / `.webp`: standalone symbol.
- `favicon-32.png`, `icon-192.png`, `apple-touch-icon.png`: browser / touch icons.

## Prompts

### aegis-lockup

Use case: background-extraction. Extract ONLY the complete primary logo lockup in the upper-left of the provided AEGIS brand sheet: the silver angular A symbol with cyan inverted-triangle protected core, followed by the EXACT stylized silver AEGiS lettering with cyan square dot above the i and the small spaced UAV SYSTEMS subtitle below. This is a faithful asset extraction, not a logo redesign. Preserve the exact letterforms, geometry, alignment, colors, metallic gradients, proportions and details of that upper-left lockup. Remove the dark background, guide lines, PRIMARY LOCKUP caption, all other panels, diagrams and mockups. Return a single horizontal logo lockup on genuinely transparent alpha with modest tight transparent padding. No added text, border, drop shadow, glow outside the original symbol, or changed spelling. Preserve full subtitle legibility.

### aegis-symbol

Use case: background-extraction. Extract ONLY the standalone AEGIS symbol from the top-right ICON (STANDALONE) panel of the provided brand sheet: the silver angular open A/chevron with central black cut-through transparent opening, a thin split at the top, and the cyan inverted-triangle core below center. Faithful exact asset extraction, not redesign. Preserve geometry, metallic silver gradients, original cyan color and proportions. Remove the dark background, circular guides, grid lines, ICON caption, all lettering and all other panels. Return one centered standalone symbol on genuinely transparent alpha with tight modest padding. Do not include an app-icon rounded square, extra letters, rectangular background, border or new shadow. All empty space inside and outside the symbol must be transparent.

### aegis-lockup-clean

Precisely clean this supplied transparent AEGIS logo asset for production use. Keep the SAME symbol silhouette, all SAME AEGiS letterforms, cyan i dot, horizontal layout, positions, proportions and exact UAV SYSTEMS subtitle. Remove ALL white ragged fringes, stray speckles, noise, fragmented borders, bevel rims and outlines. Use smooth crisp antialiased edges. Silver areas should have clean subtle flat metallic white-to-light-gray gradients, NOT embossed chrome or 3D outlines. Subtitle should be clean slender spaced silver lettering, no bevels. Cyan core and dot clean cyan with subtle restrained shading. All background and internal negative space MUST be true transparent alpha. No glow, shadow or opaque pixels outside the artwork. Single clean horizontal lockup, tightly framed with small margin. This is edge cleanup of existing artwork, no new design or font changes.

### aegis-symbol-clean

Clean this exact supplied AEGIS standalone symbol for a production website favicon. Preserve the exact outer angular open-A silhouette and split top, and cyan inverted triangular core. Remove all external gray glow, halo, shadow, black backdrop and edge outlines. All negative space inside and around the symbol must be genuine transparent alpha with no mist. Silver wings have clean very subtle flat white/light gray metallic gradients, not embossed rims. Cyan triangular core has restrained simple shading, no bright outline or specular ridge. Crisp smoothly antialiased edges, no noise or speckles. Fit entire symbol centered with modest tight transparent padding. No lettering, no rounded box, no other objects.

