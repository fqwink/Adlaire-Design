export type TokenCategory =
  | "color"
  | "typography"
  | "spacing"
  | "motion"
  | "layer"
  | "breakpoint"
  | "surface"
  | "status"
  | "effects";

export interface CssToken {
  readonly name: `--adlaire-${string}`;
  readonly value: string;
  readonly category: TokenCategory;
  readonly description: string;
}

export interface TokenFile {
  readonly path: string;
  readonly category: TokenCategory;
  readonly css: string;
}

export const TOKEN_FILES: readonly TokenFile[] = [
  { path: "Tokens/colors.css", category: "color", css: `/* Adlaire-Design color tokens */
:root {
  --adlaire-color-agws-blue-primary: #0066cc;
  --adlaire-color-agws-blue-secondary: #0055aa;
  --adlaire-color-agws-blue-accent: #004499;
  --adlaire-color-agws-green-primary: #00a968;
  --adlaire-color-agws-green-secondary: #58be89;
  --adlaire-color-agws-green-accent: #40aaef;
  --adlaire-color-primary: var(--adlaire-color-agws-blue-primary);
  --adlaire-color-secondary: var(--adlaire-color-agws-blue-secondary);
  --adlaire-color-accent: var(--adlaire-color-agws-blue-accent);
  --adlaire-color-surface: #f5f5f5;
  --adlaire-color-border: #e0e0e0;
  --adlaire-color-support: var(--adlaire-color-agws-green-primary);
}
` },
  { path: "Tokens/typography.css", category: "typography", css: `/* Adlaire-Design typography tokens */
:root {
  --adlaire-font-family-base: "Helvetica Neue", Helvetica, Arial, sans-serif;
  --adlaire-font-family-mono: "Courier New", Courier, monospace;
  --adlaire-font-size-xs: 0.75rem;
  --adlaire-font-size-sm: 0.875rem;
  --adlaire-font-size-md: 1rem;
  --adlaire-font-size-lg: 1.125rem;
  --adlaire-font-size-xl: 1.5rem;
  --adlaire-font-size-2xl: 2rem;
  --adlaire-line-height-tight: 1.25;
  --adlaire-line-height-base: 1.6;
  --adlaire-line-height-relaxed: 1.8;
  --adlaire-font-weight-normal: 400;
  --adlaire-font-weight-medium: 500;
  --adlaire-font-weight-semibold: 600;
  --adlaire-font-weight-bold: 700;
}
` },
  { path: "Tokens/spacing.css", category: "spacing", css: `/* Adlaire-Design spacing tokens */
:root {
  --adlaire-space-0: 0;
  --adlaire-space-1: 0.25rem;
  --adlaire-space-2: 0.5rem;
  --adlaire-space-3: 0.75rem;
  --adlaire-space-4: 1rem;
  --adlaire-space-5: 1.25rem;
  --adlaire-space-6: 1.5rem;
  --adlaire-space-8: 2rem;
  --adlaire-space-10: 2.5rem;
  --adlaire-space-12: 3rem;
}
` },
  { path: "Tokens/motion.css", category: "motion", css: `/* Adlaire-Design motion tokens */
:root {
  --adlaire-motion-duration-fast: 120ms;
  --adlaire-motion-duration-base: 180ms;
  --adlaire-motion-duration-slow: 260ms;
  --adlaire-motion-ease-standard: ease;
  --adlaire-motion-ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --adlaire-motion-transition-fast: var(--adlaire-motion-duration-fast) var(--adlaire-motion-ease-standard);
  --adlaire-motion-transition-base: var(--adlaire-motion-duration-base) var(--adlaire-motion-ease-standard);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --adlaire-motion-duration-fast: 1ms;
    --adlaire-motion-duration-base: 1ms;
    --adlaire-motion-duration-slow: 1ms;
  }
}
` },
  { path: "Tokens/layer.css", category: "layer", css: `/* Adlaire-Design layer tokens */
:root {
  --adlaire-layer-base: 0;
  --adlaire-layer-raised: 10;
  --adlaire-layer-sticky: 100;
  --adlaire-layer-dropdown: 200;
  --adlaire-layer-overlay: 400;
  --adlaire-layer-modal: 500;
  --adlaire-layer-toast: 700;
}
` },
  { path: "Tokens/breakpoints.css", category: "breakpoint", css: `/* Adlaire-Design breakpoint tokens */
:root {
  --adlaire-breakpoint-sm: 480px;
  --adlaire-breakpoint-md: 768px;
  --adlaire-breakpoint-lg: 1024px;
  --adlaire-breakpoint-xl: 1200px;
}
` },
  { path: "Tokens/surface.css", category: "surface", css: `/* Adlaire-Design surface tokens */
:root {
  --adlaire-surface-accent: #0066cc;
  --adlaire-surface-accent-mid: #0055aa;
  --adlaire-surface-accent-strong: #004499;
  --adlaire-surface-page: #f5f5f5;
  --adlaire-surface-card: #ffffff;
  --adlaire-surface-soft: #f0f7ff;
  --adlaire-surface-soft-strong: #e8f2ff;
  --adlaire-surface-border: #e0e0e0;
  --adlaire-surface-text: #333333;
  --adlaire-surface-text-muted: #555555;
  --adlaire-surface-text-subtle: #666666;
  --adlaire-surface-notice: #ff9800;
  --adlaire-surface-notice-soft: #fff3cd;
  --adlaire-surface-notice-text: #856404;
}
` },
  { path: "Tokens/status.css", category: "status", css: `/* Adlaire-Design status tokens */
:root {
  --adlaire-status-secondary: #6c757d;
  --adlaire-status-secondary-strong: #5a6268;
  --adlaire-status-success: #28a745;
  --adlaire-status-danger: #dc3545;
  --adlaire-status-warning: #ffc107;
  --adlaire-status-info: #17a2b8;
  --adlaire-status-dark: #343a40;
  --adlaire-status-gray-777: #777777;
  --adlaire-status-gray-999: #999999;
  --adlaire-status-gray-ccc: #cccccc;
  --adlaire-status-gray-ddd: #dddddd;
  --adlaire-status-gray-light: #f8f9fa;
  --adlaire-status-gray-soft: #f9f9f9;
  --adlaire-alert-info-text: #0c5460;
  --adlaire-alert-info-bg: #d1ecf1;
  --adlaire-alert-info-border: #bee5eb;
  --adlaire-alert-success-text: #155724;
  --adlaire-alert-success-bg: #d4edda;
  --adlaire-alert-success-border: #c3e6cb;
  --adlaire-alert-warning-text: #856404;
  --adlaire-alert-warning-bg: #fff3cd;
  --adlaire-alert-warning-border: #ffeaa7;
  --adlaire-alert-danger-text: #721c24;
  --adlaire-alert-danger-bg: #f8d7da;
  --adlaire-alert-danger-border: #f5c6cb;
  --adlaire-semantic-danger-color: var(--adlaire-status-danger);
  --adlaire-semantic-danger-text: var(--adlaire-alert-danger-text);
  --adlaire-semantic-danger-bg: var(--adlaire-alert-danger-bg);
  --adlaire-semantic-danger-border: var(--adlaire-alert-danger-border);
  --adlaire-semantic-success-color: var(--adlaire-status-success);
  --adlaire-semantic-success-text: var(--adlaire-alert-success-text);
  --adlaire-semantic-success-bg: var(--adlaire-alert-success-bg);
  --adlaire-semantic-success-border: var(--adlaire-alert-success-border);
  --adlaire-semantic-warning-color: var(--adlaire-status-warning);
  --adlaire-semantic-warning-text: var(--adlaire-alert-warning-text);
  --adlaire-semantic-warning-bg: var(--adlaire-alert-warning-bg);
  --adlaire-semantic-warning-border: var(--adlaire-alert-warning-border);
  --adlaire-semantic-info-color: var(--adlaire-status-info);
  --adlaire-semantic-info-text: var(--adlaire-alert-info-text);
  --adlaire-semantic-info-bg: var(--adlaire-alert-info-bg);
  --adlaire-semantic-info-border: var(--adlaire-alert-info-border);
  --adlaire-semantic-focus-color: var(--adlaire-surface-accent);
  --adlaire-semantic-focus-bg: var(--adlaire-surface-soft);
  --adlaire-semantic-focus-ring: var(--adlaire-shadow-focus-ring);
  --adlaire-semantic-selected-color: var(--adlaire-surface-accent);
  --adlaire-semantic-selected-text: var(--adlaire-surface-accent-strong);
  --adlaire-semantic-selected-bg: var(--adlaire-surface-soft);
  --adlaire-semantic-selected-border: var(--adlaire-surface-accent);
  --adlaire-semantic-muted-text: var(--adlaire-surface-text-muted);
  --adlaire-semantic-muted-bg: var(--adlaire-status-gray-light);
  --adlaire-semantic-muted-border: var(--adlaire-status-gray-ddd);
}
` },
  { path: "Tokens/effects.css", category: "effects", css: `/* Adlaire-Design effect tokens */
:root {
  --adlaire-radius-sm: 4px;
  --adlaire-radius-md: 6px;
  --adlaire-radius-lg: 8px;
  --adlaire-radius-round: 50%;
  --adlaire-shadow-card: 0 2px 8px rgba(0, 0, 0, 0.1);
  --adlaire-shadow-card-hover: 0 4px 16px rgba(0, 0, 0, 0.15);
  --adlaire-shadow-button: 0 2px 8px rgba(0, 0, 0, 0.15);
  --adlaire-shadow-nav: 0 4px 8px rgba(0, 0, 0, 0.2);
  --adlaire-shadow-header: 0 2px 10px rgba(0, 0, 0, 0.1);
  --adlaire-shadow-title: 2px 2px 4px rgba(0, 0, 0, 0.3);
  --adlaire-shadow-focus-color: rgba(0, 102, 204, 0.1);
  --adlaire-shadow-focus-ring: 0 0 0 3px rgba(0, 102, 204, 0.1);
  --adlaire-shadow-marker-ring: 0 0 0 2px var(--adlaire-surface-accent);
  --adlaire-shadow-tab-active: 0 -2px 4px rgba(0, 102, 204, 0.1);
  --adlaire-shadow-blue-soft: 0 2px 8px rgba(0, 102, 204, 0.15);
  --adlaire-shadow-blue: 0 2px 8px rgba(0, 102, 204, 0.3);
  --adlaire-shadow-blue-nav-hover: 0 4px 8px rgba(0, 102, 204, 0.3);
  --adlaire-shadow-blue-sticky: 0 4px 12px rgba(0, 102, 204, 0.15);
  --adlaire-shadow-blue-strong: 0 4px 12px rgba(0, 102, 204, 0.4);
  --adlaire-shadow-blue-hover: 0 4px 12px rgba(0, 102, 204, 0.5);
  --adlaire-shadow-blue-intense: 0 6px 20px rgba(0, 102, 204, 0.6);
  --adlaire-overlay-white-20: rgba(255, 255, 255, 0.2);
  --adlaire-overlay-white-30: rgba(255, 255, 255, 0.3);
  --adlaire-overlay-white-40: rgba(255, 255, 255, 0.4);
  --adlaire-overlay-white-50: rgba(255, 255, 255, 0.5);
  --adlaire-overlay-white-80: rgba(255, 255, 255, 0.8);
  --adlaire-overlay-white-90: rgba(255, 255, 255, 0.9);
  --adlaire-overlay-black-48: rgba(0, 0, 0, 0.48);
  --adlaire-upload-progress: 0%;
  --adlaire-transition-fast: 0.15s ease-in-out;
  --adlaire-transition-button: 0.2s ease-in-out;
  --adlaire-transition-base: 0.3s ease;
  --adlaire-animation-fade-in: fadeIn 0.3s ease-in;
  --adlaire-z-timeline-marker: 1;
  --adlaire-z-sticky: 100;
  --adlaire-z-page-top: 1000;
}
` },
] as const;

export function tokenCssForPath(path: string): string | undefined {
  return TOKEN_FILES.find((file) => file.path === path)?.css;
}
