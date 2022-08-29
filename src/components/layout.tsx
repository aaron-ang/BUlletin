import Header from "./header";
import Footer from "./footer";
import React from "react";

export default function Layout(children: React.ReactNode) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
