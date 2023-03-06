export const removeLogOnProd = () => {
  function noop() {
    // This is intentional
  }

  if (process.env.NODE_ENV !== "development") {
    console.log = noop;
    console.warn = noop;
    console.error = noop;
  }
};
