export type CssDeclarationValue = string | number;

export interface CssDeclaration {
  readonly property: string;
  readonly value: CssDeclarationValue;
}

export interface CssRule {
  readonly selector: string;
  readonly declarations: readonly CssDeclaration[];
  readonly media?: string;
}

export interface CssRuleFile {
  readonly path: string;
  readonly css: string;
}

export const RULE_FILES: readonly CssRuleFile[] = [
  { path: "UI/adlaire.css", css: `/* Adlaire-Design color utilities */
.adlaire-bg-primary {
  background-color: var(--adlaire-color-primary);
}

.adlaire-bg-secondary {
  background-color: var(--adlaire-color-secondary);
}

.adlaire-bg-accent {
  background-color: var(--adlaire-color-accent);
}

.adlaire-bg-surface {
  background-color: var(--adlaire-color-surface);
}

.adlaire-bg-border {
  background-color: var(--adlaire-color-border);
}

.adlaire-bg-support {
  background-color: var(--adlaire-color-support);
}

.adlaire-text-primary {
  color: var(--adlaire-color-primary);
}

.adlaire-text-secondary {
  color: var(--adlaire-color-secondary);
}

.adlaire-text-accent {
  color: var(--adlaire-color-accent);
}

.adlaire-text-surface {
  color: var(--adlaire-color-surface);
}

.adlaire-text-border {
  color: var(--adlaire-color-border);
}

.adlaire-text-support {
  color: var(--adlaire-color-support);
}

.adlaire-border-primary {
  border-color: var(--adlaire-color-primary);
}

.adlaire-border-secondary {
  border-color: var(--adlaire-color-secondary);
}

.adlaire-border-accent {
  border-color: var(--adlaire-color-accent);
}

.adlaire-border-surface {
  border-color: var(--adlaire-color-surface);
}

.adlaire-border-border {
  border-color: var(--adlaire-color-border);
}

.adlaire-border-support {
  border-color: var(--adlaire-color-support);
}
` },
  { path: "UI/base.css", css: `/* Adlaire-Design base styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--adlaire-surface-page);
  color: var(--adlaire-surface-text);
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0 0 1rem;
  font-weight: 600;
  line-height: 1.2;
}

h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.75rem;
}

h4 {
  font-size: 1.5rem;
}

h5 {
  font-size: 1.25rem;
}

h6 {
  font-size: 1rem;
}

p {
  margin: 0 0 1rem;
}

a {
  color: var(--adlaire-surface-accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.adlaire-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.adlaire-skip-link {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: var(--adlaire-layer-toast);
  padding: 10px 14px;
  background-color: var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-card);
  font-weight: 700;
  transform: translateY(-140%);
}

.adlaire-skip-link:focus {
  transform: translateY(0);
}

.adlaire-focus-ring:focus-visible,
.adlaire-keyboard-focus:focus-visible,
.adlaire-focus-surface:focus-within {
  box-shadow: var(--adlaire-shadow-focus-ring);
  outline: 0;
}

.adlaire-landmark-label,
.adlaire-a11y-helper {
  color: var(--adlaire-surface-text-subtle);
  font-size: var(--adlaire-font-size-sm);
}

.adlaire-pressed,
[aria-pressed="true"].adlaire-pressed {
  background-color: var(--adlaire-surface-soft);
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent);
}
` },
  { path: "UI/grid.css", css: `/* Adlaire-Design grid utilities */
.adlaire-content-container,
.container,
.container-fluid {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1rem;
  padding-left: 1rem;
}

.adlaire-content-container,
.container {
  max-width: 1200px;
}

.adlaire-grid-row,
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -0.5rem;
  margin-left: -0.5rem;
}

.adlaire-grid-col,
.col {
  flex: 1;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.col-1 {
  flex: 0 0 8.333%;
  max-width: 8.333%;
}

.col-2 {
  flex: 0 0 16.666%;
  max-width: 16.666%;
}

.col-3 {
  flex: 0 0 25%;
  max-width: 25%;
}

.col-4 {
  flex: 0 0 33.333%;
  max-width: 33.333%;
}

.col-5 {
  flex: 0 0 41.666%;
  max-width: 41.666%;
}

.col-6 {
  flex: 0 0 50%;
  max-width: 50%;
}

.col-7 {
  flex: 0 0 58.333%;
  max-width: 58.333%;
}

.col-8 {
  flex: 0 0 66.666%;
  max-width: 66.666%;
}

.col-9 {
  flex: 0 0 75%;
  max-width: 75%;
}

.col-10 {
  flex: 0 0 83.333%;
  max-width: 83.333%;
}

.col-11 {
  flex: 0 0 91.666%;
  max-width: 91.666%;
}

.col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

@media (max-width: 768px) {
  .col-1,
  .col-2,
  .col-3,
  .col-4,
  .col-5,
  .col-6,
  .col-7,
  .col-8,
  .col-9,
  .col-10,
  .col-11,
  .col-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
` },
  { path: "UI/layout.css", css: `/* Adlaire-Design public layout */
.adlaire-container {
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
  padding-right: 24px;
  padding-left: 24px;
}

.adlaire-public-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 32px;
  align-items: start;
}

.adlaire-public-main {
  min-width: 0;
}

.adlaire-public-sidebar {
  width: 100%;
  min-width: 0;
}

@media (max-width: 1024px) {
  .adlaire-public-layout {
    grid-template-columns: minmax(0, 1fr) 260px;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .adlaire-public-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .adlaire-container {
    padding-right: 16px;
    padding-left: 16px;
  }

  .adlaire-public-layout {
    gap: 20px;
  }
}

.adlaire-app-shell {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  min-height: 100vh;
  background-color: var(--adlaire-surface-page);
}

.adlaire-app-sidebar {
  min-width: 0;
  padding: 20px;
  background-color: var(--adlaire-surface-card);
  border-right: 1px solid var(--adlaire-surface-border);
}

.adlaire-app-main {
  min-width: 0;
  padding: 24px;
}

.adlaire-sidebar-collapsed {
  grid-template-columns: 72px minmax(0, 1fr);
}

.adlaire-split-pane {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) 8px minmax(180px, 1fr);
  min-height: 320px;
}

.adlaire-pane {
  min-width: 0;
  overflow: auto;
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
}

.adlaire-pane-resize-handle {
  min-width: 8px;
  background-color: var(--adlaire-surface-border);
  cursor: col-resize;
}

.adlaire-pane-resize-handle:focus-visible {
  box-shadow: var(--adlaire-shadow-focus-ring);
  outline: 0;
}

.adlaire-pane-collapsed {
  display: none;
}

@media (max-width: 768px) {
  .adlaire-app-shell {
    grid-template-columns: 1fr;
  }

  .adlaire-app-sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--adlaire-surface-border);
  }

  .adlaire-split-pane {
    grid-template-columns: 1fr;
  }

  .adlaire-pane-resize-handle {
    display: none;
  }
}
` },
  { path: "UI/components.css", css: `/* Adlaire-Design public components */
.adlaire-card {
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
  box-shadow: var(--adlaire-shadow-card);
  overflow: hidden;
}

.adlaire-card-header {
  padding: 16px 20px;
  background-color: var(--adlaire-surface-soft);
  border-bottom: 1px solid var(--adlaire-surface-border);
  color: var(--adlaire-surface-accent);
}

.adlaire-card-body {
  padding: 20px;
  color: var(--adlaire-surface-text);
}

.adlaire-section-title {
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent);
}

.adlaire-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  color: var(--adlaire-surface-text-subtle);
}

.adlaire-sidebar-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-notice {
  padding: 16px 20px;
  background-color: var(--adlaire-surface-soft);
  border-left: 4px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
}

.adlaire-notice-warning {
  background-color: var(--adlaire-surface-notice-soft);
  border-left-color: var(--adlaire-surface-notice);
  color: var(--adlaire-surface-notice-text);
}

.adlaire-tabs {
  display: grid;
  gap: 16px;
}

.adlaire-tab-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-bottom: 1px solid var(--adlaire-surface-border);
}

.adlaire-tab-panel {
  padding: 20px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
}

.adlaire-timeline {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-timeline-item {
  padding-left: 16px;
  border-left: 4px solid var(--adlaire-surface-accent);
  color: var(--adlaire-surface-text-muted);
}

.adlaire-page-top {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background-color: var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-card);
  text-decoration: none;
}

.adlaire-panel {
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
}

.adlaire-panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--adlaire-surface-border);
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
}

.adlaire-panel-body {
  padding: 20px;
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-panel-footer {
  padding: 16px 20px;
  background-color: var(--adlaire-surface-soft);
  border-top: 1px solid var(--adlaire-surface-border);
  border-radius: 0 0 var(--adlaire-radius-lg) var(--adlaire-radius-lg);
  color: var(--adlaire-surface-text-subtle);
}

.adlaire-well {
  padding: 20px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-button-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.adlaire-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-toolbar-section {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.adlaire-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}

.adlaire-action-row-start {
  justify-content: flex-start;
}

.adlaire-action-row-between {
  justify-content: space-between;
}

.adlaire-divider {
  height: 1px;
  margin: 24px 0;
  background-color: var(--adlaire-surface-border);
  border: 0;
}

.adlaire-stack {
  display: grid;
  gap: 16px;
}

.adlaire-stack-sm {
  gap: 8px;
}

.adlaire-stack-lg {
  gap: 24px;
}

.adlaire-inline {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.adlaire-empty-state {
  padding: 32px 24px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
  color: var(--adlaire-surface-text-muted);
  text-align: center;
}

.adlaire-empty-state-title {
  margin: 0 0 8px;
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
}

.adlaire-empty-state-text {
  margin: 0;
  line-height: 1.8;
}

.adlaire-feature-list,
.adlaire-check-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-feature-item,
.adlaire-check-item {
  padding: 14px 16px;
  background-color: var(--adlaire-surface-card);
  border-left: 4px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-muted);
  line-height: 1.7;
}

.adlaire-check-item {
  background-color: var(--adlaire-surface-soft);
}

.adlaire-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-chip {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 6px 10px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
  font-size: 0.9rem;
  font-weight: 600;
}

.adlaire-chip-primary {
  background-color: var(--adlaire-surface-accent);
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-card);
}

.adlaire-chip-muted {
  color: var(--adlaire-surface-text-subtle);
}

.adlaire-status-pill {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 6px 10px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-muted);
  font-size: 0.9rem;
  font-weight: 600;
}

.adlaire-status-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  background-color: var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-round);
}

.adlaire-definition-list,
.adlaire-key-value {
  display: grid;
  gap: 0;
  margin: 0;
}

.adlaire-definition-row,
.adlaire-key-value-row {
  display: grid;
  grid-template-columns: minmax(120px, 180px) 1fr;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--adlaire-surface-border);
}

.adlaire-definition-row:last-child,
.adlaire-key-value-row:last-child {
  border-bottom: none;
}

.adlaire-definition-term,
.adlaire-key-value-key {
  color: var(--adlaire-surface-accent);
  font-weight: 700;
}

.adlaire-definition-description,
.adlaire-key-value-value {
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-link-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-link-list-item {
  border-bottom: 1px solid var(--adlaire-surface-border);
}

.adlaire-link-list-item:last-child {
  border-bottom: none;
}

.adlaire-link-list-link {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  color: var(--adlaire-surface-text);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--adlaire-transition-base), padding-left var(--adlaire-transition-base);
}

.adlaire-link-list-link:hover {
  padding-left: 6px;
  color: var(--adlaire-surface-accent);
}

.adlaire-related-links {
  padding: 20px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
}

.adlaire-surface-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.adlaire-surface-item {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-media {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.adlaire-media-figure {
  flex: 0 0 auto;
}

.adlaire-media-body {
  flex: 1 1 auto;
  min-width: 0;
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-media-title {
  margin: 0 0 6px;
  color: var(--adlaire-surface-text);
  font-weight: 700;
}

.adlaire-cta {
  padding: 28px 24px;
  background-color: var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-lg);
  color: var(--adlaire-surface-card);
}

.adlaire-cta-title {
  margin: 0 0 8px;
  color: var(--adlaire-surface-card);
  font-weight: 700;
}

.adlaire-cta-text {
  margin: 0;
  color: var(--adlaire-surface-card);
  line-height: 1.8;
}

.adlaire-cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.adlaire-caption {
  margin-top: 8px;
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.9rem;
  line-height: 1.6;
}

.adlaire-helper-text {
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.9rem;
  line-height: 1.6;
}

.adlaire-page-heading {
  display: grid;
  gap: 10px;
  margin-bottom: 28px;
}

.adlaire-page-heading-title {
  margin: 0;
  color: var(--adlaire-surface-accent-strong);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
}

.adlaire-page-heading-text {
  margin: 0;
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-heading-group {
  display: grid;
  gap: 6px;
}

.adlaire-heading-eyebrow {
  color: var(--adlaire-surface-accent);
  font-size: 0.85rem;
  font-weight: 700;
}

.adlaire-section-lead {
  color: var(--adlaire-surface-text-muted);
  font-size: 1.05rem;
  line-height: 1.9;
}

.adlaire-announcement-bar,
.adlaire-update-notice,
.adlaire-maintenance-notice {
  padding: 12px 16px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-left: 4px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-muted);
  line-height: 1.7;
}

.adlaire-update-notice {
  background-color: var(--adlaire-alert-info-bg);
  border-left-color: var(--adlaire-alert-info-border);
  color: var(--adlaire-alert-info-text);
}

.adlaire-maintenance-notice {
  background-color: var(--adlaire-alert-warning-bg);
  border-left-color: var(--adlaire-alert-warning-border);
  color: var(--adlaire-alert-warning-text);
}

.adlaire-maintenance-screen {
  display: grid;
  min-height: 60vh;
  place-items: center;
  padding: 48px 24px;
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-text-muted);
  text-align: center;
}

.adlaire-maintenance-screen-inner {
  display: grid;
  width: 100%;
  max-width: 640px;
  gap: 16px;
  padding: 32px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
  box-shadow: var(--adlaire-shadow-card);
}

.adlaire-maintenance-screen-title {
  margin: 0;
  color: var(--adlaire-surface-accent-strong);
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.4;
}

.adlaire-maintenance-screen-text {
  margin: 0;
  line-height: 1.8;
}

.adlaire-error-page {
  display: grid;
  min-height: 60vh;
  place-items: center;
  padding: 48px 24px;
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-text-muted);
  text-align: center;
}

.adlaire-error-page-inner {
  display: grid;
  width: 100%;
  max-width: 640px;
  gap: 16px;
  padding: 32px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
  box-shadow: var(--adlaire-shadow-card);
}

.adlaire-error-page-server .adlaire-error-page-inner {
  background-color: var(--adlaire-alert-danger-bg);
  border-color: var(--adlaire-alert-danger-border);
}

.adlaire-error-page-400 .adlaire-error-page-inner,
.adlaire-error-page-401 .adlaire-error-page-inner,
.adlaire-error-page-403 .adlaire-error-page-inner,
.adlaire-error-page-404 .adlaire-error-page-inner {
  background-color: var(--adlaire-alert-warning-bg);
  border-color: var(--adlaire-alert-warning-border);
}

.adlaire-error-page-500 .adlaire-error-page-inner,
.adlaire-error-page-510 .adlaire-error-page-inner {
  background-color: var(--adlaire-alert-danger-bg);
  border-color: var(--adlaire-alert-danger-border);
}

.adlaire-error-page-code {
  margin: 0;
  color: var(--adlaire-alert-danger-text);
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.2;
}

.adlaire-error-page-400 .adlaire-error-page-code,
.adlaire-error-page-401 .adlaire-error-page-code,
.adlaire-error-page-403 .adlaire-error-page-code,
.adlaire-error-page-404 .adlaire-error-page-code {
  color: var(--adlaire-alert-warning-text);
}

.adlaire-error-page-title {
  margin: 0;
  color: var(--adlaire-surface-accent-strong);
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.4;
}

.adlaire-error-page-text {
  margin: 0;
  line-height: 1.8;
}

.adlaire-error-page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.adlaire-step-list,
.adlaire-process-list,
.adlaire-numbered-flow {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-step-item,
.adlaire-process-item,
.adlaire-numbered-flow-item {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-left: 4px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-highlight-box,
.adlaire-summary-box,
.adlaire-stat-block {
  padding: 20px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text-muted);
}

.adlaire-summary-box {
  background-color: var(--adlaire-surface-card);
  box-shadow: var(--adlaire-shadow-card);
}

.adlaire-stat-block {
  display: grid;
  gap: 6px;
  text-align: center;
}

.adlaire-stat-value {
  color: var(--adlaire-surface-accent-strong);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}

.adlaire-stat-label {
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.9rem;
}

.adlaire-anchor-nav,
.adlaire-subnav,
.adlaire-sibling-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.adlaire-anchor-nav-link,
.adlaire-subnav-link,
.adlaire-sibling-nav-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
  font-weight: 600;
  text-decoration: none;
}

.adlaire-anchor-nav-link:hover,
.adlaire-subnav-link:hover,
.adlaire-sibling-nav-link:hover {
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent);
}

.adlaire-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.adlaire-card-media {
  display: grid;
  gap: 12px;
}

.adlaire-card-media-figure {
  overflow: hidden;
  border-radius: var(--adlaire-radius-md);
}

.adlaire-card-media-figure img,
.adlaire-image-frame img {
  display: block;
  width: 100%;
  height: auto;
}

.adlaire-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 16px;
}

.adlaire-simple-list,
.adlaire-bordered-list,
.adlaire-compact-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-simple-list-item,
.adlaire-bordered-list-item,
.adlaire-compact-list-item {
  color: var(--adlaire-surface-text-muted);
  line-height: 1.7;
}

.adlaire-simple-list-item {
  padding: 8px 0;
}

.adlaire-bordered-list-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--adlaire-surface-border);
}

.adlaire-bordered-list-item:last-child {
  border-bottom: none;
}

.adlaire-compact-list-item {
  padding: 4px 0;
}

.adlaire-contact-panel,
.adlaire-inquiry-cta {
  padding: 24px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
  color: var(--adlaire-surface-text-muted);
}

.adlaire-inquiry-cta {
  background-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-card);
}

.adlaire-inquiry-cta a {
  color: inherit;
}

.adlaire-external-link-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--adlaire-surface-border);
  color: var(--adlaire-surface-text);
  text-decoration: none;
}

.adlaire-external-link-row:hover {
  color: var(--adlaire-surface-accent);
}

.adlaire-progress {
  width: 100%;
  height: 10px;
  overflow: hidden;
  background-color: var(--adlaire-surface-soft);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-progress-bar {
  display: block;
  width: 0;
  max-width: 100%;
  height: 100%;
  background-color: var(--adlaire-surface-accent);
}

.adlaire-step-indicator {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.adlaire-step-indicator-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
  padding: 0 10px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-muted);
  font-weight: 700;
}

.adlaire-step-indicator-item-current {
  background-color: var(--adlaire-surface-accent);
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-card);
}

.adlaire-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-tooltip-note,
.adlaire-popover-note {
  display: inline-block;
  max-width: 320px;
  padding: 10px 12px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  box-shadow: var(--adlaire-shadow-card);
  color: var(--adlaire-surface-text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
}

.adlaire-popover-note {
  display: block;
  max-width: 420px;
  padding: 16px;
}

.adlaire-hero-panel,
.adlaire-visual-banner,
.adlaire-image-frame {
  overflow: hidden;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
}

.adlaire-hero-panel,
.adlaire-visual-banner {
  padding: 32px 24px;
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-text-muted);
}

.adlaire-image-frame {
  display: block;
  padding: 8px;
}

.adlaire-logo-list,
.adlaire-partner-list,
.adlaire-icon-tile-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-logo-list-item,
.adlaire-partner-list-item,
.adlaire-icon-tile {
  display: grid;
  min-height: 88px;
  place-items: center;
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text-muted);
  text-align: center;
}

.adlaire-split-block {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  align-items: center;
}

.adlaire-stacked-feature {
  display: grid;
  gap: 16px;
}

.adlaire-pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-page-link {
  display: inline-flex;
  min-width: 36px;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-muted);
  text-decoration: none;
}

.adlaire-page-link:hover,
.adlaire-page-link:focus-visible {
  border-color: var(--adlaire-surface-accent);
  box-shadow: var(--adlaire-shadow-focus-ring);
  color: var(--adlaire-surface-accent);
  outline: 0;
}

.adlaire-page-link-current,
.adlaire-page-link[aria-current="page"] {
  background-color: var(--adlaire-surface-accent);
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-card);
  font-weight: 700;
}

.adlaire-page-link-disabled,
.adlaire-page-link[aria-disabled="true"] {
  background-color: var(--adlaire-status-gray-light);
  color: var(--adlaire-status-gray-999);
  cursor: not-allowed;
  pointer-events: none;
}

.adlaire-filter-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-filter-chip {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-muted);
  cursor: pointer;
}

.adlaire-filter-chip:hover,
.adlaire-filter-chip:focus-visible,
.adlaire-filter-chip[aria-pressed="true"] {
  background-color: var(--adlaire-surface-soft);
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent-strong);
  outline: 0;
}

.adlaire-modal,
.adlaire-drawer {
  position: fixed;
  inset: 0;
  display: none;
  background-color: var(--adlaire-overlay-white-80);
  z-index: var(--adlaire-z-page-top);
}

.adlaire-overlay-open {
  overflow: hidden;
}

.adlaire-modal.is-open,
.adlaire-drawer.is-open {
  display: grid;
}

.adlaire-modal {
  place-items: center;
  padding: 24px;
}

.adlaire-modal-dialog {
  display: grid;
  width: min(100%, 640px);
  max-height: 100%;
  overflow: auto;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
  box-shadow: var(--adlaire-shadow-card);
}

.adlaire-modal-header,
.adlaire-modal-footer,
.adlaire-drawer-header,
.adlaire-drawer-footer {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--adlaire-surface-border);
}

.adlaire-modal-footer,
.adlaire-drawer-footer {
  justify-content: flex-end;
  border-top: 1px solid var(--adlaire-surface-border);
  border-bottom: none;
}

.adlaire-modal-title,
.adlaire-drawer-title {
  margin: 0;
  color: var(--adlaire-surface-text);
  font-size: 1.125rem;
  line-height: 1.4;
}

.adlaire-modal-body,
.adlaire-drawer-body {
  padding: 16px;
  color: var(--adlaire-surface-text-muted);
  line-height: 1.7;
}

.adlaire-modal-close,
.adlaire-drawer-close {
  display: inline-flex;
  min-width: 36px;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  background-color: transparent;
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-muted);
  cursor: pointer;
}

.adlaire-modal-close:hover,
.adlaire-modal-close:focus-visible,
.adlaire-drawer-close:hover,
.adlaire-drawer-close:focus-visible {
  border-color: var(--adlaire-surface-accent);
  box-shadow: var(--adlaire-shadow-focus-ring);
  color: var(--adlaire-surface-accent);
  outline: 0;
}

.adlaire-drawer {
  align-items: stretch;
  justify-content: end;
}

.adlaire-drawer-left {
  justify-content: start;
}

.adlaire-drawer-panel {
  display: grid;
  width: min(100%, 420px);
  grid-template-rows: auto 1fr auto;
  overflow: auto;
  background-color: var(--adlaire-surface-card);
  border-left: 1px solid var(--adlaire-surface-border);
  box-shadow: var(--adlaire-shadow-card);
}

.adlaire-drawer-left .adlaire-drawer-panel {
  border-right: 1px solid var(--adlaire-surface-border);
  border-left: none;
}

.adlaire-dropdown {
  position: relative;
  display: inline-block;
}

.adlaire-dropdown-trigger {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
  cursor: pointer;
}

.adlaire-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  display: none;
  min-width: 180px;
  margin-top: 6px;
  padding: 6px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  box-shadow: var(--adlaire-shadow-card);
  z-index: var(--adlaire-z-sticky);
}

.adlaire-dropdown-menu.is-open {
  display: grid;
  gap: 4px;
}

.adlaire-dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 10px;
  background-color: transparent;
  border: 0;
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-muted);
  cursor: pointer;
  text-align: left;
  text-decoration: none;
}

.adlaire-dropdown-item:hover,
.adlaire-dropdown-item:focus-visible,
.adlaire-dropdown-item[aria-current="true"] {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent-strong);
  outline: 0;
}

.adlaire-carousel {
  display: grid;
  gap: 12px;
}

.adlaire-carousel-viewport {
  overflow: hidden;
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
}

.adlaire-carousel-track {
  display: flex;
  transition: transform var(--adlaire-transition-base);
}

.adlaire-carousel-slide {
  min-width: 100%;
  padding: 24px;
  background-color: var(--adlaire-surface-card);
  color: var(--adlaire-surface-text-muted);
}

.adlaire-carousel-controls,
.adlaire-carousel-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.adlaire-carousel-control,
.adlaire-carousel-indicator {
  display: inline-flex;
  min-width: 36px;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-muted);
  cursor: pointer;
}

.adlaire-carousel-indicator {
  min-width: 12px;
  min-height: 12px;
  padding: 0;
  border-radius: var(--adlaire-radius-round);
}

.adlaire-carousel-control:hover,
.adlaire-carousel-control:focus-visible,
.adlaire-carousel-indicator:hover,
.adlaire-carousel-indicator:focus-visible,
.adlaire-carousel-indicator[aria-current="true"] {
  background-color: var(--adlaire-surface-soft);
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent-strong);
  outline: 0;
}

.adlaire-tooltip {
  position: relative;
  display: inline-flex;
}

.adlaire-tooltip-trigger {
  cursor: help;
}

.adlaire-tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  display: none;
  min-width: 180px;
  max-width: 280px;
  margin-bottom: 8px;
  padding: 8px 10px;
  background-color: var(--adlaire-status-dark);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-card);
  font-size: 0.875rem;
  line-height: 1.5;
  transform: translateX(-50%);
  z-index: var(--adlaire-z-sticky);
}

.adlaire-tooltip:hover .adlaire-tooltip-content,
.adlaire-tooltip:focus-within .adlaire-tooltip-content,
.adlaire-tooltip-content.is-open {
  display: block;
}

@media (max-width: 480px) {
  .adlaire-action-row,
  .adlaire-action-row-between {
    align-items: stretch;
    justify-content: flex-start;
  }

  .adlaire-button-group,
  .adlaire-toolbar,
  .adlaire-toolbar-section,
  .adlaire-cta-actions {
    display: flex;
    width: 100%;
  }

  .adlaire-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .adlaire-definition-row,
  .adlaire-key-value-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .adlaire-media {
    flex-direction: column;
  }

  .adlaire-split-block {
    grid-template-columns: 1fr;
  }

  .adlaire-modal {
    padding: 12px;
  }

  .adlaire-modal-dialog,
  .adlaire-drawer-panel {
    width: 100%;
  }
}

/* Catalog completeness aliases */
.adlaire-affiliation-meta,
.adlaire-invite-status,
.adlaire-role-badge,
.adlaire-member-list,
.adlaire-team-list,
.adlaire-git-alert-status,
.adlaire-git-severity,
.adlaire-git-tag,
.adlaire-git-permission,
.adlaire-git-member-permission,
.adlaire-language-switcher-label,
.adlaire-pagination-count,
.adlaire-settings-label,
.adlaire-settings-help,
.adlaire-last-updated {
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.875rem;
}

.adlaire-member-item,
.adlaire-team-item,
.adlaire-git-pr-item,
.adlaire-git-issue-item,
.adlaire-git-check-item,
.adlaire-git-board-card,
.adlaire-git-mobile-action,
.adlaire-search-suggest-item,
.adlaire-related-link,
.adlaire-page-prev,
.adlaire-page-next,
.adlaire-filter-clear,
.adlaire-git-star-action,
.adlaire-git-watch-action,
.adlaire-git-fork-action,
.adlaire-git-download-action,
.adlaire-git-edit-action {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-git-check-list,
.adlaire-git-board-column,
.adlaire-git-code-search,
.adlaire-git-search-filter,
.adlaire-git-search-result,
.adlaire-git-activity,
.adlaire-git-insights,
.adlaire-git-contribution-graph,
.adlaire-git-org,
.adlaire-git-team-list {
  display: grid;
  gap: 10px;
}

.adlaire-git-pr-detail,
.adlaire-git-issue-detail,
.adlaire-git-danger-zone,
.adlaire-git-empty,
.adlaire-git-error,
.adlaire-git-loading {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-git-danger-zone,
.adlaire-git-error {
  background-color: var(--adlaire-alert-danger-bg);
  border-color: var(--adlaire-alert-danger-border);
  color: var(--adlaire-alert-danger-text);
}

.adlaire-git-loading {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-text-subtle);
}

.adlaire-git-edit-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.adlaire-search-empty,
.adlaire-table-empty,
.adlaire-knowledge-empty {
  padding: 18px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-subtle);
  text-align: center;
}

.adlaire-dialog-close,
.adlaire-language-option-current,
.adlaire-git-mobile-tab {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-language-option-current,
.adlaire-git-mobile-tab[aria-current="true"] {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent);
}

.adlaire-git-settings {
  display: grid;
  gap: 12px;
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

/* Implemented extended UI patterns */
.adlaire-admin-dashboard,
.adlaire-admin-settings,
.adlaire-admin-data-list,
.adlaire-admin-bulk-action {
  display: grid;
  gap: 16px;
}

.adlaire-admin-dashboard {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.adlaire-admin-settings,
.adlaire-admin-data-list {
  padding: 18px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-admin-bulk-action {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  padding: 12px 14px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-admin-role,
.adlaire-permission,
.adlaire-role,
.adlaire-scope {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 5px 9px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-accent-strong);
  font-size: 0.875rem;
  font-weight: 700;
}

.adlaire-language-switcher,
.adlaire-language-current,
.adlaire-language-list,
.adlaire-language-option {
  display: flex;
  gap: 8px;
  align-items: center;
}

.adlaire-language-switcher {
  position: relative;
}

.adlaire-language-list {
  flex-direction: column;
  min-width: 180px;
  padding: 8px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  box-shadow: var(--adlaire-shadow-card-hover);
}

.adlaire-language-option {
  width: 100%;
  padding: 8px 10px;
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
}

.adlaire-language-option[aria-current="true"],
.adlaire-language-option:hover {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent);
}

.adlaire-table-toolbar,
.adlaire-table-footer,
.adlaire-pagination,
.adlaire-page-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.adlaire-table-toolbar,
.adlaire-table-footer {
  justify-content: space-between;
  margin-bottom: 12px;
}

.adlaire-pagination {
  justify-content: center;
}

.adlaire-page-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-page-link,
.adlaire-page-current {
  display: inline-flex;
  min-width: 36px;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
  font-weight: 600;
}

.adlaire-page-current,
.adlaire-page-link[aria-current="page"] {
  background-color: var(--adlaire-surface-accent);
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-card);
}

.adlaire-modal,
.adlaire-confirm-dialog,
.adlaire-notice-dialog,
.adlaire-drawer {
  position: fixed;
  inset: 0;
  z-index: var(--adlaire-layer-modal);
  display: none;
  padding: 24px;
  background-color: var(--adlaire-overlay-black-48);
}

.adlaire-modal.is-open,
.adlaire-confirm-dialog.is-open,
.adlaire-notice-dialog.is-open,
.adlaire-drawer.is-open {
  display: grid;
  place-items: center;
}

.adlaire-modal-dialog,
.adlaire-confirm-dialog-panel,
.adlaire-notice-dialog-panel,
.adlaire-drawer-panel {
  width: min(100%, 640px);
  max-height: min(720px, 90vh);
  overflow: auto;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
  box-shadow: var(--adlaire-shadow-card-hover);
}

.adlaire-drawer {
  justify-items: end;
}

.adlaire-drawer-panel {
  height: 100%;
  border-radius: var(--adlaire-radius-lg) 0 0 var(--adlaire-radius-lg);
}

.adlaire-filter-panel,
.adlaire-filter-row,
.adlaire-saved-filter-list {
  display: grid;
  gap: 12px;
}

.adlaire-filter-panel {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-filter-row {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.adlaire-saved-filter-item {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background-color: var(--adlaire-surface-soft);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-search-box,
.adlaire-search-results,
.adlaire-command-palette,
.adlaire-omnibar {
  display: grid;
  gap: 10px;
}

.adlaire-search-box,
.adlaire-command-palette,
.adlaire-omnibar {
  padding: 12px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-search-input,
.adlaire-command-input,
.adlaire-omnibar-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-command-item,
.adlaire-omnibar-result,
.adlaire-search-result {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
}

.adlaire-command-item[aria-selected="true"],
.adlaire-command-item:hover,
.adlaire-omnibar-result[aria-selected="true"],
.adlaire-omnibar-result:hover,
.adlaire-search-result:hover {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent);
}

.adlaire-command-shortcut {
  color: var(--adlaire-surface-text-subtle);
  font-family: var(--adlaire-font-family-mono);
  font-size: 0.75rem;
}

.adlaire-omnibar-empty {
  padding: 12px;
  color: var(--adlaire-surface-text-subtle);
}

.adlaire-loading-state,
.adlaire-state,
.adlaire-state-empty,
.adlaire-state-error,
.adlaire-state-loading {
  display: grid;
  gap: 10px;
  place-items: center;
  padding: 28px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text-muted);
  text-align: center;
}

.adlaire-state-error {
  background-color: var(--adlaire-alert-danger-bg);
  border-color: var(--adlaire-alert-danger-border);
  color: var(--adlaire-alert-danger-text);
}

.adlaire-state-loading::before,
.adlaire-loading-state::before {
  width: 22px;
  height: 22px;
  border: 3px solid var(--adlaire-surface-border);
  border-top-color: var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-round);
  content: "";
  animation: adlaire-spin 0.8s linear infinite;
}

@keyframes adlaire-spin {
  to {
    transform: rotate(360deg);
  }
}

.adlaire-data-card,
.adlaire-sync-status,
.adlaire-api-error {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-api-error {
  background-color: var(--adlaire-alert-danger-bg);
  border-color: var(--adlaire-alert-danger-border);
  color: var(--adlaire-alert-danger-text);
}

.adlaire-chart-frame,
.adlaire-kpi-card,
.adlaire-metric-comparison {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-chart-legend,
.adlaire-chart-label,
.adlaire-metric-delta,
.adlaire-metric-trend {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.875rem;
}

.adlaire-chart-empty {
  padding: 24px;
  background-color: var(--adlaire-surface-soft);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-subtle);
  text-align: center;
}

.adlaire-kpi-card {
  display: grid;
  gap: 8px;
}

.adlaire-avatar,
.adlaire-presence-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--adlaire-radius-round);
}

.adlaire-avatar {
  width: 40px;
  height: 40px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
  overflow: hidden;
}

.adlaire-avatar-group {
  display: flex;
}

.adlaire-avatar-group .adlaire-avatar + .adlaire-avatar {
  margin-left: -8px;
}

.adlaire-presence {
  position: relative;
  display: inline-flex;
}

.adlaire-presence-dot {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 12px;
  height: 12px;
  background-color: var(--adlaire-status-success);
  border: 2px solid var(--adlaire-surface-card);
}

.adlaire-gallery,
.adlaire-lightbox {
  display: grid;
  gap: 12px;
}

.adlaire-gallery {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.adlaire-gallery-item {
  overflow: hidden;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-lightbox {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-lightbox-caption {
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.875rem;
}

.adlaire-toast-stack {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: var(--adlaire-layer-toast);
  display: grid;
  width: min(360px, calc(100vw - 32px));
  gap: 10px;
}

.adlaire-toast,
.adlaire-snackbar {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background-color: var(--adlaire-status-dark);
  border-radius: var(--adlaire-radius-sm);
  box-shadow: var(--adlaire-shadow-nav);
  color: var(--adlaire-surface-card);
}

.adlaire-toast-dismiss {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
}

.adlaire-git-repo-list,
.adlaire-git-repo-card,
.adlaire-git-branch-switcher,
.adlaire-git-pr-list,
.adlaire-git-issue-list,
.adlaire-git-review-thread,
.adlaire-git-check-status,
.adlaire-git-security-alert,
.adlaire-git-settings-panel,
.adlaire-git-web-ide-entry,
.adlaire-git-project-board,
.adlaire-git-notification-actions,
.adlaire-git-org-members,
.adlaire-git-mobile-nav {
  display: grid;
  gap: 12px;
}

.adlaire-git-repo-card,
.adlaire-git-settings-panel,
.adlaire-git-review-thread,
.adlaire-git-security-alert,
.adlaire-git-project-board {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-git-branch-switcher,
.adlaire-git-notification-actions,
.adlaire-git-mobile-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.adlaire-git-check-status {
  padding: 12px;
  background-color: var(--adlaire-surface-soft);
  border-left: 4px solid var(--adlaire-status-success);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-git-security-alert {
  background-color: var(--adlaire-alert-warning-bg);
  border-color: var(--adlaire-alert-warning-border);
  color: var(--adlaire-alert-warning-text);
}

@media (max-width: 480px) {
  .adlaire-admin-bulk-action {
    grid-template-columns: 1fr;
  }

  .adlaire-modal,
  .adlaire-confirm-dialog,
  .adlaire-notice-dialog,
  .adlaire-drawer {
    padding: 12px;
  }
}
` },
  { path: "UI/site.css", css: `/* Adlaire-Design site chrome */
.adlaire-page {
  min-height: 100vh;
  background-color: var(--adlaire-surface-page);
  color: var(--adlaire-surface-text);
}

.adlaire-site-header,
.site-header {
  padding: 80px 20px 60px;
  background: linear-gradient(135deg, var(--adlaire-surface-accent) 0%, var(--adlaire-surface-accent-mid) 50%, var(--adlaire-surface-accent-strong) 100%);
  box-shadow: var(--adlaire-shadow-header);
  color: var(--adlaire-surface-card);
  text-align: center;
}

.adlaire-site-title,
.site-title {
  margin-bottom: 15px;
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: 0;
  text-shadow: var(--adlaire-shadow-title);
}

.header-link {
  color: var(--adlaire-surface-card);
  text-decoration: none;
  transition: opacity var(--adlaire-transition-base);
}

.header-link:hover {
  opacity: 0.85;
}

.adlaire-site-tagline,
.site-tagline {
  margin-bottom: 35px;
  font-size: 1.3rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  opacity: 0.95;
}

.adlaire-site-nav,
.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.adlaire-nav-button,
.nav-button {
  display: inline-block;
  padding: 12px 30px;
  background-color: var(--adlaire-overlay-white-20);
  border: 2px solid var(--adlaire-overlay-white-50);
  border-radius: var(--adlaire-radius-sm);
  backdrop-filter: blur(5px);
  color: var(--adlaire-surface-card);
  font-weight: 500;
  text-decoration: none;
  transition: background-color var(--adlaire-transition-base), border-color var(--adlaire-transition-base), box-shadow var(--adlaire-transition-base), transform var(--adlaire-transition-base);
}

.adlaire-nav-button:hover,
.nav-button:hover {
  background-color: var(--adlaire-overlay-white-30);
  border-color: var(--adlaire-overlay-white-80);
  box-shadow: var(--adlaire-shadow-nav);
  text-decoration: none;
  transform: translateY(-2px);
}

.adlaire-nav-button.active,
.nav-button.active {
  background-color: var(--adlaire-overlay-white-40);
  border-color: var(--adlaire-overlay-white-90);
  font-weight: 600;
}

.main-content {
  padding: 60px 0;
}

.content-wrapper {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.main-area {
  flex: 1;
  min-width: 0;
}

.adlaire-site-footer,
.site-footer {
  margin-top: 60px;
  padding: 30px 0;
  background-color: var(--adlaire-surface-text);
  color: var(--adlaire-status-gray-ccc);
  text-align: center;
}

.site-footer p {
  margin: 0;
  font-size: 0.95rem;
}

.adlaire-page-top,
.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: var(--adlaire-z-page-top);
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--adlaire-surface-accent) 0%, var(--adlaire-surface-accent-strong) 100%);
  border-radius: var(--adlaire-radius-round);
  box-shadow: var(--adlaire-shadow-blue-strong);
  color: var(--adlaire-surface-card);
  opacity: 0.9;
  text-decoration: none;
  transition: box-shadow var(--adlaire-transition-base), opacity var(--adlaire-transition-base), transform var(--adlaire-transition-base);
}

.adlaire-page-top:hover,
.back-to-top:hover {
  box-shadow: var(--adlaire-shadow-blue-intense);
  opacity: 1;
  text-decoration: none;
  transform: translateY(-5px);
}

.back-to-top-icon {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

@media (max-width: 768px) {
  .adlaire-site-title,
  .site-title {
    font-size: 2.5rem;
  }

  .adlaire-site-tagline,
  .site-tagline {
    font-size: 1.1rem;
  }

  .adlaire-site-header,
  .site-header {
    padding: 60px 20px 40px;
  }

  .main-content {
    padding: 40px 0;
  }

  .content-wrapper {
    flex-direction: column;
  }

  .main-area {
    order: 1;
  }

  .adlaire-page-top,
  .back-to-top {
    right: 20px;
    bottom: 20px;
    width: 45px;
    height: 45px;
  }

  .back-to-top-icon {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .adlaire-site-title,
  .site-title {
    font-size: 2rem;
  }

  .adlaire-site-tagline,
  .site-tagline {
    margin-bottom: 25px;
    font-size: 1rem;
  }

  .adlaire-nav-button,
  .nav-button {
    padding: 10px 20px;
    font-size: 0.95rem;
  }

  .adlaire-page-top,
  .back-to-top {
    right: 15px;
    bottom: 15px;
    width: 40px;
    height: 40px;
  }

  .back-to-top-icon {
    font-size: 1.2rem;
  }
}
` },
  { path: "UI/forms.css", css: `/* Adlaire-Design form components */
.contact-form {
  width: 100%;
}

.adlaire-form-group,
.form-group {
  margin-bottom: 1.5rem;
}

.adlaire-form-label,
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--adlaire-surface-text);
  font-weight: 500;
}

.adlaire-form-label.required::after,
.form-label.required::after {
  color: var(--adlaire-semantic-danger-color);
  content: " *";
}

.adlaire-form-control,
.form-control {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-status-gray-ddd);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color var(--adlaire-transition-fast), box-shadow var(--adlaire-transition-fast);
}

.adlaire-form-control:focus,
.form-control:focus {
  border-color: var(--adlaire-semantic-focus-color);
  box-shadow: var(--adlaire-semantic-focus-ring);
  outline: 0;
}

textarea.adlaire-form-control,
textarea.form-control {
  min-height: 120px;
  resize: vertical;
}

select.adlaire-form-control,
select.form-control {
  cursor: pointer;
}

.adlaire-form-check,
.form-check {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.form-check-input {
  margin-right: 0.5rem;
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
  user-select: none;
}

.adlaire-button,
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: var(--adlaire-radius-sm);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  transition: background-color var(--adlaire-transition-button), border-color var(--adlaire-transition-button), box-shadow var(--adlaire-transition-button), color var(--adlaire-transition-button), transform var(--adlaire-transition-button);
}

.adlaire-button:hover,
.btn:hover {
  box-shadow: var(--adlaire-shadow-button);
  text-decoration: none;
  transform: translateY(-1px);
}

.adlaire-button-primary,
.btn-primary {
  background-color: var(--adlaire-surface-accent);
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-card);
}

.adlaire-button-primary:hover,
.btn-primary:hover {
  background-color: var(--adlaire-surface-accent-mid);
  border-color: var(--adlaire-surface-accent-mid);
}

.adlaire-button-secondary,
.btn-secondary {
  background-color: var(--adlaire-status-secondary);
  border-color: var(--adlaire-status-secondary);
  color: var(--adlaire-surface-card);
}

.adlaire-button-secondary:hover,
.btn-secondary:hover {
  background-color: var(--adlaire-status-secondary-strong);
  border-color: var(--adlaire-status-secondary-strong);
}

.adlaire-button-outline,
.btn-outline-primary {
  background-color: transparent;
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent);
}

.adlaire-button-outline:hover,
.btn-outline-primary:hover {
  background-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-card);
}

.btn-block {
  display: block;
  width: 100%;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.form-notice {
  margin-bottom: 30px;
  padding: 15px 20px;
  background-color: var(--adlaire-surface-notice-soft);
  border-left: 4px solid var(--adlaire-surface-notice);
  border-radius: var(--adlaire-radius-sm);
}

.form-notice p {
  margin: 0;
  color: var(--adlaire-surface-notice-text);
  font-size: 0.95rem;
  line-height: 1.6;
}

.form-notice strong {
  display: block;
  margin-bottom: 5px;
  color: var(--adlaire-surface-notice);
  font-weight: 600;
}

.form-description {
  margin-bottom: 30px;
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-button-submit,
.btn-submit {
  padding: 15px 40px;
  background: linear-gradient(135deg, var(--adlaire-surface-accent) 0%, var(--adlaire-surface-accent-strong) 100%);
  border: none;
  border-radius: var(--adlaire-radius-sm);
  box-shadow: var(--adlaire-shadow-blue);
  color: var(--adlaire-surface-card);
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: box-shadow var(--adlaire-transition-base), transform var(--adlaire-transition-base);
}

.adlaire-button-submit:hover,
.btn-submit:hover {
  box-shadow: var(--adlaire-shadow-blue-hover);
  transform: translateY(-2px);
}

.adlaire-button-disabled,
.adlaire-button-submit:disabled,
.btn-submit:disabled {
  background: linear-gradient(135deg, var(--adlaire-status-gray-ccc) 0%, var(--adlaire-status-gray-999) 100%);
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.adlaire-filter {
  display: grid;
  gap: 16px;
}

.adlaire-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.adlaire-filter-input {
  min-width: min(100%, 260px);
  flex: 1 1 260px;
}

.adlaire-filter-count {
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.875rem;
}

.adlaire-filter-item[hidden] {
  display: none;
}

.adlaire-input-group,
.adlaire-composite-input {
  display: flex;
  width: 100%;
  align-items: stretch;
}

.adlaire-input-group .adlaire-form-control,
.adlaire-composite-input .adlaire-form-control {
  min-width: 0;
  flex: 1 1 auto;
  border-radius: 0;
}

.adlaire-input-prefix,
.adlaire-input-suffix {
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-status-gray-ddd);
  color: var(--adlaire-surface-text-subtle);
  font-weight: 600;
}

.adlaire-input-prefix {
  border-right: 0;
  border-radius: var(--adlaire-radius-sm) 0 0 var(--adlaire-radius-sm);
}

.adlaire-input-suffix {
  border-left: 0;
  border-radius: 0 var(--adlaire-radius-sm) var(--adlaire-radius-sm) 0;
}

.adlaire-date-input,
.adlaire-time-input,
.adlaire-period-field {
  display: grid;
  gap: 8px;
}

.adlaire-date-range {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
}

.adlaire-file-picker,
.adlaire-dropzone,
.adlaire-upload-progress,
.adlaire-upload-list,
.adlaire-attachment-list {
  display: grid;
  gap: 10px;
}

.adlaire-dropzone {
  padding: 24px;
  background-color: var(--adlaire-surface-soft);
  border: 2px dashed var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text-muted);
  text-align: center;
}

.adlaire-dropzone.is-dragover,
.adlaire-dropzone:focus-within {
  border-color: var(--adlaire-surface-accent);
  box-shadow: var(--adlaire-shadow-focus-ring);
}

.adlaire-upload-progress-bar {
  width: 100%;
  height: 8px;
  overflow: hidden;
  background-color: var(--adlaire-surface-soft);
  border-radius: var(--adlaire-radius-round);
}

.adlaire-upload-progress-value {
  display: block;
  width: var(--adlaire-upload-progress);
  height: 100%;
  background-color: var(--adlaire-surface-accent);
}

.adlaire-upload-item,
.adlaire-attachment-item {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-settings-form,
.adlaire-settings-group,
.adlaire-settings-row {
  display: grid;
  gap: 12px;
}

.adlaire-settings-group {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-settings-row {
  grid-template-columns: minmax(160px, 1fr) auto;
  align-items: center;
}

.adlaire-toggle {
  position: relative;
  display: inline-flex;
  width: 44px;
  height: 24px;
  align-items: center;
  padding: 2px;
  background-color: var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-round);
}

.adlaire-toggle::after {
  width: 20px;
  height: 20px;
  background-color: var(--adlaire-surface-card);
  border-radius: var(--adlaire-radius-round);
  content: "";
  transition: transform var(--adlaire-transition-fast);
}

.adlaire-toggle[aria-checked="true"] {
  background-color: var(--adlaire-surface-accent);
}

.adlaire-toggle[aria-checked="true"]::after {
  transform: translateX(20px);
}

.adlaire-danger-zone {
  padding: 16px;
  background-color: var(--adlaire-alert-danger-bg);
  border: 1px solid var(--adlaire-alert-danger-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-alert-danger-text);
}

.adlaire-field,
.adlaire-field-error,
.adlaire-field-success,
.adlaire-error-summary,
.adlaire-error-summary-list {
  display: grid;
  gap: 8px;
}

.adlaire-field-error .adlaire-form-control,
.adlaire-form-control[aria-invalid="true"] {
  border-color: var(--adlaire-semantic-danger-color);
}

.adlaire-field-success .adlaire-form-control {
  border-color: var(--adlaire-semantic-success-color);
}

.adlaire-error-summary {
  padding: 14px 16px;
  background-color: var(--adlaire-semantic-danger-bg);
  border: 1px solid var(--adlaire-semantic-danger-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-semantic-danger-text);
}

.adlaire-input-hint {
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.875rem;
  line-height: 1.5;
}

.adlaire-admin-form {
  display: grid;
  gap: 18px;
}

.adlaire-admin-danger-zone {
  padding: 18px;
  background-color: var(--adlaire-semantic-danger-bg);
  border: 1px solid var(--adlaire-semantic-danger-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-semantic-danger-text);
}

.adlaire-scope,
.adlaire-restricted {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 5px 9px;
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
}

.adlaire-restricted {
  background-color: var(--adlaire-semantic-danger-bg);
  border-color: var(--adlaire-semantic-danger-border);
  color: var(--adlaire-semantic-danger-text);
}

@media (max-width: 480px) {
  .adlaire-date-range,
  .adlaire-settings-row {
    grid-template-columns: 1fr;
  }
}

.adlaire-filter-condition,
.adlaire-field-warning,
.adlaire-upload-error,
.adlaire-error-summary-item {
  display: block;
}

.adlaire-field-warning,
.adlaire-upload-error {
  color: var(--adlaire-alert-warning-text);
}

.adlaire-error-summary-item {
  color: var(--adlaire-alert-danger-text);
}
` },
  { path: "UI/content.css", css: `/* Adlaire-Design content components */
.adlaire-renewal-notice,
.renewal-notice {
  margin-bottom: 40px;
  padding: 30px 25px;
  background: linear-gradient(135deg, var(--adlaire-surface-accent) 0%, var(--adlaire-surface-accent-strong) 100%);
  border-radius: var(--adlaire-radius-lg);
  box-shadow: var(--adlaire-shadow-blue);
  color: var(--adlaire-surface-card);
  text-align: center;
}

.renewal-title {
  margin: 0 0 15px;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.renewal-description {
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.8;
  opacity: 0.95;
}

.content-section {
  margin-bottom: 40px;
}

.adlaire-card,
.card {
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
  box-shadow: var(--adlaire-shadow-card);
  transition: box-shadow var(--adlaire-transition-base);
}

.card {
  padding: 40px;
}

.adlaire-card:hover,
.card:hover {
  box-shadow: var(--adlaire-shadow-card-hover);
}

.card-header {
  padding: 1rem 1.5rem;
  background-color: var(--adlaire-status-gray-light);
  border-bottom: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg) var(--adlaire-radius-lg) 0 0;
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  background-color: var(--adlaire-status-gray-light);
  border-top: 1px solid var(--adlaire-surface-border);
  border-radius: 0 0 var(--adlaire-radius-lg) var(--adlaire-radius-lg);
}

.adlaire-section-title,
.section-title {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 3px solid var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent);
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 0;
}

.section-content h3 {
  margin-top: 25px;
  margin-bottom: 12px;
  color: var(--adlaire-surface-accent-strong);
  font-size: 1.5rem;
  font-weight: 600;
}

.section-content p {
  margin-bottom: 15px;
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.section-content ul {
  margin: 15px 0 20px 25px;
  line-height: 1.9;
}

.section-content li {
  margin-bottom: 8px;
  color: var(--adlaire-surface-text-muted);
}

.adlaire-table-scroll {
  width: 100%;
  overflow-x: auto;
}

.adlaire-content-table,
.content-table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  background-color: var(--adlaire-surface-card);
  color: var(--adlaire-surface-text);
}

.adlaire-content-table th,
.adlaire-content-table td,
.content-table th,
.content-table td {
  padding: 14px 16px;
  border: 1px solid var(--adlaire-surface-border);
  text-align: left;
  vertical-align: top;
}

.adlaire-content-table th,
.content-table th {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
}

.adlaire-content-table caption,
.content-table caption {
  margin-bottom: 10px;
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.9rem;
  text-align: left;
}

.adlaire-meta-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
}

.adlaire-meta-row {
  display: grid;
  grid-template-columns: minmax(120px, 180px) 1fr;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid var(--adlaire-surface-border);
}

.adlaire-meta-row:last-child {
  border-bottom: none;
}

.adlaire-meta-label {
  color: var(--adlaire-surface-accent);
  font-weight: 700;
}

.adlaire-meta-value {
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--adlaire-radius-sm);
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.4;
  vertical-align: middle;
}

.adlaire-badge-primary {
  background-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-card);
}

.adlaire-badge-secondary {
  background-color: var(--adlaire-status-secondary);
  color: var(--adlaire-surface-card);
}

.adlaire-badge-success {
  background-color: var(--adlaire-status-success);
  color: var(--adlaire-surface-card);
}

.adlaire-badge-warning {
  background-color: var(--adlaire-status-warning);
  color: var(--adlaire-surface-text);
}

.adlaire-badge-danger {
  background-color: var(--adlaire-status-danger);
  color: var(--adlaire-surface-card);
}

.adlaire-note {
  padding: 16px 18px;
  background-color: var(--adlaire-surface-soft);
  border-left: 4px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-note-info {
  background-color: var(--adlaire-alert-info-bg);
  border-left-color: var(--adlaire-alert-info-border);
  color: var(--adlaire-alert-info-text);
}

.adlaire-note-success {
  background-color: var(--adlaire-alert-success-bg);
  border-left-color: var(--adlaire-alert-success-border);
  color: var(--adlaire-alert-success-text);
}

.adlaire-note-warning {
  background-color: var(--adlaire-alert-warning-bg);
  border-left-color: var(--adlaire-alert-warning-border);
  color: var(--adlaire-alert-warning-text);
}

.adlaire-note-danger {
  background-color: var(--adlaire-alert-danger-bg);
  border-left-color: var(--adlaire-alert-danger-border);
  color: var(--adlaire-alert-danger-text);
}

.adlaire-faq-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-faq-item {
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text-muted);
}

.adlaire-faq-question,
.adlaire-faq-item summary {
  padding: 16px 18px;
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
}

.adlaire-faq-item summary {
  cursor: pointer;
}

.adlaire-faq-answer,
details.adlaire-faq-item > :not(summary),
.adlaire-faq-item details > :not(summary) {
  padding: 0 18px 18px;
  line-height: 1.8;
}

.adlaire-comparison-block {
  display: grid;
  gap: 16px;
  padding: 20px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
}

.adlaire-pros-cons-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-pros-cons-item {
  padding: 16px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-status-timeline {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-status-timeline-item {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border-left: 4px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.adlaire-comparison-grid-item {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.coming-soon {
  padding: 40px 20px;
  background-color: var(--adlaire-surface-soft);
  border: 2px dashed var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-accent);
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
}

.organization-info {
  margin-top: 20px;
}

.adlaire-info-row,
.info-row {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid var(--adlaire-surface-border);
}

.info-row:first-child {
  padding-top: 0;
}

.info-row:last-child {
  border-bottom: none;
}

.adlaire-info-label,
.info-label {
  width: 180px;
  flex-shrink: 0;
  color: var(--adlaire-surface-accent);
  font-size: 1rem;
  font-weight: 700;
}

.adlaire-info-value,
.info-value {
  flex: 1;
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.business-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.business-list li {
  margin-bottom: 15px;
  padding-left: 0;
  color: var(--adlaire-surface-text);
  font-weight: 600;
}

.business-list li:last-child {
  margin-bottom: 0;
}

.business-detail {
  display: block;
  margin-top: 5px;
  padding-left: 15px;
  color: var(--adlaire-surface-text-muted);
  font-size: 0.95rem;
  font-weight: 400;
}

.adlaire-content-link,
.contact-link,
.privacy-link,
.text-link {
  color: var(--adlaire-surface-accent);
  font-weight: 500;
  text-decoration: none;
  transition: border-bottom-color var(--adlaire-transition-base), color var(--adlaire-transition-base), transform var(--adlaire-transition-base);
}

.contact-link {
  display: inline-block;
  margin-top: 8px;
  border-bottom: 1px solid transparent;
}

.contact-link:hover {
  border-bottom-color: var(--adlaire-surface-accent-strong);
  color: var(--adlaire-surface-accent-strong);
  transform: translateX(3px);
}

.adlaire-content-link:hover,
.privacy-link:hover,
.text-link:hover {
  color: var(--adlaire-surface-accent-strong);
  text-decoration: underline;
}

.adlaire-timeline,
.timeline {
  position: relative;
  padding: 20px 0;
}

.timeline::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 120px;
  width: 2px;
  background: linear-gradient(to bottom, var(--adlaire-surface-accent) 0%, var(--adlaire-surface-accent-strong) 100%);
  content: "";
}

.adlaire-timeline-item,
.timeline-item {
  position: relative;
  display: flex;
  margin-bottom: 30px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-date {
  width: 100px;
  flex-shrink: 0;
  padding-right: 20px;
  color: var(--adlaire-surface-accent);
  font-family: "Courier New", monospace;
  font-size: 1.1rem;
  font-weight: 700;
  text-align: right;
}

.timeline-content {
  position: relative;
  flex: 1;
  padding-top: 2px;
  padding-left: 40px;
}

.timeline-marker {
  position: absolute;
  top: 8px;
  left: 0;
  z-index: var(--adlaire-z-timeline-marker);
  width: 14px;
  height: 14px;
  background-color: var(--adlaire-surface-accent);
  border: 3px solid var(--adlaire-surface-card);
  border-radius: var(--adlaire-radius-round);
  box-shadow: var(--adlaire-shadow-marker-ring);
}

.timeline-text {
  color: var(--adlaire-surface-text-muted);
  font-size: 1rem;
  line-height: 1.8;
}

.tab-container {
  margin-top: 20px;
}

.adlaire-tab-input,
.tab-input {
  display: none;
}

.tab-labels {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  border-bottom: 2px solid var(--adlaire-surface-border);
}

.adlaire-tab-label,
.tab-label {
  position: relative;
  bottom: -2px;
  padding: 12px 24px;
  background-color: var(--adlaire-surface-page);
  border: 1px solid var(--adlaire-surface-border);
  border-bottom: none;
  border-radius: var(--adlaire-radius-md) var(--adlaire-radius-md) 0 0;
  color: var(--adlaire-surface-text-subtle);
  cursor: pointer;
  font-weight: 500;
  transition: background-color var(--adlaire-transition-base), border-color var(--adlaire-transition-base), box-shadow var(--adlaire-transition-base), color var(--adlaire-transition-base);
}

.adlaire-tab-label:hover,
.tab-label:hover {
  background-color: var(--adlaire-surface-soft-strong);
  color: var(--adlaire-surface-accent);
}

#tab-all:checked ~ .tab-labels label[for="tab-all"],
#tab-press:checked ~ .tab-labels label[for="tab-press"],
#tab-maintenance:checked ~ .tab-labels label[for="tab-maintenance"] {
  background-color: var(--adlaire-surface-card);
  border-color: var(--adlaire-surface-accent);
  border-bottom: 2px solid var(--adlaire-surface-card);
  box-shadow: var(--adlaire-shadow-tab-active);
  color: var(--adlaire-surface-accent);
  font-weight: 600;
}

.adlaire-tab-content,
.tab-content {
  display: none;
}

#tab-all:checked ~ #content-all,
#tab-press:checked ~ #content-press,
#tab-maintenance:checked ~ #content-maintenance {
  display: block;
}

.tab-pane {
  animation: var(--adlaire-animation-fade-in);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.adlaire-news-item,
.news-item {
  margin-bottom: 20px;
  padding: 25px;
  background-color: var(--adlaire-surface-card);
  border-left: 4px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
  transition: box-shadow var(--adlaire-transition-base), transform var(--adlaire-transition-base);
}

.adlaire-news-item:hover,
.news-item:hover {
  box-shadow: var(--adlaire-shadow-blue-soft);
  transform: translateX(5px);
}

.news-header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 15px;
}

.news-date {
  color: var(--adlaire-surface-text-subtle);
  font-family: "Courier New", monospace;
  font-size: 0.95rem;
  font-weight: 600;
}

.adlaire-news-badge,
.news-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--adlaire-radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.news-badge-press {
  background-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-card);
}

.news-badge-maintenance {
  background-color: var(--adlaire-surface-notice);
  color: var(--adlaire-surface-card);
}

/* Implemented extended content UI patterns */
.adlaire-toc,
.adlaire-toc-list,
.adlaire-toc-item {
  display: grid;
  gap: 8px;
}

.adlaire-toc {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-toc-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-toc-link {
  color: var(--adlaire-surface-text);
  text-decoration: none;
}

.adlaire-toc-link:hover,
.adlaire-toc-link[aria-current="true"] {
  color: var(--adlaire-surface-accent);
  text-decoration: underline;
}

.adlaire-content-card,
.adlaire-code-block,
.adlaire-related-articles,
.adlaire-knowledge-search,
.adlaire-knowledge-category-nav,
.adlaire-knowledge-updates {
  display: grid;
  gap: 12px;
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-code-block {
  overflow: auto;
  background-color: var(--adlaire-status-dark);
  color: var(--adlaire-surface-card);
  font-family: var(--adlaire-font-family-mono);
  line-height: 1.7;
}

.adlaire-code-header {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  color: var(--adlaire-surface-card);
  font-size: 0.875rem;
}

.adlaire-code-copy {
  cursor: pointer;
}

.adlaire-related-list,
.adlaire-knowledge-category-list,
.adlaire-knowledge-update-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.adlaire-related-item,
.adlaire-knowledge-category-item,
.adlaire-knowledge-update-item {
  padding: 10px 0;
  border-bottom: 1px solid var(--adlaire-surface-border);
}

.adlaire-related-item:last-child,
.adlaire-knowledge-category-item:last-child,
.adlaire-knowledge-update-item:last-child {
  border-bottom: 0;
}

.adlaire-repo-file-list,
.adlaire-repo-commit-list,
.adlaire-repo-diff,
.adlaire-git-file-tree,
.adlaire-git-path-nav,
.adlaire-git-file-viewer,
.adlaire-git-code-view,
.adlaire-git-commit-list,
.adlaire-git-commit-detail,
.adlaire-git-diff-viewer,
.adlaire-git-release-list,
.adlaire-git-wiki-body,
.adlaire-git-package-list {
  display: grid;
  gap: 10px;
}

.adlaire-repo-file-list,
.adlaire-repo-commit-list,
.adlaire-repo-diff,
.adlaire-git-file-viewer,
.adlaire-git-code-view,
.adlaire-git-diff-viewer {
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-repo-file-item,
.adlaire-repo-commit-item,
.adlaire-git-file-tree-item,
.adlaire-git-commit-item,
.adlaire-git-release-item,
.adlaire-git-package-item {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--adlaire-surface-border);
}

.adlaire-git-path-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.adlaire-git-code-line {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  font-family: var(--adlaire-font-family-mono);
}

.adlaire-git-line-number {
  padding-right: 12px;
  color: var(--adlaire-surface-text-subtle);
  text-align: right;
  user-select: none;
}

.adlaire-git-line-code {
  min-width: 0;
  overflow-x: auto;
}

.adlaire-git-line-highlight,
.adlaire-git-diff-added {
  background-color: var(--adlaire-alert-success-bg);
}

.adlaire-git-diff-removed {
  background-color: var(--adlaire-alert-danger-bg);
}

.adlaire-markdown-body,
.adlaire-mdx-body {
  color: var(--adlaire-surface-text);
  line-height: 1.8;
}

.adlaire-markdown-body > *:first-child,
.adlaire-mdx-body > *:first-child {
  margin-top: 0;
}

.adlaire-markdown-body pre,
.adlaire-mdx-body pre {
  overflow: auto;
  padding: 16px;
  background-color: var(--adlaire-status-dark);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-card);
}

.adlaire-md-note {
  padding: 14px 16px;
  background-color: var(--adlaire-surface-soft);
  border-left: 4px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-md-footnote {
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.875rem;
}

.adlaire-audit-trail,
.adlaire-activity-log,
.adlaire-admin-audit-log {
  display: grid;
  gap: 10px;
}

.adlaire-activity-item,
.adlaire-audit-item {
  display: grid;
  grid-template-columns: minmax(120px, auto) minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
  padding: 12px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-activity-actor {
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
}

.adlaire-activity-time {
  color: var(--adlaire-surface-text-subtle);
  font-family: var(--adlaire-font-family-mono);
  font-size: 0.875rem;
}

@media (max-width: 480px) {
  .adlaire-activity-item,
  .adlaire-audit-item,
  .adlaire-git-code-line {
    grid-template-columns: 1fr;
  }
}

/* Catalog completeness aliases */
.adlaire-content-card-header,
.adlaire-content-card-body,
.adlaire-content-card-footer,
.adlaire-code-title,
.adlaire-code-body,
.adlaire-related-meta,
.adlaire-data-card-title,
.adlaire-data-card-value,
.adlaire-toc-title,
.adlaire-knowledge-search-nav,
.adlaire-knowledge-list,
.adlaire-git-readme,
.adlaire-git-readme-meta,
.adlaire-git-docs-nav,
.adlaire-git-docs-page,
.adlaire-git-wiki,
.adlaire-git-artifact-list,
.adlaire-repo-save-status,
.adlaire-repo-change-badge {
  display: block;
}

.adlaire-content-card-header,
.adlaire-code-title,
.adlaire-data-card-title,
.adlaire-toc-title {
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
}

.adlaire-content-card-body,
.adlaire-content-card-footer,
.adlaire-related-meta,
.adlaire-git-readme-meta,
.adlaire-repo-save-status {
  color: var(--adlaire-surface-text-subtle);
  line-height: 1.7;
}

.adlaire-data-card-value {
  color: var(--adlaire-surface-text);
  font-size: 1.5rem;
  font-weight: 700;
}

.adlaire-code-body {
  overflow: auto;
  font-family: var(--adlaire-font-family-mono);
}

.adlaire-comparison-table,
.adlaire-data-table,
.adlaire-table {
  width: 100%;
  border-collapse: collapse;
}

.adlaire-comparison-table th,
.adlaire-comparison-table td,
.adlaire-data-table th,
.adlaire-data-table td,
.adlaire-table th,
.adlaire-table td {
  padding: 12px 14px;
  border: 1px solid var(--adlaire-surface-border);
  text-align: left;
}

.adlaire-table-row-selected {
  background-color: var(--adlaire-surface-soft);
}

.adlaire-table-cell-muted {
  color: var(--adlaire-surface-text-subtle);
}

.adlaire-toc-sticky {
  position: sticky;
  top: 16px;
}

.adlaire-toc-link-current {
  color: var(--adlaire-surface-accent);
  font-weight: 700;
}

.adlaire-repo-file-row,
.adlaire-repo-directory-row,
.adlaire-git-file-row,
.adlaire-git-file-header,
.adlaire-git-file-empty,
.adlaire-git-ref-switcher,
.adlaire-git-ref-current,
.adlaire-git-ref-menu {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}

.adlaire-repo-diff-added,
.adlaire-git-diff-added {
  background-color: var(--adlaire-alert-success-bg);
}

.adlaire-repo-diff-removed,
.adlaire-git-diff-removed {
  background-color: var(--adlaire-alert-danger-bg);
}

.adlaire-git-review-comment,
.adlaire-git-review-resolved {
  padding: 10px 12px;
  background-color: var(--adlaire-surface-soft);
  border-left: 4px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-git-review-resolved {
  opacity: 0.72;
}

.adlaire-search-result-item,
.adlaire-search-suggest {
  display: grid;
  gap: 8px;
}

.adlaire-git-repo-meta,
.adlaire-git-repo-summary,
.adlaire-repo-settings,
.adlaire-repo-settings-row,
.adlaire-repo-settings-section {
  display: grid;
  gap: 8px;
}

.adlaire-git-repo-meta,
.adlaire-git-repo-summary {
  color: var(--adlaire-surface-text-subtle);
  line-height: 1.7;
}

.adlaire-repo-settings-section {
  padding: 14px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
}

.news-title {
  margin-bottom: 15px;
  color: var(--adlaire-surface-accent);
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.4;
}

.news-content {
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.news-content p {
  margin-bottom: 12px;
}

.news-content p:last-child {
  margin-bottom: 0;
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
}

.sidebar-section {
  margin-bottom: 25px;
  padding: 25px;
  background-color: var(--adlaire-surface-card);
  border-radius: var(--adlaire-radius-lg);
  box-shadow: var(--adlaire-shadow-card);
  transition: box-shadow var(--adlaire-transition-base);
}

.sidebar-section:hover {
  box-shadow: var(--adlaire-shadow-card-hover);
}

.sidebar-title {
  margin: 0 0 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent);
  font-size: 1.2rem;
  font-weight: 700;
}

.sidebar-content {
  font-size: 0.95rem;
  line-height: 1.6;
}

.coming-soon-small {
  margin: 0;
  padding: 20px 10px;
  background-color: var(--adlaire-surface-soft);
  border: 1px dashed var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-accent);
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
}

.sidebar-link-list,
.adlaire-sidebar-links,
.sidebar-links {
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar-link-list li {
  margin-bottom: 12px;
}

.sidebar-link-list li:last-child {
  margin-bottom: 0;
}

.sidebar-link {
  display: block;
  padding: 10px 15px;
  background-color: var(--adlaire-status-gray-soft);
  border-left: 3px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
  font-weight: 500;
  text-decoration: none;
  transition: background-color var(--adlaire-transition-base), border-left-color var(--adlaire-transition-base), color var(--adlaire-transition-base), transform var(--adlaire-transition-base);
}

.sidebar-link:hover {
  background-color: var(--adlaire-surface-soft-strong);
  border-left-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent);
  text-decoration: none;
  transform: translateX(5px);
}

.sidebar-link.active,
.active.sidebar-link {
  background-color: var(--adlaire-surface-accent);
  border-left-color: var(--adlaire-surface-accent-strong);
  color: var(--adlaire-surface-card);
}

.adlaire-sidebar-links li,
.sidebar-links li {
  position: relative;
  margin-bottom: 12px;
  padding-left: 20px;
}

.adlaire-sidebar-links li::before,
.sidebar-links li::before {
  position: absolute;
  left: 0;
  color: var(--adlaire-surface-accent);
  content: "\\25b8";
  font-weight: 700;
}

.adlaire-sidebar-links a,
.sidebar-links a {
  display: inline-block;
  color: var(--adlaire-surface-text);
  text-decoration: none;
  transition: color var(--adlaire-transition-base), padding-left var(--adlaire-transition-base);
}

.adlaire-sidebar-links a:hover,
.sidebar-links a:hover {
  padding-left: 5px;
  color: var(--adlaire-surface-accent);
}

.adlaire-contact-info,
.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.adlaire-contact-item,
.contact-item {
  padding: 20px;
  background-color: var(--adlaire-status-gray-soft);
  border-left: 4px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-contact-item h3,
.contact-item h3 {
  margin-bottom: 10px;
  color: var(--adlaire-surface-accent);
  font-size: 1.2rem;
  font-weight: 600;
}

.adlaire-contact-item p,
.contact-item p {
  margin-bottom: 0;
  color: var(--adlaire-surface-text-muted);
}

.adlaire-contact-item a,
.contact-item a {
  color: var(--adlaire-surface-accent);
  text-decoration: none;
  transition: color var(--adlaire-transition-base);
}

.adlaire-contact-item a:hover,
.contact-item a:hover {
  color: var(--adlaire-surface-accent-strong);
  text-decoration: underline;
}

.adlaire-breadcrumb,
.breadcrumb {
  margin-bottom: 20px;
  padding: 15px 0;
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.9rem;
}

.breadcrumb-link {
  color: var(--adlaire-surface-accent);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--adlaire-transition-base);
}

.breadcrumb-link:hover {
  color: var(--adlaire-surface-accent-strong);
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 10px;
  color: var(--adlaire-status-gray-999);
}

.breadcrumb-current {
  color: var(--adlaire-surface-text-subtle);
  font-weight: 600;
}

.info-note {
  color: var(--adlaire-status-gray-777);
  font-size: 0.9rem;
}

.mt-30 {
  margin-top: 30px;
}

.last-updated {
  padding: 20px 0 0;
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.9rem;
  text-align: right;
}

.last-updated p {
  margin: 0;
}

.adlaire-legal-toc,
.legal-toc {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px 0;
}

.legal-toc-card {
  position: sticky;
  top: 20px;
  z-index: var(--adlaire-z-sticky);
  background-color: var(--adlaire-surface-soft);
  border-left: 4px solid var(--adlaire-surface-accent);
  box-shadow: var(--adlaire-shadow-blue-sticky);
}

.adlaire-legal-toc-link,
.legal-toc-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--adlaire-surface-card);
  border: 2px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-accent);
  font-weight: 500;
  text-decoration: none;
  transition: background-color var(--adlaire-transition-base), box-shadow var(--adlaire-transition-base), color var(--adlaire-transition-base), transform var(--adlaire-transition-base);
}

.adlaire-legal-toc-link:hover,
.legal-toc-link:hover {
  background-color: var(--adlaire-surface-accent);
  box-shadow: var(--adlaire-shadow-blue-nav-hover);
  color: var(--adlaire-surface-card);
  text-decoration: none;
  transform: translateY(-2px);
}

.adlaire-alert,
.alert {
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-alert-info,
.alert-info {
  background-color: var(--adlaire-semantic-info-bg);
  border-color: var(--adlaire-semantic-info-border);
  color: var(--adlaire-semantic-info-text);
}

.adlaire-alert-success,
.alert-success {
  background-color: var(--adlaire-semantic-success-bg);
  border-color: var(--adlaire-semantic-success-border);
  color: var(--adlaire-semantic-success-text);
}

.adlaire-alert-warning,
.alert-warning {
  background-color: var(--adlaire-semantic-warning-bg);
  border-color: var(--adlaire-semantic-warning-border);
  color: var(--adlaire-semantic-warning-text);
}

.adlaire-alert-danger,
.alert-danger {
  background-color: var(--adlaire-semantic-danger-bg);
  border-color: var(--adlaire-semantic-danger-border);
  color: var(--adlaire-semantic-danger-text);
}

.adlaire-sortable-table {
  width: 100%;
  border-collapse: collapse;
}

.adlaire-sortable-table th {
  vertical-align: middle;
}

.adlaire-sort-button {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 4px 0;
  background-color: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  text-align: left;
}

.adlaire-sort-button:hover,
.adlaire-sort-button:focus-visible {
  color: var(--adlaire-surface-accent);
  outline: 0;
}

.adlaire-sort-button::after {
  content: "";
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  border-top: 6px solid var(--adlaire-status-gray-999);
}

[aria-sort="ascending"] .adlaire-sort-button::after {
  border-top: 0;
  border-bottom: 6px solid var(--adlaire-surface-accent);
}

[aria-sort="descending"] .adlaire-sort-button::after {
  border-top-color: var(--adlaire-surface-accent);
}

.adlaire-filter-results {
  display: grid;
  gap: 12px;
}

.adlaire-filter-empty {
  display: none;
  padding: 16px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text-muted);
}

.adlaire-filter-empty.is-open {
  display: block;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 250px;
  }

  .sidebar-section {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .card {
    padding: 30px 20px;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .section-content h3 {
    font-size: 1.3rem;
  }

  .sidebar {
    order: 2;
    width: 100%;
  }

  .adlaire-contact-info,
  .contact-info {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .renewal-notice {
    padding: 25px 20px;
  }

  .renewal-title {
    font-size: 1.3rem;
  }

  .renewal-description {
    font-size: 0.95rem;
  }

  .tab-labels {
    gap: 5px;
  }

  .tab-label {
    padding: 10px 16px;
    font-size: 0.9rem;
  }

  .news-item {
    padding: 20px 15px;
  }

  .news-title {
    font-size: 1.2rem;
  }

  .info-row {
    flex-direction: column;
    padding: 15px 0;
  }

  .info-label {
    width: 100%;
    margin-bottom: 8px;
  }

  .adlaire-meta-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 14px 0;
  }

  .timeline::before {
    left: 80px;
  }

  .timeline-date {
    width: 70px;
    padding-right: 10px;
    font-size: 0.95rem;
  }

  .timeline-content {
    padding-left: 30px;
  }

  .breadcrumb {
    padding: 12px 0;
    font-size: 0.85rem;
  }

  .breadcrumb-separator {
    margin: 0 8px;
  }

  .legal-toc-card {
    position: relative;
    top: 0;
  }

  .legal-toc {
    flex-direction: column;
    gap: 10px;
  }

  .legal-toc-link {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 25px 15px;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .renewal-notice {
    padding: 20px 15px;
  }

  .renewal-title {
    margin-bottom: 12px;
    font-size: 1.1rem;
  }

  .renewal-description {
    font-size: 0.9rem;
  }

  .tab-labels {
    flex-direction: column;
    gap: 8px;
    border-bottom: none;
  }

  .tab-label {
    bottom: 0;
    padding: 12px 20px;
    border: 1px solid var(--adlaire-surface-border);
    border-radius: var(--adlaire-radius-md);
    font-size: 0.95rem;
  }

  #tab-all:checked ~ .tab-labels label[for="tab-all"],
  #tab-press:checked ~ .tab-labels label[for="tab-press"],
  #tab-maintenance:checked ~ .tab-labels label[for="tab-maintenance"] {
    border: 2px solid var(--adlaire-surface-accent);
  }

  .news-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .news-title {
    font-size: 1.1rem;
  }

  .adlaire-content-table th,
  .adlaire-content-table td,
  .content-table th,
  .content-table td {
    padding: 12px 14px;
  }

  .adlaire-note {
    padding: 14px 16px;
  }

  .timeline::before {
    left: 60px;
  }

  .timeline-date {
    width: 55px;
    padding-right: 5px;
    font-size: 0.85rem;
  }

  .timeline-content {
    padding-left: 25px;
  }

  .timeline-text {
    font-size: 0.95rem;
  }

  .timeline-marker {
    width: 12px;
    height: 12px;
    border-width: 2px;
  }

  .breadcrumb {
    padding: 10px 0;
    font-size: 0.8rem;
  }

  .breadcrumb-separator {
    margin: 0 6px;
  }
}
` },
  { path: "UI/utilities.css", css: `/* Adlaire-Design utility classes */
.mt-0 {
  margin-top: 0;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 1rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.mt-5 {
  margin-top: 3rem;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mb-5 {
  margin-bottom: 3rem;
}

.pt-0 {
  padding-top: 0;
}

.pt-1 {
  padding-top: 0.25rem;
}

.pt-2 {
  padding-top: 0.5rem;
}

.pt-3 {
  padding-top: 1rem;
}

.pt-4 {
  padding-top: 1.5rem;
}

.pt-5 {
  padding-top: 3rem;
}

.pb-0 {
  padding-bottom: 0;
}

.pb-1 {
  padding-bottom: 0.25rem;
}

.pb-2 {
  padding-bottom: 0.5rem;
}

.pb-3 {
  padding-bottom: 1rem;
}

.pb-4 {
  padding-bottom: 1.5rem;
}

.pb-5 {
  padding-bottom: 3rem;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-primary {
  color: var(--adlaire-semantic-selected-color);
}

.text-secondary,
.text-muted {
  color: var(--adlaire-semantic-muted-text);
}

.text-success {
  color: var(--adlaire-semantic-success-color);
}

.text-danger {
  color: var(--adlaire-semantic-danger-color);
}

.text-warning {
  color: var(--adlaire-semantic-warning-color);
}

.text-info {
  color: var(--adlaire-semantic-info-color);
}

.adlaire-muted-text {
  color: var(--adlaire-semantic-muted-text);
}

.bg-primary {
  background-color: var(--adlaire-surface-accent);
}

.bg-secondary {
  background-color: var(--adlaire-status-secondary);
}

.bg-light {
  background-color: var(--adlaire-status-gray-light);
}

.bg-dark {
  background-color: var(--adlaire-status-dark);
}

.d-none {
  display: none;
}

.d-block {
  display: block;
}

.d-inline {
  display: inline;
}

.d-inline-block {
  display: inline-block;
}

.d-flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}

.flex-column {
  flex-direction: column;
}

.justify-content-start {
  justify-content: flex-start;
}

.justify-content-end {
  justify-content: flex-end;
}

.justify-content-center {
  justify-content: center;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-start {
  align-items: flex-start;
}

.align-items-end {
  align-items: flex-end;
}

.align-items-center {
  align-items: center;
}

.adlaire-text-xs {
  font-size: var(--adlaire-font-size-xs);
}

.adlaire-text-sm {
  font-size: var(--adlaire-font-size-sm);
}

.adlaire-text-lg {
  font-size: var(--adlaire-font-size-lg);
}

.adlaire-font-mono {
  font-family: var(--adlaire-font-family-mono);
}

.adlaire-gap-2 {
  gap: var(--adlaire-space-2);
}

.adlaire-gap-4 {
  gap: var(--adlaire-space-4);
}

.adlaire-gap-6 {
  gap: var(--adlaire-space-6);
}
` },
  { path: "UI/compat-agws.css", css: `/* Adlaire-Design specification layer */
#top,
#company,
#terms,
#privacy,
#disclaimer,
#copyright,
#contactForm,
#name,
#email,
#subject,
#inquiry_type,
#message {
  scroll-margin-top: 20px;
}

.container {
  padding-right: 20px;
  padding-left: 20px;
}

[aria-label],
[target="_blank"],
[rel="stylesheet"],
[name="viewport"],
[name="news-tab"],
[type="radio"],
[type="checkbox"],
[type="submit"],
[type="text"],
[type="email"],
[rows],
[value],
[for] {
  font: inherit;
}
` },
  { path: "EditorUI/wysiwyg.css", css: `/* Adlaire-Design WYSIWYG editor */
/* Editor UI common structure */
.adlaire-wysiwyg {
  display: grid;
  gap: 0;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
  box-shadow: var(--adlaire-shadow-card);
  color: var(--adlaire-surface-text);
  overflow: hidden;
}

.adlaire-wysiwyg[aria-disabled="true"],
.adlaire-wysiwyg[aria-busy="true"] {
  border-color: var(--adlaire-surface-border);
}

.adlaire-wysiwyg-header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: var(--adlaire-surface-soft);
  border-bottom: 1px solid var(--adlaire-surface-border);
}

.adlaire-wysiwyg-title {
  margin: 0;
  color: var(--adlaire-surface-accent-strong);
  font-size: 1rem;
  font-weight: 700;
}

.adlaire-wysiwyg-status {
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.9rem;
}

.adlaire-wysiwyg-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--adlaire-surface-card);
  border-bottom: 1px solid var(--adlaire-surface-border);
}

.adlaire-wysiwyg-toolbar-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding-right: 10px;
  border-right: 1px solid var(--adlaire-surface-border);
}

.adlaire-wysiwyg-toolbar-group:last-child {
  padding-right: 0;
  border-right: none;
}

.adlaire-wysiwyg-tool {
  display: inline-flex;
  min-width: 36px;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
  cursor: pointer;
  font-weight: 600;
  transition: background-color var(--adlaire-transition-fast), border-color var(--adlaire-transition-fast), color var(--adlaire-transition-fast);
}

.adlaire-wysiwyg-tool:hover,
.adlaire-wysiwyg-tool:focus-visible,
.adlaire-wysiwyg-tool[aria-pressed="true"] {
  background-color: var(--adlaire-surface-soft);
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent);
}

.adlaire-wysiwyg-tool:focus-visible,
.adlaire-wysiwyg-slash-item:focus-visible,
.adlaire-wysiwyg-mobile-action:focus-visible,
.adlaire-wysiwyg-mobile-sheet-item:focus-visible,
.adlaire-wysiwyg-outline-item:focus-visible {
  box-shadow: var(--adlaire-shadow-focus-ring);
  outline: 0;
}

.adlaire-wysiwyg-tool:disabled,
.adlaire-wysiwyg-tool[aria-disabled="true"] {
  background-color: var(--adlaire-status-gray-light);
  border-color: var(--adlaire-surface-border);
  color: var(--adlaire-surface-text-subtle);
  cursor: not-allowed;
}

.adlaire-wysiwyg-canvas {
  display: grid;
  gap: 12px;
  min-height: 320px;
  padding: 24px;
  background-color: var(--adlaire-surface-page);
}

/* Priority A: core block editor UI */
.adlaire-wysiwyg-block {
  position: relative;
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 12px;
  align-items: start;
  padding: 12px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid transparent;
  border-radius: var(--adlaire-radius-md);
  transition: border-color var(--adlaire-transition-fast), box-shadow var(--adlaire-transition-fast);
}

.adlaire-wysiwyg-block:hover,
.adlaire-wysiwyg-block:focus-within,
.adlaire-wysiwyg-block-selected,
.adlaire-wysiwyg-block[aria-selected="true"] {
  border-color: var(--adlaire-semantic-selected-border);
  box-shadow: var(--adlaire-shadow-blue-soft);
}

.adlaire-wysiwyg-block-handle {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text-subtle);
  cursor: grab;
  user-select: none;
}

.adlaire-wysiwyg-block-handle:hover {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent);
}

.adlaire-wysiwyg-block-content {
  min-width: 0;
  color: var(--adlaire-surface-text);
  line-height: 1.8;
}

.adlaire-wysiwyg-placeholder {
  color: var(--adlaire-surface-text-subtle);
  font-style: italic;
}

.adlaire-wysiwyg-inline-toolbar {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px;
  background-color: var(--adlaire-status-dark);
  border-radius: var(--adlaire-radius-sm);
  box-shadow: var(--adlaire-shadow-nav);
  color: var(--adlaire-surface-card);
}

.adlaire-wysiwyg-slash-menu {
  display: grid;
  gap: 4px;
  min-width: 220px;
  padding: 8px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  box-shadow: var(--adlaire-shadow-card-hover);
}

.adlaire-wysiwyg-slash-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
  cursor: pointer;
  transition: background-color var(--adlaire-transition-fast), color var(--adlaire-transition-fast);
}

.adlaire-wysiwyg-slash-item:hover,
.adlaire-wysiwyg-slash-item:focus-visible,
.adlaire-wysiwyg-slash-item[aria-selected="true"] {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent);
}

.adlaire-wysiwyg-slash-item[aria-current="true"] {
  background-color: var(--adlaire-surface-soft-strong);
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
}

.adlaire-wysiwyg-preview {
  padding: 24px;
  background-color: var(--adlaire-surface-card);
  border-top: 1px solid var(--adlaire-surface-border);
  color: var(--adlaire-surface-text-muted);
  line-height: 1.8;
}

.adlaire-wysiwyg-json-panel {
  overflow-x: auto;
  padding: 16px;
  background-color: var(--adlaire-status-dark);
  color: var(--adlaire-surface-card);
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
  line-height: 1.7;
}

.adlaire-wysiwyg-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--adlaire-surface-soft);
  border-top: 1px solid var(--adlaire-surface-border);
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.9rem;
}

.adlaire-wysiwyg-block-heading .adlaire-wysiwyg-block-content {
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
}

.adlaire-wysiwyg-block-paragraph .adlaire-wysiwyg-block-content {
  color: var(--adlaire-surface-text);
}

.adlaire-wysiwyg-block-list .adlaire-wysiwyg-block-content,
.adlaire-wysiwyg-block-checklist .adlaire-wysiwyg-block-content {
  padding-left: 18px;
}

.adlaire-wysiwyg-block-checklist input[type="checkbox"] {
  margin-right: 8px;
  accent-color: var(--adlaire-surface-accent);
}

.adlaire-wysiwyg-block-quote {
  border-left: 4px solid var(--adlaire-surface-accent);
}

.adlaire-wysiwyg-block-code {
  background-color: var(--adlaire-status-dark);
  color: var(--adlaire-surface-card);
}

.adlaire-wysiwyg-block-code .adlaire-wysiwyg-block-content {
  overflow-x: auto;
  font-family: "Courier New", monospace;
}

.adlaire-wysiwyg-block-image {
  background-color: var(--adlaire-surface-soft);
}

.adlaire-wysiwyg-block-image img {
  display: block;
  max-width: 100%;
  border-radius: var(--adlaire-radius-md);
}

.adlaire-wysiwyg-block-divider {
  min-height: 1px;
  padding: 0;
  background-color: var(--adlaire-surface-border);
}

.adlaire-wysiwyg-block-callout {
  background-color: var(--adlaire-alert-info-bg);
  border-color: var(--adlaire-alert-info-border);
  color: var(--adlaire-alert-info-text);
}

.adlaire-wysiwyg-block-label {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  padding: 6px 10px;
  background-color: var(--adlaire-surface-soft);
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
}

.adlaire-wysiwyg-block-progress {
  background-color: var(--adlaire-surface-soft);
}

.adlaire-wysiwyg-block-progress .adlaire-wysiwyg-block-content {
  display: grid;
  gap: 8px;
}

/* Editor UI state classes */
.adlaire-wysiwyg-block-hover,
.adlaire-wysiwyg-block-focused {
  border-color: var(--adlaire-surface-accent);
  box-shadow: var(--adlaire-shadow-focus-ring);
}

.adlaire-wysiwyg-block-dragging {
  border-color: var(--adlaire-surface-accent-strong);
  box-shadow: var(--adlaire-shadow-card-hover);
}

.adlaire-wysiwyg-block-drop-before::before,
.adlaire-wysiwyg-block-drop-after::after {
  position: absolute;
  right: 12px;
  left: 12px;
  height: 2px;
  background-color: var(--adlaire-surface-accent);
  content: "";
}

.adlaire-wysiwyg-block-drop-before::before {
  top: -7px;
}

.adlaire-wysiwyg-block-drop-after::after {
  bottom: -7px;
}

.adlaire-wysiwyg-block-empty {
  border-style: dashed;
  color: var(--adlaire-surface-text-subtle);
}

.adlaire-wysiwyg-block-readonly {
  background-color: var(--adlaire-status-gray-light);
}

.adlaire-wysiwyg-block-error {
  background-color: var(--adlaire-semantic-danger-bg);
  border-color: var(--adlaire-semantic-danger-color);
  box-shadow: var(--adlaire-semantic-focus-ring);
  color: var(--adlaire-semantic-danger-text);
}

.adlaire-wysiwyg-block-collapsed .adlaire-wysiwyg-block-content {
  max-height: 2.4em;
  overflow: hidden;
}

.adlaire-wysiwyg-block-inserter {
  display: inline-flex;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  background-color: var(--adlaire-surface-card);
  border: 1px dashed var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-accent);
  cursor: pointer;
}

.adlaire-wysiwyg-block-inserter:hover,
.adlaire-wysiwyg-block-inserter:focus-visible {
  background-color: var(--adlaire-surface-soft);
  border-color: var(--adlaire-surface-accent);
  box-shadow: var(--adlaire-shadow-focus-ring);
  outline: 0;
}

.adlaire-wysiwyg-mobile-bar {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background-color: var(--adlaire-surface-card);
  border-top: 1px solid var(--adlaire-surface-border);
  box-shadow: var(--adlaire-shadow-blue-sticky);
}

.adlaire-wysiwyg-mobile-action {
  display: inline-flex;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-text);
}

.adlaire-wysiwyg-mobile-action[aria-pressed="true"] {
  background-color: var(--adlaire-surface-soft);
  border-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent-strong);
}

.adlaire-wysiwyg-mobile-sheet {
  display: grid;
  gap: 0;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
  box-shadow: var(--adlaire-shadow-card-hover);
}

.adlaire-wysiwyg-mobile-sheet-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--adlaire-surface-border);
  font-weight: 700;
}

.adlaire-wysiwyg-mobile-sheet-body {
  display: grid;
  gap: 4px;
  padding: 8px;
}

.adlaire-wysiwyg-mobile-sheet-item {
  display: flex;
  min-height: 44px;
  align-items: center;
  padding: 10px 12px;
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
}

.adlaire-wysiwyg-mobile-sheet-item:hover,
.adlaire-wysiwyg-mobile-sheet-item[aria-selected="true"] {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent);
}

/* Priority B: editing support UI */
.adlaire-wysiwyg-block-toolbar,
.adlaire-wysiwyg-block-menu,
.adlaire-wysiwyg-transform-menu,
.adlaire-wysiwyg-style-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 8px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  box-shadow: var(--adlaire-shadow-card);
}

.adlaire-wysiwyg-block-menu,
.adlaire-wysiwyg-transform-menu,
.adlaire-wysiwyg-style-menu {
  align-items: stretch;
  flex-direction: column;
}

.adlaire-wysiwyg-block-menu [aria-selected="true"],
.adlaire-wysiwyg-transform-menu [aria-selected="true"],
.adlaire-wysiwyg-style-menu [aria-pressed="true"] {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent-strong);
}

.adlaire-wysiwyg-quick-insert {
  display: inline-flex;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  background-color: var(--adlaire-surface-card);
  border: 1px dashed var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  color: var(--adlaire-surface-accent);
  cursor: pointer;
}

.adlaire-wysiwyg-quick-insert:hover,
.adlaire-wysiwyg-quick-insert:focus-visible {
  background-color: var(--adlaire-surface-soft);
  border-color: var(--adlaire-surface-accent);
  box-shadow: var(--adlaire-shadow-focus-ring);
  outline: 0;
}

.adlaire-wysiwyg-outline,
.adlaire-wysiwyg-comment-panel,
.adlaire-wysiwyg-history-panel,
.adlaire-wysiwyg-publish-check {
  display: grid;
  gap: 8px;
  padding: 16px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-wysiwyg-comment-panel[aria-busy="true"],
.adlaire-wysiwyg-history-panel[aria-busy="true"],
.adlaire-wysiwyg-publish-check[aria-busy="true"] {
  background-color: var(--adlaire-surface-soft);
}

.adlaire-wysiwyg-outline-item {
  padding: 8px 10px;
  border-left: 3px solid transparent;
  color: var(--adlaire-surface-text-muted);
}

.adlaire-wysiwyg-outline-item[aria-current="true"] {
  border-left-color: var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
}

.adlaire-wysiwyg-current-block-indicator,
.adlaire-wysiwyg-sync-status {
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.875rem;
}

.adlaire-wysiwyg-sync-status[aria-live] {
  border-left: 3px solid var(--adlaire-surface-accent);
  padding-left: 8px;
}

.adlaire-wysiwyg-recent-blocks,
.adlaire-wysiwyg-suggested-blocks {
  display: grid;
  gap: 6px;
  padding: 10px;
  background-color: var(--adlaire-surface-soft);
  border-radius: var(--adlaire-radius-md);
}

/* Priority C: advanced support UI */
.adlaire-wysiwyg-assist-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: stretch;
  flex-direction: column;
  padding: 8px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
  box-shadow: var(--adlaire-shadow-card);
}

.adlaire-wysiwyg-assist-menu [aria-current="true"] {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent-strong);
}

.adlaire-wysiwyg-width-narrow {
  max-width: 640px;
}

.adlaire-wysiwyg-width-wide {
  max-width: 960px;
}

.adlaire-wysiwyg-width-full {
  width: 100%;
}

.adlaire-wysiwyg-block-group {
  display: grid;
  gap: 10px;
  padding: 12px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-lg);
}

.adlaire-wysiwyg-comment-marker {
  display: inline-flex;
  min-width: 24px;
  min-height: 24px;
  align-items: center;
  justify-content: center;
  background-color: var(--adlaire-surface-notice-soft);
  border: 1px solid var(--adlaire-surface-notice);
  border-radius: var(--adlaire-radius-round);
  color: var(--adlaire-surface-notice-text);
  font-size: 0.75rem;
  font-weight: 700;
}

.adlaire-wysiwyg-comment-marker[aria-current="true"] {
  box-shadow: var(--adlaire-shadow-marker-ring);
}

.adlaire-wysiwyg-suggestion,
.adlaire-wysiwyg-assist-suggestion {
  padding: 12px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-wysiwyg-suggestion[aria-selected="true"],
.adlaire-wysiwyg-assist-suggestion[aria-selected="true"] {
  border-color: var(--adlaire-surface-accent);
  box-shadow: var(--adlaire-shadow-blue-soft);
}

@media (prefers-reduced-motion: reduce) {
  .adlaire-wysiwyg-tool,
  .adlaire-wysiwyg-block,
  .adlaire-wysiwyg-slash-item,
  .adlaire-wysiwyg-block-inserter,
  .adlaire-wysiwyg-quick-insert {
    transition: none;
  }
}

@media (max-width: 768px) {
  .adlaire-wysiwyg-header,
  .adlaire-wysiwyg-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .adlaire-wysiwyg-canvas,
  .adlaire-wysiwyg-preview {
    padding: 18px;
  }
}

@media (max-width: 480px) {
  .adlaire-wysiwyg-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .adlaire-wysiwyg-toolbar-group {
    padding-right: 0;
    border-right: none;
  }

  .adlaire-wysiwyg-block {
    grid-template-columns: 1fr;
  }

  .adlaire-wysiwyg-mobile-bar {
    position: sticky;
    bottom: 0;
    z-index: var(--adlaire-z-sticky);
  }

  .adlaire-wysiwyg-mobile-sheet {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
}

/* Implemented editor feature extension UI */
.adlaire-wysiwyg-insert,
.adlaire-wysiwyg-insert-menu,
.adlaire-wysiwyg-transform,
.adlaire-wysiwyg-link-editor,
.adlaire-wysiwyg-comment-thread,
.adlaire-wysiwyg-stats,
.adlaire-wysiwyg-template-panel,
.adlaire-wysiwyg-shortcut-help,
.adlaire-wysiwyg-help-panel,
.adlaire-wysiwyg-diff,
.adlaire-wysiwyg-publish-check,
.adlaire-wysiwyg-a11y-panel,
.adlaire-wysiwyg-empty,
.adlaire-wysiwyg-alert,
.adlaire-wysiwyg-settings,
.adlaire-wysiwyg-minimap {
  display: grid;
  gap: 10px;
  padding: 12px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-wysiwyg-insert-item,
.adlaire-wysiwyg-block-type,
.adlaire-wysiwyg-inline-button,
.adlaire-wysiwyg-template-item,
.adlaire-wysiwyg-block-action,
.adlaire-wysiwyg-command-item,
.adlaire-wysiwyg-mobile-toolbar,
.adlaire-wysiwyg-check-item,
.adlaire-wysiwyg-empty-action,
.adlaire-wysiwyg-density-control,
.adlaire-wysiwyg-view-toggle {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 10px;
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-wysiwyg-insert-item:hover,
.adlaire-wysiwyg-block-type:hover,
.adlaire-wysiwyg-inline-button:hover,
.adlaire-wysiwyg-template-item:hover,
.adlaire-wysiwyg-block-action:hover,
.adlaire-wysiwyg-command-item:hover,
.adlaire-wysiwyg-command-active,
.adlaire-wysiwyg-inline-active {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent);
}

.adlaire-wysiwyg-reorder,
.adlaire-wysiwyg-drag-target,
.adlaire-wysiwyg-dragging,
.adlaire-wysiwyg-drag-handle {
  border-color: var(--adlaire-surface-accent);
}

.adlaire-wysiwyg-dragging {
  opacity: 0.72;
  box-shadow: var(--adlaire-shadow-card-hover);
}

.adlaire-wysiwyg-selection-toolbar,
.adlaire-wysiwyg-selection-count {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 10px;
  background-color: var(--adlaire-status-dark);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-card);
}

.adlaire-wysiwyg-link-preview {
  color: var(--adlaire-surface-accent);
  overflow-wrap: anywhere;
}

.adlaire-wysiwyg-link-error,
.adlaire-wysiwyg-status-error,
.adlaire-wysiwyg-check-warning,
.adlaire-wysiwyg-a11y-warning,
.adlaire-wysiwyg-alt-warning,
.adlaire-wysiwyg-warning {
  padding: 10px 12px;
  background-color: var(--adlaire-alert-warning-bg);
  border: 1px solid var(--adlaire-alert-warning-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-alert-warning-text);
}

.adlaire-wysiwyg-comment,
.adlaire-wysiwyg-comment-resolved {
  padding: 10px 12px;
  background-color: var(--adlaire-surface-soft);
  border-left: 4px solid var(--adlaire-surface-accent);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-wysiwyg-comment-resolved {
  opacity: 0.72;
}

.adlaire-wysiwyg-stat-item,
.adlaire-wysiwyg-outline-meta {
  color: var(--adlaire-surface-text-subtle);
  font-size: 0.875rem;
}

.adlaire-wysiwyg-heading-block,
.adlaire-wysiwyg-text-block,
.adlaire-wysiwyg-quote-block,
.adlaire-wysiwyg-list-block,
.adlaire-wysiwyg-media-block,
.adlaire-wysiwyg-image-block,
.adlaire-wysiwyg-video-block,
.adlaire-wysiwyg-file-block,
.adlaire-wysiwyg-table-block,
.adlaire-wysiwyg-code-block,
.adlaire-wysiwyg-callout-block,
.adlaire-wysiwyg-note-block,
.adlaire-wysiwyg-warning-block,
.adlaire-wysiwyg-divider-block,
.adlaire-wysiwyg-spacer-block,
.adlaire-wysiwyg-embed-block,
.adlaire-wysiwyg-reusable-block {
  padding: 12px;
  background-color: var(--adlaire-surface-card);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-md);
}

.adlaire-wysiwyg-quote-block {
  border-left: 4px solid var(--adlaire-surface-accent);
}

.adlaire-wysiwyg-code-block {
  overflow: auto;
  background-color: var(--adlaire-status-dark);
  color: var(--adlaire-surface-card);
  font-family: var(--adlaire-font-family-mono);
}

.adlaire-wysiwyg-code-language,
.adlaire-wysiwyg-code-copy,
.adlaire-wysiwyg-kbd {
  display: inline-flex;
  align-items: center;
  padding: 3px 6px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
  color: var(--adlaire-surface-text);
  font-family: var(--adlaire-font-family-mono);
  font-size: 0.75rem;
}

.adlaire-wysiwyg-table-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.adlaire-wysiwyg-table-cell-selected {
  outline: 2px solid var(--adlaire-surface-accent);
  outline-offset: -2px;
}

.adlaire-wysiwyg-divider-block {
  min-height: 1px;
  padding: 0;
  background-color: var(--adlaire-surface-border);
}

.adlaire-wysiwyg-spacer-block {
  min-height: 32px;
  background-color: var(--adlaire-surface-soft);
  border-style: dashed;
}

.adlaire-wysiwyg-status-saving,
.adlaire-wysiwyg-save-state,
.adlaire-wysiwyg-ai-loading {
  color: var(--adlaire-surface-text-subtle);
}

.adlaire-wysiwyg-readonly,
.adlaire-wysiwyg-disabled,
.adlaire-wysiwyg-locked {
  opacity: 0.78;
}

.adlaire-wysiwyg-disabled {
  pointer-events: none;
}

.adlaire-wysiwyg-diff-added {
  background-color: var(--adlaire-alert-success-bg);
}

.adlaire-wysiwyg-ai-entry,
.adlaire-wysiwyg-ai-suggestion {
  padding: 10px 12px;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-border);
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-wysiwyg-collaborator,
.adlaire-wysiwyg-remote-cursor,
.adlaire-wysiwyg-remote-selection {
  display: inline-flex;
  align-items: center;
  background-color: var(--adlaire-surface-soft);
  border: 1px solid var(--adlaire-surface-accent);
  color: var(--adlaire-surface-accent-strong);
}

.adlaire-wysiwyg-collaborator {
  gap: 6px;
  padding: 4px 8px;
  border-radius: var(--adlaire-radius-sm);
}

.adlaire-wysiwyg-remote-cursor {
  width: 2px;
  min-height: 1.2em;
}

.adlaire-wysiwyg-remote-selection {
  background-color: var(--adlaire-surface-soft-strong);
}

.adlaire-wysiwyg-empty-title {
  margin: 0;
  color: var(--adlaire-surface-accent-strong);
  font-weight: 700;
}

.adlaire-wysiwyg-outline-current {
  background-color: var(--adlaire-surface-soft);
  color: var(--adlaire-surface-accent);
}

.adlaire-wysiwyg- {
  display: contents;
}
` },
] as const;

export function ruleCssForPath(path: string): string | undefined {
  return RULE_FILES.find((file) => file.path === path)?.css;
}
