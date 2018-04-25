import { ExpectedConditions } from "protractor";
import { PageObject } from "./PageObject";

/**
 *
 */
export function present<T extends PageObject>(pageObject: T): Function {
    return ExpectedConditions.presenceOf(pageObject.root);
}

/**
 *
 */
export function notPresent<T extends PageObject>(pageObject: T): Function {
    return ExpectedConditions.not(ExpectedConditions.presenceOf(pageObject.root));
}

/**
 *
 */
export function visible<T extends PageObject>(pageObject: T): Function {
    return ExpectedConditions.visibilityOf(pageObject.root);
}

/**
 *
 */
export function clickable<T extends PageObject>(pageObject: T): Function {
    return ExpectedConditions.elementToBeClickable(pageObject.root);
}
