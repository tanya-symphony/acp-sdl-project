export * from "../create_account/ICreateAccountPage";

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
