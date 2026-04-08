export const getCurrentPath = (): string => window.location.pathname;

export const navigateTo = (path: string): void => {
  history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};
