import Header from "./header";
import Footer from "./footer";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Header />
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  );
}
