// Plain module-scoped state (not sessionStorage) — this lives only in memory
// for the current JS bundle. A real browser reload re-initializes the whole
// module, so the splash plays again. Client-side navigation within the app
// (clicking between pages, coming back to "/") keeps this module alive, so
// the splash does NOT replay just from clicking Home again.
export const splashState = { shown: false };
