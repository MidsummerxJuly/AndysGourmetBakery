"use client";

import BottomSheetNav from "../components/BottomSheetNav";
import pageCSS from "./page.module.css";
import servicesCSS from "./services.module.css";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/cartContext";
import { useLanguage } from "../context/LanguageContext";

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

type CustomerAvailabilityRow = {
  menu_item_size_id: number;
  menu_item_id: number;
  item_name: string;
  size_id: number;
  size_name: string;
  price_cents: number;
  batch_availability_id: string | null;
  quantity_available: number;
  made_this_batch: boolean;
};

export default function Services() {
  const { t } = useLanguage();
  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState("");

  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<string | null>(null);
  const [quantityInputs, setQuantityInputs] = useState<Record<number, string>>({});
  const [activeQtyEditor, setActiveQtyEditor] = useState<{
    id: string;
    mode: "add" | "subtract";
  } | null>(null);
  const [basketQtyInput, setBasketQtyInput] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<Record<number, MenuSize>>({});

  const [availabilityRows, setAvailabilityRows] = useState<CustomerAvailabilityRow[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const exists = cart.length > 0;

  const totalPrice = cart.reduce(
    (total, service) => total + service.price * service.quantity,
    0
  );

  useEffect(() => {
    async function loadMenu() {
      try {
        setMenuLoading(true);
        setMenuError("");

        const response = await fetch("/api/menu", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load menu.");
        }

        const data = await response.json();
        setMenu(Array.isArray(data.categories) ? data.categories : []);
      } catch (error) {
        console.error(error);
        setMenuError("The menu could not be loaded.");
      } finally {
        setMenuLoading(false);
      }
    }

    loadMenu();
  }, []);

  useEffect(() => {
    async function loadAvailability() {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError("");

        const response = await fetch("/api/admin/batch-availability", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load availability.");
        }

        const data = await response.json();
        setAvailabilityRows(data.items ?? []);
      } catch (error) {
        console.error(error);
        setAvailabilityError("Availability could not be loaded.");
      } finally {
        setAvailabilityLoading(false);
      }
    }

    loadAvailability();
  }, []);

  function getAvailabilityForSize(sizeId: number | undefined) {
    if (sizeId === undefined) {
      return undefined;
    }

    return availabilityRows.find(
      (row) => Number(row.menu_item_size_id) === Number(sizeId)
    );
  }

  function getCustomerAvailabilityStatus(
    row: CustomerAvailabilityRow | undefined
  ) {
    if (!row) {
      return "Availability not set";
    }

    if (!row.made_this_batch) {
      return "Unavailable this batch";
    }

    if (row.quantity_available <= 0) {
      return "Sold out";
    }

    if (row.quantity_available <= 3) {
      return `Only ${row.quantity_available} left`;
    }

    return "Available";
  }

  function canAddAvailabilityToCart(
    row: CustomerAvailabilityRow | undefined
  ) {
    if (!row) {
      return false;
    }

    return row.made_this_batch && row.quantity_available > 0;
  }

  function clampQuantityToAvailability(
    requestedQuantity: number,
    row: CustomerAvailabilityRow | undefined
  ) {
    const safeQuantity = Math.max(
      0,
      Math.floor(Number(requestedQuantity) || 0)
    );

    if (!row) {
      return 0;
    }

    return Math.min(safeQuantity, row.quantity_available);
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
                d="
                  M0,28
                  Q50,8 100,28
                  T200,28
                  T300,28
                  T400,28
                  T500,28
                  T600,28
                  T700,28
                  T800,28
                  T900,28
                  T1000,28
                  T1100,28
                  T1200,28
                  L1200,70
                  L0,70
                  Z
                "
              />

              <path
                className={pageCSS.waveLine}
                d="
                  M0,28
                  Q50,8 100,28
                  T200,28
                  T300,28
                  T400,28
                  T500,28
                  T600,28
                  T700,28
                  T800,28
                  T900,28
                  T1000,28
                  T1100,28
                  T1200,28
                "
              />
            </svg>
          </div>
        </header>

        <div className={pageCSS.appointmentPage}>
          <div className={servicesCSS.servicesPage}>
            {menuLoading && <p>Loading menu...</p>}

            {menuError && (
              <p style={{ color: "crimson" }}>{menuError}</p>
            )}

            {!menuLoading && !menuError && menu.length === 0 && (
              <p>No menu items are currently available.</p>
            )}

            {menu.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() =>
                    setOpenCategory(
                      openCategory === category.id ? null : category.id
                    )
                  }
                  className={servicesCSS.categoryButton}
                >
                  <span>{category.name}</span>

                  <span className={servicesCSS.dropdownIcon}>
                    {openCategory === category.id ? "▴" : "▾"}
                  </span>
                </button>

                {openCategory === category.id && (
                  <>
                    {category.items.map((item) => {
                      const currentSize = selectedSizes[item.id] ?? item.sizes[0];
                      const currentAvailability = getAvailabilityForSize(currentSize?.id);
                      const customerAvailabilityStatus = item.isCallOnly
                        ? item.note || "Call to order"
                        : getCustomerAvailabilityStatus(currentAvailability);

                      const canAddSelectedItem =
                        !item.isCallOnly &&
                        Boolean(currentSize) &&
                        canAddAvailabilityToCart(currentAvailability);

                      const maxAvailableQuantity =
                        currentAvailability?.quantity_available;

                      const startingPrice = item.sizes[0]?.price;
                      const cartId = currentSize
                        ? `${item.id}:${currentSize.id}`
                        : String(item.id);

                      return (
                        <div
                          key={item.id}
                          className={servicesCSS.servicesContainer}
                        >
                          <div>
                            <div className={servicesCSS.textContent}>
                              <button
                                onClick={() =>
                                  setOpenItem(
                                    openItem === item.id ? null : item.id
                                  )
                                }
                                className={servicesCSS.itemDropdownBtn}
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
                                      src={item.imageUrl || "/images/andy-logo-transparent.png"}
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
                                        {t("services.startingAt")} ${startingPrice}
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
                                              className={
                                                currentSize?.id === size.id
                                                  ? `${servicesCSS.sizeButton} ${servicesCSS.sizeButtonActive}`
                                                  : servicesCSS.sizeButton
                                              }
                                              key={size.id}
                                              onClick={() => {
                                                setSelectedSizes({
                                                  ...selectedSizes,
                                                  [item.id]: size,
                                                });

                                                setQuantityInputs({
                                                  ...quantityInputs,
                                                  [item.id]: "1",
                                                });
                                              }}
                                            >
                                              {size.displaySize || size.sizeName}
                                            </button>
                                          ))}
                                        </div>

                                        {currentSize && (
                                          <p className={servicesCSS.sizeSummary}>
                                            {t("services.serves")} {currentSize.serves || "varies"} • ${currentSize.price}
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {item.isCallOnly ? (
                                      <p className={servicesCSS.sizeSummary}>
                                        <strong>Status:</strong>{" "}
                                        {item.note || "Call to order"}
                                      </p>
                                    ) : availabilityLoading ? (
                                      <p className={servicesCSS.sizeSummary}>
                                        Checking availability...
                                      </p>
                                    ) : (
                                      <p className={servicesCSS.sizeSummary}>
                                        <strong>Status:</strong>{" "}
                                        {customerAvailabilityStatus}
                                      </p>
                                    )}

                                    {availabilityError && !item.isCallOnly && (
                                      <p
                                        className={servicesCSS.sizeSummary}
                                        style={{ color: "crimson" }}
                                      >
                                        {availabilityError}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {openItem === item.id && !item.isCallOnly && (
                              <div className={servicesCSS.orderActionRow}>
                                <div className={servicesCSS.quantityControl}>
                                  <button
                                    type="button"
                                    className={servicesCSS.qtyButton}
                                    disabled={!canAddSelectedItem}
                                    onClick={() => {
                                      const currentQty = Number(
                                        quantityInputs[item.id] || 1
                                      );

                                      setQuantityInputs({
                                        ...quantityInputs,
                                        [item.id]: String(
                                          Math.max(currentQty - 1, 0)
                                        ),
                                      });
                                    }}
                                  >
                                    -
                                  </button>

                                  <input
                                    type="number"
                                    min="0"
                                    max={maxAvailableQuantity}
                                    disabled={!canAddSelectedItem}
                                    value={quantityInputs[item.id] ?? "1"}
                                    onChange={(e) => {
                                      const nextQuantity =
                                        clampQuantityToAvailability(
                                          Number(e.target.value),
                                          currentAvailability
                                        );

                                      setQuantityInputs({
                                        ...quantityInputs,
                                        [item.id]: String(nextQuantity),
                                      });
                                    }}
                                    className={servicesCSS.qtyInput}
                                  />

                                  <button
                                    type="button"
                                    className={servicesCSS.qtyButton}
                                    disabled={!canAddSelectedItem}
                                    onClick={() => {
                                      const currentQty = Number(
                                        quantityInputs[item.id] || 1
                                      );

                                      const nextQuantity =
                                        clampQuantityToAvailability(
                                          currentQty + 1,
                                          currentAvailability
                                        );

                                      setQuantityInputs({
                                        ...quantityInputs,
                                        [item.id]: String(nextQuantity),
                                      });
                                    }}
                                  >
                                    +
                                  </button>
                                </div>

                                <div
                                  onClick={() => {
                                    if (
                                      !canAddSelectedItem ||
                                      !currentSize
                                    ) {
                                      return;
                                    }

                                    const requestedQuantity = Number(
                                      quantityInputs[item.id] || 1
                                    );

                                    const quantity =
                                      clampQuantityToAvailability(
                                        requestedQuantity,
                                        currentAvailability
                                      );

                                    if (quantity <= 0) {
                                      return;
                                    }

                                    addToCart({
                                      id: cartId,
                                      name: `${item.name} - ${
                                        currentSize.displaySize ||
                                        currentSize.sizeName
                                      }`,
                                      price: currentSize.price,
                                      duration: 0,
                                      quantity,
                                      maxQuantity: maxAvailableQuantity,
                                    });

                                    setRecentlyAddedItem(cartId);

                                    window.setTimeout(() => {
                                      setRecentlyAddedItem((currentItem) =>
                                        currentItem === cartId
                                          ? null
                                          : currentItem
                                      );
                                    }, 1200);
                                  }}
                                  aria-disabled={!canAddSelectedItem}
                                  style={{
                                    opacity: canAddSelectedItem ? 1 : 0.55,
                                    cursor: canAddSelectedItem
                                      ? "pointer"
                                      : "not-allowed",
                                  }}
                                  className={`${servicesCSS.orderAddButton} ${
                                    recentlyAddedItem === cartId
                                      ? servicesCSS.orderAddButtonAdded
                                      : ""
                                  }`}
                                >
                                  {!canAddSelectedItem
                                    ? customerAvailabilityStatus
                                    : recentlyAddedItem === cartId
                                      ? `${t("services.added")} ✓`
                                      : t("services.addToBasket")}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            ))}
          </div>

          <div className={pageCSS.cartContainer}>
            {exists && (
              <h2 className={pageCSS.cartTitle}>
                🍰 {t("services.yourBasket")} ({
                  cart.reduce((total, item) => total + item.quantity, 0)
                })
              </h2>
            )}

            {exists && (
              <table className={pageCSS.cartTable}>
                <thead>
                  <tr>
                    <th>{t("services.treat")}</th>
                    <th>{t("services.price")}</th>
                    <th>{t("services.qty")}</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {cart.map((service, index) => (
                    <tr key={`${service.id}-${index}`}>
                      <td>
                        <p className={pageCSS.serviceName}>{service.name}</p>
                      </td>

                      <td style={{ paddingLeft: "1rem" }}>
                        ${service.price * service.quantity}
                      </td>

                      <td style={{ paddingLeft: "1rem" }}>
                        x{service.quantity}
                      </td>

                      <td>
                        <div className={pageCSS.basketActionGroup}>
                          <input
                            type="number"
                            min="1"
                            value={
                              activeQtyEditor?.id === service.id &&
                              activeQtyEditor.mode === "subtract"
                                ? basketQtyInput
                                : ""
                            }
                            onChange={(e) =>
                              setBasketQtyInput(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                decreaseQuantity(
                                  service.id,
                                  Number(basketQtyInput || 0)
                                );
                                setActiveQtyEditor(null);
                                setBasketQtyInput("");
                              }
                            }}
                            className={`${pageCSS.basketMiniInput} ${
                              activeQtyEditor?.id === service.id &&
                              activeQtyEditor.mode === "subtract"
                                ? ""
                                : pageCSS.hiddenBasketInput
                            }`}
                          />

                          <BiMinusCircle
                            className={pageCSS.removeButton}
                            onClick={() => {
                              if (
                                activeQtyEditor?.id === service.id &&
                                activeQtyEditor.mode === "subtract"
                              ) {
                                setActiveQtyEditor(null);
                              } else {
                                setActiveQtyEditor({
                                  id: service.id,
                                  mode: "subtract",
                                });
                              }

                              setBasketQtyInput("");
                            }}
                          />

                          <BiPlusCircle
                            className={pageCSS.addButton}
                            onClick={() => {
                              if (
                                activeQtyEditor?.id === service.id &&
                                activeQtyEditor.mode === "add"
                              ) {
                                setActiveQtyEditor(null);
                              } else {
                                setActiveQtyEditor({
                                  id: service.id,
                                  mode: "add",
                                });
                              }

                              setBasketQtyInput("");
                            }}
                          />

                          <input
                            type="number"
                            min="1"
                            max={service.maxQuantity}
                            value={
                              activeQtyEditor?.id === service.id &&
                              activeQtyEditor.mode === "add"
                                ? basketQtyInput
                                : ""
                            }
                            onChange={(e) =>
                              setBasketQtyInput(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                increaseQuantity(
                                  service.id,
                                  Number(basketQtyInput || 0)
                                );
                                setActiveQtyEditor(null);
                                setBasketQtyInput("");
                              }
                            }}
                            className={`${pageCSS.basketMiniInput} ${
                              activeQtyEditor?.id === service.id &&
                              activeQtyEditor.mode === "add"
                                ? ""
                                : pageCSS.hiddenBasketInput
                            }`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {exists ? (
              <div className={pageCSS.cartSummary}>
                <h3>
                  {t("services.total")}: ${totalPrice}
                </h3>
              </div>
            ) : (
              <div></div>
            )}

            {exists ? (
              <div className={pageCSS.checkoutButton}>
                <Link href="/services/book" className={pageCSS.bookBtn}>
                  {t("services.confirmBasket")}
                </Link>
              </div>
            ) : (
              <h5
                style={{
                  display: "flex",
                  marginTop: "1rem",
                  justifyContent: "center",
                  padding: "1rem",
                }}
              >
                {t("services.cartEmpty")} {"😔"}
              </h5>
            )}
          </div>

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
