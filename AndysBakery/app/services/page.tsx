"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import BottomSheetNav from "../components/BottomSheetNav";
import { useCart } from "../context/cartContext";
import { useLanguage } from "../context/LanguageContext";
import pageCSS from "./page.module.css";
import servicesCSS from "./services.module.css";

type MenuSize = {
  id: number;
  sizeName: string;
  displaySize: string;
  price: number;
  serves: string;
  sortOrder: number;
};

type MenuItem = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  note: string | null;
  isCallOnly: boolean;
  sortOrder: number;
  sizes: MenuSize[];
};

type MenuCategory = {
  id: number;
  name: string;
  sortOrder: number;
  items: MenuItem[];
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function Services() {
  const { t } = useLanguage();
  const { cart, addToCart } = useCart();
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState("");
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, MenuSize>>(
    {}
  );
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMenu() {
      try {
        setMenuLoading(true);
        setMenuError("");

        const response = await fetch("/api/menu", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Menu request failed with status ${response.status}.`);
        }

        const data: unknown = await response.json();
        setMenu(Array.isArray(data) ? (data as MenuCategory[]) : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Unable to load the bakery menu.", error);
        setMenuError("The menu could not be loaded. Please try again later.");
      } finally {
        if (!controller.signal.aborted) {
          setMenuLoading(false);
        }
      }
    }

    loadMenu();
    return () => controller.abort();
  }, []);

  function updateQuantity(itemId: number, quantity: number) {
    setQuantities((current) => ({
      ...current,
      [itemId]: Math.max(1, Math.floor(quantity) || 1),
    }));
  }

  function addItemToCart(item: MenuItem, size: MenuSize) {
    const quantity = quantities[item.id] ?? 1;

    addToCart({
      id: `${item.id}:${size.id}`,
      name: `${item.name} - ${size.displaySize || size.sizeName}`,
      price: size.price,
      duration: 0,
      quantity,
    });

    setRecentlyAddedItem(item.id);
    window.setTimeout(() => {
      setRecentlyAddedItem((current) =>
        current === item.id ? null : current
      );
    }, 1200);
  }

  return (
    <div>
      <main>
        <header className={pageCSS.bakeryHeader}>
          <img
            src="/images/corner-img.png"
            alt=""
            className={pageCSS.flowerBanner}
          />

          <div className={pageCSS.logoArea}>
            <Image
              src="/images/andy-logo-transparent.png"
              alt="Andy's Gourmet Bakery logo"
              width={170}
              height={170}
              className={pageCSS.bakeryLogo}
            />

            <div className={pageCSS.contactRow}>
              <span>📞 754-242-4383</span>
              <span>|</span>
              <span>🧁 6947 Stirling Road Davie, FL 33314</span>
            </div>
          </div>

          <div className={pageCSS.headerWave}>
            <svg viewBox="0 0 1200 70" preserveAspectRatio="none">
              <path
                className={pageCSS.waveFill}
                d="M0,28 Q50,8 100,28 T200,28 T300,28 T400,28 T500,28 T600,28 T700,28 T800,28 T900,28 T1000,28 T1100,28 T1200,28 L1200,70 L0,70 Z"
              />
              <path
                className={pageCSS.waveLine}
                d="M0,28 Q50,8 100,28 T200,28 T300,28 T400,28 T500,28 T600,28 T700,28 T800,28 T900,28 T1000,28 T1100,28 T1200,28"
              />
            </svg>
          </div>
        </header>

        <div className={pageCSS.appointmentPage}>
          <section className={servicesCSS.servicesPage} aria-live="polite">
            {menuLoading && <p>Loading menu...</p>}

            {menuError && <p style={{ color: "crimson" }}>{menuError}</p>}

            {!menuLoading && !menuError && menu.length === 0 && (
              <p>No menu items are currently available.</p>
            )}

            {menu.map((category) => (
              <div key={category.id}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenCategory(
                      openCategory === category.id ? null : category.id
                    )
                  }
                  className={servicesCSS.categoryButton}
                  aria-expanded={openCategory === category.id}
                >
                  <span>{category.name}</span>
                  <span className={servicesCSS.dropdownIcon} aria-hidden="true">
                    {openCategory === category.id ? "▴" : "▾"}
                  </span>
                </button>

                {openCategory === category.id &&
                  category.items.map((item) => {
                    const currentSize =
                      selectedSizes[item.id] ?? item.sizes[0];
                    const startingPrice = item.sizes[0]?.price;
                    const quantity = quantities[item.id] ?? 1;

                    return (
                      <article
                        key={item.id}
                        className={servicesCSS.servicesContainer}
                      >
                        <div className={servicesCSS.textContent}>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenItem(
                                openItem === item.id ? null : item.id
                              )
                            }
                            className={servicesCSS.itemDropdownBtn}
                            aria-expanded={openItem === item.id}
                          >
                            <span>{item.name}</span>
                            <span className={servicesCSS.itemArrow}>
                              {openItem === item.id
                                ? t("services.hideDetails")
                                : t("services.clickForDetails")}
                            </span>
                          </button>

                          {openItem === item.id && (
                            <div className={servicesCSS.productCardGrid}>
                              <div className={servicesCSS.productImageWrap}>
                                <Image
                                  src={
                                    item.imageUrl ||
                                    "/images/andy-logo-transparent.png"
                                  }
                                  alt={item.name}
                                  width={420}
                                  height={320}
                                  className={servicesCSS.productImage}
                                />
                              </div>

                              <div className={servicesCSS.productDetails}>
                                <p>{item.description}</p>
                                {item.note && <p>{item.note}</p>}

                                {startingPrice !== undefined && (
                                  <p style={{ fontWeight: "bold" }}>
                                    {t("services.startingAt")} {formatPrice(startingPrice)}
                                  </p>
                                )}

                                {item.sizes.length > 0 && (
                                  <div style={{ marginTop: "1rem" }}>
                                    <p style={{ fontWeight: "bold" }}>
                                      {t("services.size")}:
                                    </p>
                                    <div className={servicesCSS.sizeButtonGroup}>
                                      {item.sizes.map((size) => (
                                        <button
                                          type="button"
                                          className={
                                            currentSize?.id === size.id
                                              ? `${servicesCSS.sizeButton} ${servicesCSS.sizeButtonActive}`
                                              : servicesCSS.sizeButton
                                          }
                                          key={size.id}
                                          onClick={() => {
                                            setSelectedSizes((current) => ({
                                              ...current,
                                              [item.id]: size,
                                            }));
                                            updateQuantity(item.id, 1);
                                          }}
                                        >
                                          {size.displaySize || size.sizeName}
                                        </button>
                                      ))}
                                    </div>

                                    {currentSize && (
                                      <p className={servicesCSS.sizeSummary}>
                                        {t("services.serves")} {currentSize.serves || "varies"} • {formatPrice(currentSize.price)}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {!item.isCallOnly && currentSize && (
                          <div className={servicesCSS.orderActionRow}>
                            <div className={servicesCSS.quantityControl}>
                              <button
                                type="button"
                                className={servicesCSS.qtyButton}
                                aria-label={`Decrease quantity of ${item.name}`}
                                onClick={() => updateQuantity(item.id, quantity - 1)}
                              >
                                −
                              </button>
                              <input
                                type="number"
                                className={servicesCSS.qtyInput}
                                aria-label={`Quantity of ${item.name}`}
                                min="1"
                                value={quantity}
                                onChange={(event) =>
                                  updateQuantity(item.id, Number(event.target.value))
                                }
                              />
                              <button
                                type="button"
                                className={servicesCSS.qtyButton}
                                aria-label={`Increase quantity of ${item.name}`}
                                onClick={() => updateQuantity(item.id, quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              className={`${servicesCSS.orderAddButton} ${
                                recentlyAddedItem === item.id
                                  ? servicesCSS.orderAddButtonAdded
                                  : ""
                              }`}
                              onClick={() => addItemToCart(item, currentSize)}
                            >
                              {recentlyAddedItem === item.id
                                ? `${t("services.added")} ✓`
                                : t("services.addToBasket")}
                            </button>
                          </div>
                        )}
                      </article>
                    );
                  })}
              </div>
            ))}
          </section>

          {cart.length > 0 && (
            <section className={pageCSS.cartContainer} aria-live="polite">
              <h2 className={pageCSS.cartTitle}>
                {t("services.yourBasket")} ({cart.reduce((total, item) => total + item.quantity, 0)})
              </h2>
              <div className={pageCSS.cartSummary}>
                <h3>
                  {t("services.total")}: {formatPrice(
                    cart.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                  )}
                </h3>
              </div>
              <Link href="/services/book" className={pageCSS.bookBtn}>
                {t("services.confirmBasket")}
              </Link>
            </section>
          )}

          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            {t("services.priceNotice")}
          </div>

          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            {t("services.leadTimeNotice")}
          </div>
        </div>
      </main>

      <BottomSheetNav />
    </div>
  );
}
