export * from "./Page";
export * from "./PageObject";
export * from "./Wait";
export * from "./Conditions";

import { ElementFinder, ElementArrayFinder, Locator } from "protractor";
export type SearchContext = { element(by: Locator): ElementFinder; all?(by: Locator): ElementArrayFinder };
