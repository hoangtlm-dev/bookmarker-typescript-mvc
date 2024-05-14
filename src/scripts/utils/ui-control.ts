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
export const getElement = <T extends HTMLElement>(selector: string): T | null => {
  const element = document.querySelector(selector) as T | null;
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
