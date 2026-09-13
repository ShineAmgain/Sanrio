import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router doesn't reset scroll position on navigation the way a
 * normal full-page load does — without this, moving from a page you've
 * scrolled down on to a new page leaves the new page scrolled to the
 * same spot instead of starting at the top.
 *
 * Mounted once inside <BrowserRouter>; it has no visual output.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
