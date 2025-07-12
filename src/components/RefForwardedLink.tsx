import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";

const RefForwardedLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, ...props }, ref) => (
    <Link ref={ref} {...props}>
      {children}
    </Link>
  )
);

RefForwardedLink.displayName = "RefForwardedLink";

export default RefForwardedLink;
