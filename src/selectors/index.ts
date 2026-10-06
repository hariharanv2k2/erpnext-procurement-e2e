// Centralized selectors for the entire ERPNext E2E suite.
// Every CSS selector lives here — pages and helpers only reference these constants.

// --- Login Page ---
export const LOGIN = {
  emailInput: '#login_email, input[autocomplete="username"]',
  passwordInput: '#login_password, input[autocomplete="current-password"]',
  submitBtn: '.btn-login, .btn-primary[type="submit"], button:has-text("Continue"), button:has-text("Login")',
  loginError: '.login-error, .alert-danger, :has-text("Invalid credentials")',
} as const;

// --- Page Layout / Loading ---
export const PAGE = {
  container: '.page-container',
  loader: '.freeze-message-container, .loading-state',
  formPage: '[data-page-container="true"], .form-layout, .frappe-form',
} as const;

// --- Form Controls ---
// Use field(fieldname) to build dynamic selectors for a specific field
export const FIELD = {
  container: (fieldname: string) => `[data-fieldname="${fieldname}"]`,
  input: '.control-input input',
  textarea: '.control-input textarea',
  inputOrTextarea: '.control-input input, .control-input textarea',
  select: '.control-input select',
  allInputs: '.control-input input, .control-input textarea, .control-input select',
  checkbox: '.control-input input[type="checkbox"]',
  quillEditor: '.ql-editor',
} as const;

// --- Link Field Autocomplete ---
export const LINK_DROPDOWN = {
  // Frappe v16 uses custom dropdown, older versions use awesomplete
  item: '.frappe-link-selector .link-option, .awesomplete ul[role="listbox"] li, [data-doctype] .link-field .result, .frappe-control .link-btn .dropdown-menu li',
  resultItem: '.link-selectable, .awesomplete ul li',
  // Frappe v16 link results container
  linkResults: '.frappe-link-selector, .awesomplete',
} as const;

// --- Child Table (Grid) ---
export const GRID = {
  addRowBtn: '.grid-add-row',
  addRowBtnAlt: 'button:has-text("Add Row"), .grid-footer .btn-xs',
  rows: '.rows .grid-row',
  openFormRow: '.grid-row.grid-form-open, .row-index:last-child',
} as const;

// --- Indicators ---
export const INDICATOR = {
  pill: '.indicator-pill',
  colored: (color: string) => `.indicator-pill.${color}`,
} as const;

// --- Buttons / Actions ---
export const BUTTON = {
  submit: '.page-head [data-label="Submit"]:not(.hide)',
  save: '.page-head [data-label="Save"]:not(.hide)',
  cancel: '.page-actions .btn:has-text("Cancel"), .standard-actions .btn:has-text("Cancel")',
  amend: '.page-actions .btn:has-text("Amend"), .standard-actions .btn:has-text("Amend")',
  close: '.page-actions .btn:has-text("Close"), .standard-actions .btn:has-text("Close")',
  stop: '.page-actions .btn:has-text("Stop"), .standard-actions .btn:has-text("Stop")',
  create: '.page-actions .btn:has-text("Create"), .standard-actions .btn:has-text("Create")',
  menuToggle: '.menu-btn-group .btn, .actions-btn-group .btn, .page-actions .btn.btn-default.icon-btn',
  dropdownItem: (label: string) => `.dropdown-item:has-text("${label}")`,
} as const;

// --- Dialog / Modal ---
export const DIALOG = {
  visible: '.modal.show',
  primaryBtn: '.btn-primary, .btn-primary-dark',
  secondaryBtn: '.btn-secondary, .btn-default',
  closeBtn: '.btn-modal-close, .close, [data-dismiss="modal"]',
  fieldInput: (fieldname: string) =>
    `[data-fieldname="${fieldname}"] input, [data-fieldname="${fieldname}"] textarea`,
  fieldSelect: (fieldname: string) => `[data-fieldname="${fieldname}"] select`,
} as const;

// --- Toasts / Messages ---
export const MESSAGE = {
  success: '.msgprint-dialog .msgprint, .page-container .alert-message, .green-toast, .toast-message',
  error: '.msgprint-dialog, .modal.show .alert-danger, .indicator-pill.red',
  errorDialog: '.msgprint-dialog.modal.show, .modal.show',
} as const;

// --- List View ---
export const LIST = {
  searchInput: '.frappe-control[data-fieldname="name"] input, .search-bar input, input[data-fieldname="name"]',
  row: '.list-row:not(.list-row-head)',
  firstRowLink: '.list-row .list-row--col .level-left .list-row-col a, .result .list-row a.ellipsis',
  rowByName: (name: string) => `.list-row:has-text("${name}")`,
  rowLink: (name: string) => `.list-row a:has-text("${name}")`,
  noResult: '.no-result, .text-muted:has-text("No")',
} as const;

// --- Page Title ---
export const TITLE = {
  text: '.title-text, #title_area .title-text',
} as const;
