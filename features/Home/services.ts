/**
 * Checks if the given href matches the current pathname
 * @param pathname The current path from usePathname()
 * @param href The link href to compare against
 * @returns True if the href matches the current path
 */
export const isActivePath = (pathname: string, href: string): boolean => {
  // Exact match for homepage
  if (href === "/" && pathname === "/") {
    return true;
  }

  // For other pages, check if pathname starts with href
  // This handles both exact matches and child routes
  return href !== "/" && pathname.startsWith(href);
};
