# protractor-dsl

Domain specific language wrapper of Protractor

## Overview

`protractor-dsl` establishes a set of conventions developers can follow when writing UI automation code.  Following the conventions allows for the use of a Domain Specific Language (DSL) type of coding style, which provides an abstraction over protractor and ultimately makes UI tests easier to read and less flakey.

## Page Object Class Overiew

Page objects can represent either a single DOM element or a collection of elements contained under a single parent element.

### Defining a Page Object Class

A page object class ultimately inherits from the abstract PageObject class.  If the page object can be located in a standard way, then define a default static `locator` of type `Locator` with public scope.  Additionally, if Locators need to be parameterized, functions can be defined that return a `Locator`.

Example:

```TypeScript
import { ElementFinder, by, Locator } from "protractor";
import { PageObject } from "protractor-dsl";

export class UnorderedList extends PageObject {

    public static locator: Locator = by.tagName("ul");

    public static ByText(text: string): Locator {
        return by.cssContainingText("ul", text);
    }
}
```

### Locating a Page Object

`protractor-dsl` provides several functions for locating single page objects, an array of page objects, and page objects that are dynamically renderred.  These functions offer a lot of flexibility to the developer, because they provide the ability to locate Page Objects using their default locator or any custom locator.  As well as the ability to locate page objects from the default context (entire DOM tree), or from a specific context.

#### Find a Page Object using the *default* locator

```TypeScript
const ul: UnorderedList = find(UnorderedList);
```

#### Find a Page Object using a *parameterized* locator

```TypeScript
const ul: UnorderedList = find(UnorderedList, UnorderedList.ByText("My list"));
```

#### Find a Page Object using any *custom* locator

```TypeScript
const ul: UnorderedList = find(UnorderedList, by.css("ul.my-list"));
```

The examples above all find page objects from the context of the entire browser DOM tree.  Meaning that if multiple page objects exist in the tree, the only the first instance of the page object will be returned.  If a different page object (not the first instance) needs to be located, then a *context* parameter can be passed into the `find` function.

#### Find a Page Object from the *context* of another Page Object using the default locator

```TypeScript
const panel: Panel = find(Panel);
const ul: UnorderedList = find(UnorderedList, panel);
```

#### Find a Page Object from the *context* of another Page Object using a custom locator

```TypeScript
const panel: Panel = find(Panel);
const ul: UnorderedList = find(UnorderedList, by.css("ul.my-list"), panel);
```

#### Find a Page Object that is *rendered dynamically*

```TypeScript
const ul: UnorderedList = await findWait(UnorderedList);
```

By default the `findWait` function will wait up to 10 seconds for the Page Object to appear.  The wait time can be configured though by passing additional parameters to the function.

#### Find a Page Object that is *rendered dynamically* and waiting for a specific amount of time

```TypeScript
const ul: UnorderedList = await findWait(UnorderedList, UnorderedList.locator, browser, 20000);     // waits up to 20 seconds for the UnorderedList page object to exist in the DOM
```

If there are multiple Page Objects that exist on the page, they can be located using a function that returns them in an array.

#### Find an *array* of Page Objects using the default locator

```TypeScript
const uls: UnorderedList[] = await findAll(UnorderedList);
```

If there are multiple Page Objects that exist on the page and only one needs to be found, it can be located with an index using a different function.

#### Find the *n-th* Page Object in the page

```TypeScript
const ul: UnorderedList = await findAt(UnorderedList, UnorderedList.locator, browser, 3);   // locates the 4th UnorderedList Page Object in the DOM
```

Additional functions exist for locating Page Objects that are *visible* on the page (opposed to existing in the DOM, but not visible).

#### Find a single Page Object that is *rendered visible* dynamically

```TypeScript
const ul: UnorderedList = await findWaitForVisible(UnorderedList);
```

#### Find all PageObjects that are *visible*

```TypeScript
const ul: UnorderedList[] = await findAllVisible(UnorderedList);
```

## Page Class Overview

Pages can represent either a static HTML page bound to a particular URL, or a single page that is dynamically rendered and not bound to a particular URL (for example, a Facebook profile page).

### Defining a Page Class

A page class ultimately inherits from the abstract Page class.  If the page can be navigated to in a standard way, then define a default static `url` variable of type `URL` with public scope.  If the page class can be reused by multiple URLs, you can parameterized the URL by defining a function that returns an instance of `URL`.

#### Example page class

```TypeScript
export FacebookProfile extends Page {

    public static url: URL: new URL("https://www.facebook.com/profile");

    public static ByIdUrl(id: string): URL {
        return new URL(`https://www.facebook.com/profile/${id}`);
    }
}
```

In order to utilize Page DSL functions, also define an `at` function where custom code can be written to determine if a browser is currently navigated to the particular page, for example:

```TypeScript
public static async at(): Promise<boolean> {
    const url = await browser.getCurrentUrl();
    return url.endsWith("/settings");
}
```

### Page Object class structure overview

TODO...

### Page Navigation

`protractor-dsl` provides several functions for navigating between pages, checking if the browser is currently on a page, and handling page redirects.  To navigate the browser to a page, use the `go` function.

#### Go to a Page using its default URL

```TypeScript
await go(FacebookProfile);  // doesn't return anything
```

#### Go to a Page using a parameterized URL

```TypeScript
await go(FacebookProfile, FacebookProfile.ByIdUrl("jsmith"));
```

#### Go to a Page using custom URL

```TypeScript
await go("https://www.facebook.com");
```

It is often good practice to perform a check that the browser is actually located on the expected page, after the browser has been directed to a particular URL.  The `to` function does this by first navigating to the Page's URL, then performing a check by executing the Page's `at` function, then returns an instance of the Page.

#### Navigate to a Page using the *default* URL, then verify the browser is pointing to it

```TypeScript
const profilePage: FacebookProfile = await to(FacebookProfile);
```

To only check that the browser is located on the expected page (without performing any navigation), the `at` function can be used.

#### Verify the browser is pointing to the expected Page

```TypeScript
const profilePage: FacebookProfile = await at(FacebookProfile);
```

The same check can be performed using the `isAt` function, but instead of returning an instance of a Page it returns `true` or `false`.

#### Verify the browser is pointing to the expected Page (return `boolean`)

```TypeScript
const isAtProfilePage: boolean = await isAt(FacebookProfile);
```

If a URL redirects the browser to another URL, then you may not want to perform the 'at' check after navigating the browser (although you may still want to return an instance of the Page).  To handle this case, you can use the `via` function.

#### Navigate to the Page using the *default* URL, but do not perform the 'at' check

```TypeScript
const login: Landing = await via(Landing);  // user is not signed in, should be redirected to the Landing page
```

### Page class structure overview

TODO...

## Waiting for dynamic elements or conditions

TODO...

## Examples

TODO...

## Feedback

TODO...