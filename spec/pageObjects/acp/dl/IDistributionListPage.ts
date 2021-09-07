export * from "../dl/IDistributionListPage";

// DL basic elements: page with DL lists
export const createDlButton: string = ".create-new-list-btn";
export const headerDLList: string = "//*[@data-test-id='L5kazWLrVk']";
// DL: create new DL modal
export const distributionListsModal: string = ".distribution-lists-modal";
export const addMembersButtonModal: string = "//button[contains(@class, 'add-members-button')]";
// Member List
export const searchBarInputMemberList: string = "#members-search";
export const resetSearchButtonMemberList: string = "//*[@class='members-search']/*[@class='reset-input-icon']";
export const loaderMemberList: string = "//*[@class='-loading -active']/*[.='Loading...']";
export const saveButtonMemberList: string = "//*[contains(@class,'update-list-button')][.='Save the list']";
export const warningMessageMemberList: string = ".warning-text.warning-text-block.info-text";
