export * from "../dl/IDistributionListPage";

// DL basic elements: page with DL lists
export const createDlButton: string = ".create-new-list-btn";
export const headerDLList: string = "//*[@data-test-id='L5kazWLrVk']";
// DL: create new DL modal
export const distributionListsModal: string = ".distribution-lists-modal";
export const addMembersButtonModal: string = "//button[contains(@class, 'add-members-button')]";
export const cancelButtonModal: string = "//button[contains(@class, 'cancel-button')]";
export const editGroupButton: string = "//button[@class='edit-list-btn'][.='Edit Group']";
export const listNameInput: string = "//input[contains(@class, 'list-name-input')]";
// Member List
export const searchBarInputMemberList: string = "#members-search";
export const resetSearchButtonMemberList: string = "//*[@class='members-search']/*[@class='reset-input-icon']";
export const loaderMemberList: string = "//*[@class='-loading -active']/*[.='Loading...']";
export const saveButtonMemberList: string = "//*[contains(@class,'update-list-button')][.='Save the group']";
// Messages
export const warningMessageMemberList: string = ".warning-text.warning-text-block.info-text";
export const errorMessageMemberList: string = ".ds-feedback-type-error";
// Deletion
export const wantToDeletButtonModal: string = "//label[@for='want-to-delete']";
export const deletButtonModal: string = ".delete-list-button";
export const acknowledgeDeletButtonModal: string = "//label[@for='acknowledge-delete']";
