"use client";
import BottomSheetNav from "../components/BottomSheetNav";
import pageCSS from "./page.module.css"
import servicesCSS from "./services.module.css"
import { BiMinusCircle, BiPlusCircle, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Image from "next/image";


import { useState } from "react";
import { useCart } from "../context/cartContext";

import Link from 'next/link';




const services = [
  {
    category: "Menu Cakes",
    items: [
      {
        id: "dulce-de-leche-peach-cake",
        name: "Dulce de Leche & Peach Cake",
        price: 35,
        duration: 0,
        image: "/images/Dulce_de_Leche_&_Peach.jpg",
        description:
          "Cake with dulce de leche and peach flavor inspiration. Placeholder details until final menu info is confirmed.",
        sizes: [
          { size: '6" Small', price: 35, serves: "6–8" },
          { size: '8" Medium', price: 45, serves: "10–14" },
          { size: '10" Large', price: 60, serves: "18–24" },
        ],
      },
      {
        id: "italian-meringue-cake",
        name: "Italian Meringue Cake",
        price: 35,
        duration: 0,
        image: "/images/Italian_Meringue.jpg",
        description:
          "Cake finished with Italian meringue-style frosting. Placeholder details until final menu info is confirmed.",
        sizes: [
          { size: '6" Small', price: 35, serves: "6–8" },
          { size: '8" Medium', price: 45, serves: "10–14" },
          { size: '10" Large', price: 60, serves: "18–24" },
        ],
      },
      {
        id: "thousand-layer-cake",
        name: "Thousand Layer Cake",
        price: 35,
        duration: 0,
        image: "/images/Thousand_Layer_ With_Dulce_de_Leche.jpg",
        description:
          "Layered cake with dulce de leche inspiration. Placeholder details until final menu info is confirmed.",
        sizes: [
          { size: '6" Small', price: 35, serves: "6–8" },
          { size: '8" Medium', price: 45, serves: "10–14" },
          { size: '10" Large', price: 60, serves: "18–24" },
        ],
      },
      {
        id: "black-forest-cake",
        name: "Black Forest Cake",
        price: 35,
        duration: 0,
        image: "/images/selva_negra.jpg",
        description:
          "Black Forest-style cake with chocolate and cherry flavor inspiration. Placeholder details until final menu info is confirmed.",
        sizes: [
          { size: '6" Small', price: 35, serves: "6–8" },
          { size: '8" Medium', price: 45, serves: "10–14" },
          { size: '10" Large', price: 60, serves: "18–24" },
        ],
      },
    ],
  },
  {
    category: "Pastries & Sweets",
    items: [
      {
        id: "alfajores",
        name: "Alfajores",
        price: 3,
        duration: 0,
        image: "/images/gallery11.jpg",
        description:
          "Sweet sandwich-style pastry. Placeholder price and description until final menu info is confirmed.",
        sizes: [
          { size: "Single", price: 3, serves: "1" },
          { size: "Half Dozen", price: 16, serves: "6" },
          { size: "Dozen", price: 30, serves: "12" },
        ],
      },
      {
        id: "empolvados",
        name: "Empolvados",
        price: 3,
        duration: 0,
        image: "/images/gallery11.jpg",
        description:
          "Soft sweet pastry. Placeholder price and description until final menu info is confirmed.",
        sizes: [
          { size: "Single", price: 3, serves: "1" },
          { size: "Half Dozen", price: 16, serves: "6" },
          { size: "Dozen", price: 30, serves: "12" },
        ],
      },
      {
        id: "berlines",
        name: "Berlines",
        price: 3.5,
        duration: 0,
        image: "/images/gallery11.jpg",
        description:
          "Sweet filled pastry. Placeholder price and description until final menu info is confirmed.",
        sizes: [
          { size: "Single", price: 3.5, serves: "1" },
          { size: "Half Dozen", price: 19, serves: "6" },
          { size: "Dozen", price: 36, serves: "12" },
        ],
      },
      {
        id: "fruit-tart",
        name: "Fruit Tart",
        price: 4,
        duration: 0,
        image: "/images/gallery10.jpg",
        description:
          "Fruit tart dessert with fresh fruit presentation. Placeholder price until final menu info is confirmed.",
        sizes: [
          { size: "Single", price: 4, serves: "1" },
          { size: "Half Dozen", price: 22, serves: "6" },
          { size: "Dozen", price: 42, serves: "12" },
        ],
      },
      {
        id: "chilenitos",
        name: "Chilenitos",
        price: 3,
        duration: 0,
        image: "/images/gallery11.jpg",
        description:
          "Traditional sweet pastry. Placeholder price and description until final menu info is confirmed.",
        sizes: [
          { size: "Single", price: 3, serves: "1" },
          { size: "Half Dozen", price: 16, serves: "6" },
          { size: "Dozen", price: 30, serves: "12" },
        ],
      },
      {
        id: "cuchufli",
        name: "Cuchuflí",
        price: 2.5,
        duration: 0,
        image: "/images/gallery11.jpg",
        description:
          "Sweet rolled treat. Placeholder price and description until final menu info is confirmed.",
        sizes: [
          { size: "Single", price: 2.5, serves: "1" },
          { size: "Half Dozen", price: 14, serves: "6" },
          { size: "Dozen", price: 26, serves: "12" },
        ],
      },
      {
        id: "brazo-de-reina",
        name: "Brazo de Reina / Brazo Gitano",
        price: 4,
        duration: 0,
        image: "/images/menu1.jpg",
        description:
          "Rolled cake dessert. Placeholder price and description until final menu info is confirmed.",
        sizes: [
          { size: "Slice", price: 4, serves: "1" },
          { size: "Half Roll", price: 20, serves: "4–6" },
          { size: "Whole Roll", price: 38, serves: "8–12" },
        ],
      },
    ],
  },
  {
    category: "Custom Orders",
    items: [
      {
        id: "custom-cake",
        name: "Custom Cake Order",
        price: 50,
        duration: 0,
        image: "/images/gallery13.jpg",
        description:
          "Custom pricing depends on size, flavor, filling, frosting, and design complexity.",
        sizes: [
          {
            size: "Basic",
            displaySize: '10" Cake',
            price: 50,
            serves: "18–24",
          },
          {
            size: "Detailed",
            displaySize: '12" Cake',
            price: 100,
            serves: "25–35",
          },
          {
            size: "Premium",
            displaySize: '14" Cake',
            price: 200,
            serves: "35–50",
          },
        ],
      },
    ],
  },
];




export default function Services() {

  // const router = useRouter() // used for cleaner redirects as buttons
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<string | null>(null);
  const [quantityInputs, setQuantityInputs] = useState<{ [key: string]: string }>({});
  const [activeQtyEditor, setActiveQtyEditor] = useState<{
    id: string;
    mode: "add" | "subtract";
  } | null>(null);

  const [basketQtyInput, setBasketQtyInput] = useState("");
  const { cart } = useCart();
  const { addToCart } = useCart();
  const { updateQuantity, increaseQuantity, decreaseQuantity } = useCart();
  const { removeFromCart } = useCart();
  const { clearCart } = useCart();
  const { checkCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<{
  [key: string]: {
    size: string;
    price: number;
    serves?: string;
    displaySize?: string;
  };
}>({});

const [customOptionPage, setCustomOptionPage] = useState<{ [key: string]: number }>({});
  const exists = cart.length > 0;

  const totalPrice = cart.reduce(
    (total, service) => total + service.price * service.quantity,
    0
  );
  const totalDuration = cart.reduce(
    (total, service) => total + service.duration,
    0
  );

  const customOptionPages = [
  {
    title: "Flavor",
    label: "Choose a flavor",
    options: ["Chocolate", "Vanilla", "Strawberry", "Red Velvet"],
  },
  {
    title: "Filling",
    label: "Choose a filling",
    options: ["None", "Chocolate Ganache", "Vanilla Cream", "Fruit Filling"],
  },
  {
    title: "Frosting",
    label: "Choose frosting",
    options: ["Buttercream", "Chocolate Buttercream", "Vanilla Buttercream", "Cream Cheese"],
  },
  {
    title: "Add-ons",
    label: "Choose add-ons",
    options: ["None", "Writing", "Flowers", "Extra Decoration"],
  },
];

  return (
    <div className="body-wrap boxed-container">
      <main>
        <header className={pageCSS.bakeryHeader}>
          <img
            src="/images/corner-img.png"
            alt=""
            className={pageCSS.flowerBanner}
          />
          {/* <button className={pageCSS.menuButton}>☰ Menu</button> */}

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

          <div className={pageCSS.qrBox}>
            <div className={pageCSS.qrPlaceholder}>
              QR
            </div>

            <p className={pageCSS.followText}>Follow Us</p>
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

            {services.map((category) => (
              <div key={category.category}>
                <button
                  onClick={() =>
                    setOpenCategory(openCategory === category.category ? null : category.category)
                  }
                  className={servicesCSS.categoryButton}
                >
                  <span>{category.category}</span>

                  <span className={servicesCSS.dropdownIcon}>
                    {openCategory === category.category ? "▴" : "▾"}
                  </span>
                </button>
              {openCategory === category.category && (
                <>
                {category.items.map((item) => {
                  const exists = cart.some((cartItem) => cartItem.id === item.id);
                  const currentSize = selectedSizes[item.id] || item.sizes[0];
                  const currentCustomPage = customOptionPage[item.id] ?? 0;
                  const safeCustomPage = Math.min(
                    Math.max(currentCustomPage, 0),
                    customOptionPages.length - 1
                  );
                  const customPage = customOptionPages[safeCustomPage];

                  return (
                    <div key={item.id} className={servicesCSS.servicesContainer}>
                      <div>
                        <div className={servicesCSS.textContent}>
                          <button
                            onClick={() =>
                              setOpenItem(openItem === item.id ? null : item.id)
                            }
                            className={servicesCSS.itemDropdownBtn}
                          >
                            <span>{item.name}</span>

                            <span className={servicesCSS.itemArrow}>
                              {openItem === item.id ? "Hide details" : "Click for details"}
                            </span>
                          </button>

                        {openItem === item.id && (
                          <div className={servicesCSS.productCardGrid}>
                            <div className={servicesCSS.productImageWrap}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={420}
                                height={320}
                                className={servicesCSS.productImage}
                              />
                            </div>

                            <div className={servicesCSS.productDetails}>
                              <p>{item.description}</p>

                              <p style={{ fontWeight: "bold" }}>
                                Starting at ${item.price}
                              </p>

                              <div style={{ marginTop: "1rem" }}>
                               {item.id === "custom-cake" && selectedSizes[item.id] ? (
                                  <p style={{ fontWeight: "bold" }}>
                                    Size: {selectedSizes[item.id].displaySize} • Serves{" "}
                                    {selectedSizes[item.id].serves || "varies"}
                                  </p>
                                ) : (
                                  <p style={{ fontWeight: "bold" }}>Size:</p>
                                )}

                                <div className={servicesCSS.sizeButtonGroup}>
                                  {item.sizes.map((size) => (
                                    <button
                                      className={
                                        currentSize?.size === size.size
                                          ? `${servicesCSS.sizeButton} ${servicesCSS.sizeButtonActive}`
                                          : servicesCSS.sizeButton
                                      }
                                      key={size.size}
                                      onClick={() =>
                                        setSelectedSizes({
                                          ...selectedSizes,
                                          [item.id]: size,
                                        })
                                      }
                                    >
                                      {size.size}
                                    </button>
                                  ))}
                                </div>

                              {currentSize && (
                                <p className={servicesCSS.sizeSummary}>
                                  {item.id === "custom-cake" ? (
                                    <>Starting price: ${currentSize.price}</>
                                  ) : (
                                    <>
                                      Serves {currentSize.serves || "varies"} • ${currentSize.price}
                                    </>
                                  )}
                                </p>
                              )}
                              {item.id === "custom-cake" && (
                                <div className={servicesCSS.customPager}>
                                  <div className={servicesCSS.customPagerHeader}>
                                    {safeCustomPage > 0 ? (
                                      <button
                                        type="button"
                                        className={servicesCSS.customArrowButton}
                                        onClick={() =>
                                          setCustomOptionPage({
                                            ...customOptionPage,
                                            [item.id]: safeCustomPage - 1,
                                          })
                                        }
                                      >
                                        <BiChevronLeft className={servicesCSS.customArrowIcon} />
                                      </button>
                                    ) : (
                                      <span className={servicesCSS.customArrowSpacer}></span>
                                    )}

                                    <p className={servicesCSS.customPagerTitle}>{customPage.title}</p>

                                    {safeCustomPage < customOptionPages.length - 1 ? (
                                      <button
                                        type="button"
                                        className={servicesCSS.customArrowButton}
                                        onClick={() =>
                                          setCustomOptionPage({
                                            ...customOptionPage,
                                            [item.id]: safeCustomPage + 1,
                                          })
                                        }
                                      >
                                        <BiChevronRight className={servicesCSS.customArrowIcon} />
                                      </button>
                                    ) : (
                                      <span className={servicesCSS.customArrowSpacer}></span>
                                    )}
                                  </div>

                                  <div className={servicesCSS.customOptionCard}>
                                    <label className={servicesCSS.optionLabel}>{customPage.label}</label>

                                    <select className={servicesCSS.optionSelect}>
                                      {customPage.options.map((option) => (
                                        <option key={option}>{option}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              )}
                              </div>
                            </div>
                          </div>
                        )}

                          
                        </div>
                     {openItem === item.id && (
                      <div className={servicesCSS.orderActionRow}>
                        <div className={servicesCSS.quantityControl}>
                          <button
                            type="button"
                            className={servicesCSS.qtyButton}
                            onClick={() => {
                              const currentQty = Number(quantityInputs[item.id] || 1);

                              setQuantityInputs({
                                ...quantityInputs,
                                [item.id]: String(Math.max(currentQty - 1, 0)),
                              });
                            }}
                          >
                            -
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={quantityInputs[item.id] ?? "1"}
                            onChange={(e) =>
                              setQuantityInputs({
                                ...quantityInputs,
                                [item.id]: e.target.value,
                              })
                            }
                            className={servicesCSS.qtyInput}
                          />

                          <button
                            type="button"
                            className={servicesCSS.qtyButton}
                            onClick={() => {
                              const currentQty = Number(quantityInputs[item.id] || 1);

                              setQuantityInputs({
                                ...quantityInputs,
                                [item.id]: String(currentQty + 1),
                              });
                            }}
                          >
                            +
                          </button>
                        </div>

                        <div
                          onClick={() => {
                            const quantity = Number(quantityInputs[item.id] || 1);

                            addToCart({
                              id: item.id,
                              name: currentSize
                                ? `${item.name} - ${currentSize.size}`
                                : item.name,
                              price: currentSize?.price ?? item.price ?? 0,
                              duration: item.duration || 0,
                              quantity: quantity > 0 ? quantity : 1,
                            });
                            setRecentlyAddedItem(item.id);
                            window.setTimeout(() => {
                              setRecentlyAddedItem((currentItem) =>
                                currentItem === item.id ? null : currentItem
                              );
                            }, 1200);
                          }}
                          className={`${servicesCSS.orderAddButton} ${
                            recentlyAddedItem === item.id
                              ? servicesCSS.orderAddButtonAdded
                              : ""
                          }`}
                          >
                            {recentlyAddedItem === item.id ? "Added ✓" : "Add to Basket"}
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
            {exists &&
             <h2 className={pageCSS.cartTitle}>
                🍰 Your Basket ({cart.reduce((total, item) => total + item.quantity, 0)})
             </h2>
            }

            {exists &&
              <table className={pageCSS.cartTable}>
                <thead>
                  <tr>
                    <th>Treat</th>
                    <th>Price</th>
                    <th>Qty</th>
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
                      <td style={{ paddingLeft: "1rem" }}>x{service.quantity}</td>
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
                            onChange={(e) => setBasketQtyInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                decreaseQuantity(service.id, Number(basketQtyInput || 0));
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
                                setActiveQtyEditor({ id: service.id, mode: "subtract" });
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
                                setActiveQtyEditor({ id: service.id, mode: "add" });
                              }

                              setBasketQtyInput("");
                            }}
                          />

                          <input
                            type="number"
                            min="1"
                            value={
                              activeQtyEditor?.id === service.id &&
                              activeQtyEditor.mode === "add"
                                ? basketQtyInput
                                : ""
                            }
                            onChange={(e) => setBasketQtyInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                increaseQuantity(service.id, Number(basketQtyInput || 0));
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
            }
            {exists ?
              <div className={pageCSS.cartSummary}>
                <h3>Total: ${totalPrice}</h3>
              </div>
              :
              <div></div>
            }


            {exists ?

              <div className={pageCSS.checkoutButton}>
                <Link href="/services/book" className={pageCSS.bookBtn}>
                  Confirm Basket
                </Link>
              </div>

              : <h5 style={{ display: "flex", marginTop: "1rem", justifyContent: "center", padding: "1rem" }}>Cart is empty {":("} </h5>
            }


          </div>

          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            *Prices are subject to change based on size, flavor, and design for custom orders.
          </div>

          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            * Please allow 48 hours notice for all orders. Custom orders may require more time based on complexity.
          </div>



        </div>
      </main>
      <BottomSheetNav />

    </div>
  )
}