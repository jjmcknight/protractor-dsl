import { browser, ElementFinder, ElementArrayFinder, Locator } from "protractor";

/**
 *
 */
export abstract class Page {

    /**
     *
     * @param by
     */
    public element(by: Locator): ElementFinder {
        return browser.element(by);
    }

    /**
     *
     * @param by
     */
    public all(by: Locator): ElementArrayFinder {
        return browser.$("html").all(by);
    }
}

/**
 *
 */
export async function go<T extends Page>(pageOrUrl: {new(): T} | string): Promise<{}> {

    if (typeof(pageOrUrl) === "string") {
        browser.get(pageOrUrl);
        return null;
    } else {
        return await browser.get(pageOrUrl.prototype.constructor.url);
    }
}

/**
 *
 */
export async function at<T extends Page>(page: {new(): T}): Promise<T> {
    if (await isAt(page)) {
        return new page();
    }
    return null;
}

/**
 *
 */
export async function isAt<T extends Page>(page: {new(): T}): Promise<boolean> {
    return await page.prototype.constructor.at();
}

/**
 *
 */
export async function to<T extends Page>(page: {new(): T}): Promise<T> {
    await go(page);
    return await at(page);
}

/**
 *
 */
export async function via<T extends Page>(page: {new(): T}): Promise<T> {
    await go(page);
    return new page();
}
