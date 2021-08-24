export * from "../create_account/ICreateAccountPage";

// Browse Accounts page
export const headerGenericPage: string = ".page-title";
export const filtersContainer: string = ".browse-accounts__filters";
// Update Account
export const updateProfileButton: string = "#profile-submit";
export const searchInput: string = "#search-entities";
export const changeStatusButton: string = "#account-status-btn";
export const resetPasswordButton: string = "#reset-pwsd-btn";
export const assignNewPasswordMenuItem: string = "//*[text()='Assign new password']";
export const modalContainer: string = ".modal-container";
export const newAssignedPasswordInput: string = "#new-assigned-password";
export const submitModalButton: string = ".submit.button-blue";
export const notificationPasswordChangeLabel: string = "//*[@class='confirmation'][contains(text(),'User must be notified of the new password as the old password')]";

// Create Account page
export const headerCAPage: string = "//*[@data-test-id='L5kazWLrVk']";
export const createAccountButton: string = "#create-user-submit";
// Create form
export const usernameInput: string = "//input[@name='username']";
export const firstNameInput: string = "//input[@name='firstName']";
export const surnameInput: string = "//input[@name='surname']";
export const prettyNameInput: string = "//input[@name='prettyName']";
export const emailAddressInput: string = "//input[@name='emailAddress']";
export const dlRoleLabel: string = "//label[@for='DISTRIBUTION_LIST_MANAGER']";
export const dlRoleCheckbox: string = "#DISTRIBUTION_LIST_MANAGER";
// Password setup
export const setManuallyPasswordRadioButton: string = "//label[@for='pw-manual']";
export const passwordInput: string = "#pw-manual-input";
export const userCreatedMessageLabel: string = "//*[@class='feedback-message'][contains(text(),'The end user was successfully created!')]";
export const userUpdatedMessageLabel: string = "//*[@class='feedback-message'][contains(text(),'You have successfully updated this user!')]";
