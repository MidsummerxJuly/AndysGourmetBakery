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
      >
        <div className="sheetHandleRow">
          <button
            className="sheetClose"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="sheetContent">
          <h3 className="sheetTitle">Menu</h3>

          <nav className="sheetNav">
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
          className={`fab ${open ? "isOpen" : "isClose"}`}
          onClick={() => setOpen(true)}
        >
          ☰ Menu
        </button>
      </div>
    </>
  );
}