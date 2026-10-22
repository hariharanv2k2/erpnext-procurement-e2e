// Centralized selectors for the entire ERPNext E2E suite.
// Every CSS selector lives here — pages and helpers only reference these constants.

// --- Login Page ---
export const LOGIN = {
  emailInput: '#login_email, input[autocomplete="username"]',
  passwordInput: '#login_password, input[autocomplete="current-password"]',
  submitBtn: '.btn-login, .btn-primary[type="submit"], button:has-text("Continue"), button:has-text("Login")',
} as const;

// --- Page Layout ---
export const PAGE = {
  container: '.page-container',
} as const;

// --- Form Controls ---
export const FIELD = {
  container: (fieldname: string) => `[data-fieldname="${fieldname}"]`,
  inputOrTextarea: '.control-input input, .control-input textarea',
} as const;

// --- Buttons / Actions ---
export const BUTTON = {
  submit: '.page-head [data-label="Submit"]:not(.hide)',
  cancel: '.page-actions .btn:has-text("Cancel"), .standard-actions .btn:has-text("Cancel")',
  amend: '.page-actions .btn:has-text("Amend"), .standard-actions .btn:has-text("Amend")',
  create: '.page-actions .btn:has-text("Create"), .standard-actions .btn:has-text("Create")',
  dropdownItem: (label: string) => `.dropdown-item:has-text("${label}")`,
} as const;

// --- Dialog / Modal ---
export const DIALOG = {
  visible: '.modal.show',
  primaryBtn: '.btn-primary, .btn-primary-dark',
  closeBtn: '.btn-modal-close, .close, [data-dismiss="modal"]',
} as const;

// --- Toasts / Messages ---
export const MESSAGE = {
  error: '.msgprint-dialog, .modal.show .alert-danger, .indicator-pill.red',
  errorDialog: '.msgprint-dialog.modal.show, .modal.show',
} as const;

// --- List View ---
export const LIST = {
  rowByName: (name: string) => `.list-row:has-text("${name}")`,
} as const;
