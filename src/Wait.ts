import { browser, promise, until } from "protractor";
import { present, notPresent, visible, clickable } from "./Conditions";
import { PageObject } from "./PageObject";
import { Page } from "./Page";

/**
 *
 */
export async function waitUntil(condition: Function | promise.Promise<{}> | until.Condition<{}>, timeout: number = 30000,
                                message?: string): Promise<{}> {
    return await browser.wait(condition, timeout, message);
}

/**
 *
 */
export async function waitFor<T extends PageObject>(pageObject: T, timeout: number = 10000): Promise<T> {
    await browser.wait(present(pageObject), timeout);
    return pageObject;
}

/**
 *
 */
export async function waitForNotPresent<T extends PageObject>(pageObject: T, timeout: number = 10000): Promise<boolean> {
    await browser.wait(notPresent(pageObject), timeout);
    return true;    // if the page object is present, then the above statement should throw an exception
}

/**
 *
 */
export async function waitForVisible<T extends PageObject>(pageObject: T, timeout: number = 10000): Promise<T> {
    await browser.wait(visible(pageObject), timeout);
    return pageObject;
}

/**
 *
 */
export async function waitForClickable<T extends PageObject>(pageObject: T, timeout: number = 10000): Promise<T> {
    await browser.wait(clickable(pageObject), timeout);
    return pageObject;
}

/**
 *
 */
export async function waitUntilAt<T extends Page>(page: {new(): T}, timeout: number = 10000): Promise<T> {
    await waitUntil(page.prototype.constructor.at, timeout);
    return new page();
}
