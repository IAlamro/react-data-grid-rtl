// @ts-expect-error
window.ResizeObserver ??= function ResizeObserver(callback: () => void) {
  callback();

  return {
    observe() {},
    disconnect() {}
  };
};

// patch clientWidth/clientHeight to pretend we're rendering DataGrid at 1080p
Object.defineProperties(HTMLDivElement.prototype, {
  clientWidth: {
    get(this: HTMLDivElement) {
      return this.classList.contains('rdg') ? 1920 : 0;
    }
  },
  clientHeight: {
    get(this: HTMLDivElement) {
      return this.classList.contains('rdg') ? 1080 : 0;
    }
  }
});

// Basic scroll polyfill
const scrollStates = new WeakMap<Element, { scrollTop: number; scrollRight: number }>();

function getScrollState(div: Element) {
  if (scrollStates.has(div)) {
    return scrollStates.get(div)!;
  }
  const scrollState = { scrollTop: 0, scrollRight: 0 };
  scrollStates.set(div, scrollState);
  return scrollState;
}

Object.defineProperties(Element.prototype, {
  scrollTop: {
    get(this: Element) {
      return getScrollState(this).scrollTop;
    },
    set(this: Element, value: number) {
      getScrollState(this).scrollTop = value;
      this.dispatchEvent(new Event('scroll'));
    }
  },
  scrollRight: {
    get(this: Element) {
      return getScrollState(this).scrollRight;
    },
    set(this: Element, value: number) {
      getScrollState(this).scrollRight = value;
      this.dispatchEvent(new Event('scroll'));
    }
  }
});
