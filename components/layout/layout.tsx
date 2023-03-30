import React, { Fragment } from "react";

import MainNavigation from "./main-navigation";

function Layout(props: { children: React.ReactNode }) {
  return (
    <Fragment>
      <MainNavigation />
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;
