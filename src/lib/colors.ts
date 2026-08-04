const SWATCHES: Record<string, string> = {
  negro: "#161616",
  blanco: "#f5f5f5",
  gris: "#8a8a8a",
  "gris claro": "#c7c7c7",
  verde: "#2f8f4e",
  "verde militar": "#5a6b45",
  "verde oliva": "#6b7a4a",
  azul: "#2f5d9e",
  marino: "#1c2b4a",
  rojo: "#c23b3b",
  bordo: "#7a2b2b",
  rosa: "#d98bb0",
  amarillo: "#d9c23b",
  naranja: "#d97b2b",
  violeta: "#7a5bb0",
  marron: "#6b4a30",
  beige: "#cbb896",
  celeste: "#7fb8d9",
  dorado: "#b89a4a",
};

export function swatchColor(colorName?: string | null): string {
  if (!colorName) return "#555555";
  const key = colorName.trim().toLowerCase();
  if (SWATCHES[key]) return SWATCHES[key];

  const firstWord = key.split(/[\s/]+/)[0];
  if (SWATCHES[firstWord]) return SWATCHES[firstWord];

  for (const [name, hex] of Object.entries(SWATCHES)) {
    if (key.includes(name)) return hex;
  }

  return "#555555";
}
