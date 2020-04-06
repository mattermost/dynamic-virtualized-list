export function isBrowserSafari() {
  const userAgent = window.navigator.userAgent;
  return (
    userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1
  );
}
