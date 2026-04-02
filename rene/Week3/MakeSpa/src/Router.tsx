import {
  Children,
  type FC,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { LinkProps, RouteProps, RoutesProps } from './types.ts';
import { getCurrentPath, navigateTo } from './utils';

const useCurrentPath = (): string => {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return currentPath;
};

const isRouteElement = (child: ReactNode): child is ReactElement<RouteProps> => {
  return isValidElement(child) && child.type === Route;
};

export const Link = ({ to, children }: LinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (getCurrentPath() === to) return;
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

export const Route = ({ component: Component }: RouteProps) => {
  return <Component />;
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();
  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute);
};