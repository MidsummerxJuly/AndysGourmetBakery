"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BottomSheetNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <div
        className={`sheetBackdrop ${open ? "isOpen" : ""} buttonFont`}
        onClick={closeMenu}
        aria-hidden={!open}
      />

      <div
        className={`bottomSheet ${open ? "isOpen" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!open}
      >
        <div className="sheetHandleRow">
          <button
            type="button"
            className="sheetClose"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="sheetContent">
          <h3 className="sheetTitle">Menu</h3>

          <nav id="site-navigation" className="sheetNav">
            <Link className="sheetItem" href="/" onClick={closeMenu}>
              Home
            </Link>

            <Link className="sheetItem" href="/services" onClick={closeMenu}>
              Order
            </Link>

            <Link className="sheetItem" href="/gallery" onClick={closeMenu}>
              Gallery
            </Link>

            <Link className="sheetItem" href="/contact" onClick={closeMenu}>
              Contact
            </Link>

            <Link className="sheetItem" href="/policies" onClick={closeMenu}>
              Policies
            </Link>
          </nav>
        </div>
      </div>

      <div className="fabWrapper">
        <button
          type="button"
          className={`fab ${open ? "isOpen" : "isClose"}`}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-navigation"
        >
          ☰ Menu
        </button>
      </div>
    </>
  );
}
