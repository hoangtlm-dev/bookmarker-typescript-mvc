/**
 * Creates a new HTML element with the specified tag and optional class names.
 *
 * @param tag - an HTML tag name for the element to be created (e.g., 'div', 'span').
 * @param classNames - optional string containing class names separated by spaces to be added to the element.
 * @returns an HTMLElement.
 */
export const createElement = <T extends HTMLElement>(tag: string, classNames?: string): T => {
  const element = document.createElement(tag) as T;
  if (classNames) {
    element.classList.add(...classNames.split(' '));
  }
  return element;
};

/**
 * Retrieves all HTML elements that match the specified CSS selector.
 *
 * @param selector - a string containing a CSS selector to match.
 * @returns the first HTMLElement that matches the selector, or null if no elements match.
 */
export const getElement = <T extends HTMLElement>(selector: string): T => {
  const element = document.querySelector(selector) as T;
  return element;
};

/**
 * Retrieves all HTML elements that match the specified CSS selector.
 *
 * @param selector - a string containing a CSS selector to match.
 * @returns - a nodelist of HTMLElement containing all elements that match the selector.
 */
export const getElements = <T extends HTMLElement>(selector: string): NodeListOf<T> => {
  const elements = document.querySelectorAll(selector) as NodeListOf<T>;
  return elements;
};

/**
 * Removes all child nodes from the specified HTML element.
 *
 * This function iterates over all child nodes of the given HTML element and removes them one by one.
 * It's a utility function that ensures the specified element is emptied of all its content.
 *
 * @param {HTMLElement} element - The HTML element from which all child nodes will be removed.
 *
 * @example
 * // Assuming there is a <div id="myDiv"><p>Paragraph</p><span>Span</span></div> in the HTML document
 * const myDiv = document.getElementById('myDiv');
 * removeChildNodes(myDiv);
 * // Now, <div id="myDiv"></div> will be empty.
 */
export const removeChildNodes = (element: HTMLElement) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

/**
 * Removes existing HTML elements from the DOM
 *
 * @param parentElement - HTML element
 * @param childElementSelector - HTMLElement
 */
export const removeDOMElement = (parentElement: HTMLElement, childElement: HTMLElement) => {
  parentElement.removeChild(childElement);
};

/**
 * Removes existing HTML elements from the DOM
 *
 * @param parentElement - HTML element
 * @param childElementSelector - selector of the child element
 */
export const removeDOMElementBySelector = (parentElement: HTMLElement, childElementSelector: string) => {
  const existingElement = getElement(childElementSelector);
  if (existingElement) parentElement.removeChild(existingElement);
};

export const updateDOMElement = (parentElement: HTMLElement, childElement: HTMLElement) => {
  parentElement.appendChild(childElement);
};
