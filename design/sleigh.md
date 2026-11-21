# Sleigh artwork

The shipped asset is `extension/media/images/sleigh.png`, a 1536 × 1024 PNG
with transparency. It derives from the Prodockit sleigh illustration.

Mode: built-in image generation tool, reference-image editing, transparent
background requested. Two edits were made on 21 November 2026: first replace
the presents with a pile of sturdy brown, olive and grey walking boots; then
add red and gold bows to the boots. The final PNG is copied directly from the
generated output, without repainting or removing its alpha channel.

## Final editing prompt

Use case: precise-object-edit. Edit the supplied sleigh image. Add visible
festive ribbon bows to the walking boots piled behind Father Christmas, so
the boots look like Christmas presents. Use tasteful red and gold ribbon bows
tied near the ankles or laces of the visible boots; keep each boot clearly
recognisable as a sturdy hiking/walking boot with chunky soles. Change ONLY
the addition of bows. Preserve the walking boots' arrangement, Father Christmas,
his face, pose and clothing, red-and-gold sleigh, runners, lantern, reins, green
cushion, blank cream destination plaque, exact composition, framing, lighting
and detailed illustration style. No gift boxes. Do not add lettering or logos.
Preserve genuine transparent alpha outside the cutout, including the gaps
between runners and sleigh; no opaque background. Keep the 1536-by-1024 canvas
and same object placement so this remains a drop-in sprite for the website.

## Use in the extension

The runtime adds the current Christmas destination to the blank plaque. The
image was checked against the Alton Ramblers local website copy. Retain the
canvas size and plaque placement when replacing it.
