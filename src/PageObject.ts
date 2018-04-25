import { browser, ElementFinder, ElementArrayFinder, ProtractorBrowser, Locator } from "protractor";
import { waitFor, waitForVisible } from "./Wait";
import { SearchContext } from "./index";

/**
 *
 */
export abstract class PageObject {

    public root: ElementFinder;

    constructor(elm: ElementFinder) {
        this.root = elm;
    }

    /**
     *
     * @param by
     */
    public element(by: Locator): ElementFinder {
        return this.root.element(by);
    }

    /**
     *
     * @param by
     */
    public all(by: Locator): ElementArrayFinder {
        if (this.root instanceof ProtractorBrowser) {
            throw new Error("unsupported operation: function 'all' doesn't exist in ProtractorBrowser");
        } else {
            return this.root.all(by);
        }
    }
}

/**
 *
 * @param by
 * @param cls
 * @param context
 */
export function find<T extends PageObject>(cls: {new(aRoot: ElementFinder): T}, by?: Locator | SearchContext,
                                           context: SearchContext = browser): T {
    [by, context] = checkParams(cls, by, context);
    return new cls(context.element(by));
}

/**
 * 
 * @param cls 
 */
export function findAt<T extends PageObject>(cls: {new(aRoot: ElementFinder): T}, by?: Locator | SearchContext,
                                             context: SearchContext = browser, index: number = 0): T {
    [by, context] = checkParams(cls, by, context);
    return new cls(context.all(by).get(index));
}

/**
 *
 * @param by
 * @param cls
 * @param context
 */
export async function findWait<T extends PageObject>(cls: {new(aRoot: ElementFinder): T}, by?: Locator | SearchContext,
                                                     context: SearchContext = browser, timeout: number = 10000): Promise<T> {
    [by, context] = checkParams(cls, by, context);
    return await waitFor(new cls(context.element(by)), timeout);
}

/**
 *
 * @param by
 * @param cls
 * @param context
 */
export async function findWaitForVisible<T extends PageObject>(cls: {new(aRoot: ElementFinder): T}, by?: Locator | SearchContext,
                                                               context: SearchContext = browser, timeout: number = 10000): Promise<T> {
    [by, context] = checkParams(cls, by, context);
    return await waitForVisible(new cls(context.element(by)), timeout);
}

/**
 * 
 * @param cls 
 * @param by 
 * @param context 
 */
export async function findAll<T extends PageObject>(cls: {new(aRoot: ElementFinder): T}, by?: Locator | SearchContext,
                                                    context: SearchContext = browser): Promise<T[]> {
    [by, context] = checkParams(cls, by, context);
    const elementFinders: ElementFinder[] = await context.all(by).asElementFinders_();
    let pageObjectArray: T[] = [];
    for (let elm of elementFinders) {
        pageObjectArray.push(new cls(elm));
    }
    return pageObjectArray;
}

/**
 * 
 * @param cls 
 * @param by 
 * @param context 
 */
export async function findAllVisible<T extends PageObject>(cls: {new(aRoot: ElementFinder): T}, by?: Locator | SearchContext,
                                                           context: SearchContext = browser): Promise<T[]> {
    [by, context] = checkParams(cls, by, context);
    const elementFinders: ElementFinder[] = await context.all(by).asElementFinders_();
    let pageObjectArray: T[] = [];
    for (let elm of elementFinders) {
        if (await elm.isDisplayed()) {
            pageObjectArray.push(new cls(elm));
        }
    }
    return pageObjectArray;
}

function checkParams<T>(cls: {new(aRoot: ElementFinder): T}, by?: Locator | SearchContext,
                        context: SearchContext = browser): [Locator, SearchContext] {

    if (!by) {
        by = cls.prototype.constructor.locator;
    }

    if (by.hasOwnProperty("root")) {
        context = <SearchContext>by;
        by = cls.prototype.constructor.locator;
    }

    return [by, context];
}
