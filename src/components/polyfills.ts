function polyfillForWagmi() {
    const noop = (() => {}) as any;
  
    window.addEventListener = noop;
    window.dispatchEvent = noop;
    window.removeEventListener = noop;
    window.CustomEvent = function CustomEvent() {
      return {};
    } as any;
}
polyfillForWagmi();