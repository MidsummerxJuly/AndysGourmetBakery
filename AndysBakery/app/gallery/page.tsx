"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import BottomSheetNav from "@/app/components/BottomSheetNav";
import { useLanguage } from "@/app/context/LanguageContext";
//burgers//

type GalleryPhoto = {
  title: string;
  category: string;
  image: string;
  description: string;
  details: string;
  goodFor: string;
};

type GalleryCategoryId =
  | "all"
  | "customCakes"
  | "menuCakes"
  | "pastries"
  | "bakeryCase";

const galleryPhotos: GalleryPhoto[] = [
  {
    title: "Custom Floral Cake",
    category: "Custom Cakes",
    image: "/images/gallery1.jpg",
    description:
      "An elegant custom cake finished with floral-inspired decoration for a soft, polished presentation.",
    details:
      "Colors, flowers, cake size, flavor, filling, and finishing details can be personalized for your event. Please call Andy to confirm available options, pricing, and lead time.",
    goodFor: "Birthdays, showers, anniversaries, family celebrations",
  },
  {
    title: "Character Birthday Cake",
    category: "Custom Cakes",
    image: "/images/gallery2.jpg",
    description:
      "A fun character-inspired birthday cake designed around a personalized party theme.",
    details:
      "Character designs, colors, serving size, flavor, filling, and decorative details may be customized. Please call Andy to discuss the theme and confirm pricing and availability.",
    goodFor: "Kids birthdays, themed parties, family celebrations",
  },
  {
    title: "Celebration Cake",
    category: "Custom Cakes",
    image: "/images/gallery3.jpg",
    description:
      "A festive custom cake created to make birthdays, milestones, and special gatherings feel more personal.",
    details:
      "The color palette, message, decorations, flavor, filling, and size can be discussed when ordering. Please call Andy to confirm the available choices for your event.",
    goodFor: "Birthdays, graduations, anniversaries, family gatherings",
  },
  {
    title: "Dulce de Leche Cake",
    category: "Menu Cakes",
    image: "/images/gallery4.jpg",
    description:
      "A rich cake inspired by the classic sweetness of dulce de leche and traditional bakery flavors.",
    details:
      "Available sizes, layers, fillings, finishing style, and current pricing may vary. Please call Andy to confirm the exact cake details before ordering.",
    goodFor: "Birthdays, dessert tables, family celebrations",
  },
  {
    title: "Sonic Birthday Cake",
    category: "Custom Cakes",
    image: "/images/gallery5.jpg",
    description:
      "A colorful Sonic-inspired birthday cake made for a playful themed celebration.",
    details:
      "Theme elements can be adapted to the celebration, including colors, writing, size, flavor, and filling. Please call Andy to confirm design possibilities, pricing, and required notice.",
    goodFor: "Kids birthdays, gaming parties, themed celebrations",
  },
  {
    title: "Lavender Birthday Cake",
    category: "Custom Cakes",
    image: "/images/gallery6.jpg",
    description:
      "A soft lavender-toned birthday cake with an elegant and understated decorative style.",
    details:
      "Colors, message, decorations, flavor, filling, and serving size can be discussed for your order. Please call Andy to confirm available options and pricing.",
    goodFor: "Birthdays, showers, intimate celebrations",
  },
  {
    title: "Heart Cake",
    category: "Custom Cakes",
    image: "/images/gallery7.jpg",
    description:
      "A romantic heart-shaped custom cake designed for celebrations centered around someone special.",
    details:
      "The cake can be personalized with colors, writing, decorations, flavor, filling, and size. Please call Andy to confirm current design options and pricing.",
    goodFor: "Birthdays, anniversaries, Valentine's celebrations, engagements",
  },
  {
    title: "Bakery Case",
    category: "Bakery Case",
    image: "/images/gallery8.jpg",
    description:
      "A look at the variety of cakes, pastries, and sweets prepared by Andy’s Gourmet Bakery.",
    details:
      "Bakery selections can change depending on the baking schedule and existing orders. Please call Andy to confirm what is currently available for pickup or advance ordering.",
    goodFor: "Dessert inspiration, gatherings, bakery treats",
  },
  {
    title: "Dulce de Leche Celebration Cake",
    category: "Menu Cakes",
    image: "/images/gallery9.jpg",
    description:
      "A celebration cake inspired by the smooth caramel flavor of dulce de leche.",
    details:
      "Exact layers, filling, frosting, size choices, and pricing should be confirmed before ordering. Please call Andy for the current menu options.",
    goodFor: "Birthdays, family parties, dessert tables",
  },
  {
    title: "Fruit Tart",
    category: "Pastries",
    image: "/images/gallery10.jpg",
    description:
      "A colorful fruit tart with a bright, fresh presentation that works beautifully on a dessert table.",
    details:
      "Fruit selection, tart size, quantity, and pricing may vary depending on availability. Please call Andy to confirm the current fruit tart options and order quantity.",
    goodFor: "Dessert trays, parties, showers, individual treats",
  },
  {
    title: "Dessert Tarts",
    category: "Pastries",
    image: "/images/gallery11.jpg",
    description:
      "Small tart-style pastries that add variety and an elegant touch to dessert tables and gatherings.",
    details:
      "Available flavors, toppings, quantities, and pricing may change. Please call Andy to confirm which tart varieties are currently available.",
    goodFor: "Dessert tables, parties, showers, small events",
  },
  {
    title: "Custom Communion Cake",
    category: "Custom Cakes",
    image: "/images/galley12.jpg",
    description:
      "A custom cake created for a meaningful Communion or faith-centered family celebration.",
    details:
      "Decorations, colors, message, serving size, flavor, and filling can be discussed for the occasion. Please call Andy to confirm design options, pricing, and lead time.",
    goodFor: "First Communions, baptisms, confirmations, family events",
  },
  {
    title: "Rose Tier Cake",
    category: "Custom Cakes",
    image: "/images/gallery13.jpg",
    description:
      "An elegant tiered cake featuring floral-inspired rose details for a refined celebration centerpiece.",
    details:
      "Tiered cakes are consultation-only and may vary significantly by serving size and design complexity. Please call Andy to discuss tiers, flowers, flavors, fillings, pricing, and lead time.",
    goodFor: "Weddings, anniversaries, milestone birthdays, large celebrations",
  },
  {
    title: "Elegant Custom Cake",
    category: "Custom Cakes",
    image: "/images/galerry14.jpg",
    description:
      "A refined custom cake designed with elegant decorative details for a polished event presentation.",
    details:
      "The final look can be tailored through color, decoration, size, flavor, and filling choices. Please call Andy to confirm the design, pricing, and availability for your date.",
    goodFor: "Formal events, birthdays, showers, celebrations",
  },
  {
    title: "Blue Rose Tier Cake",
    category: "Custom Cakes",
    image: "/images/gallery15.jpg",
    description:
      "A tiered celebration cake accented with blue rose-inspired floral decoration.",
    details:
      "Tiered cakes require direct consultation. Colors, flowers, tier sizes, flavors, fillings, serving count, and pricing can be discussed with Andy before the order is confirmed.",
    goodFor: "Birthdays, weddings, formal events, large celebrations",
  },
  {
    title: "Elegant Gold Cake",
    category: "Custom Cakes",
    image: "/images/gallery16.jpg",
    description:
      "A sophisticated custom cake featuring gold-inspired decorative accents for an elevated celebration style.",
    details:
      "Gold details, colors, size, flavor, filling, writing, and additional decoration can vary by order. Please call Andy to confirm design options and custom pricing.",
    goodFor: "Adult birthdays, anniversaries, formal celebrations",
  },
  {
    title: "Ocean Theme Cake",
    category: "Custom Cakes",
    image: "/images/gallery17.jpg",
    description:
      "A playful ocean-inspired custom cake designed around an under-the-sea style celebration theme.",
    details:
      "Theme colors, ocean decorations, writing, cake size, flavor, and filling may be personalized. Please call Andy to discuss your ideas and confirm pricing and lead time.",
    goodFor: "Kids birthdays, beach themes, ocean-themed parties",
  },
  {
    title: "Bakery Display",
    category: "Bakery Case",
    image: "/images/gallery19.jpg",
    description:
      "A display showcasing the range of cakes and sweets prepared by Andy’s Gourmet Bakery.",
    details:
      "Daily and weekly selections depend on the bakery’s order and preparation schedule. Please call Andy to confirm what is available or to arrange an advance order.",
    goodFor: "Dessert inspiration, gatherings, bakery variety",
  },
  {
    title: "Pink Sheet Cake",
    category: "Custom Cakes",
    image: "/images/gallery20.jpg",
    description:
      "A pink custom sheet cake designed to provide generous servings while still feeling festive and personalized.",
    details:
      "Sheet cakes may be customized with colors, writing, decorations, flavor, filling, and serving size. Please call Andy to confirm the available sizes and custom pricing.",
    goodFor: "Birthdays, family parties, school events, larger gatherings",
  },
  {
    title: "Dulce de Leche & Peach Cake",
    category: "Menu Cakes",
    image: "/images/Dulce_de_Leche_&_Peach.jpg",
    description:
      "A cake pairing the rich sweetness of dulce de leche with a lighter peach-inspired flavor profile.",
    details:
      "Available cake sizes, filling, finishing style, serving counts, and current pricing should be confirmed before ordering. Please call Andy for the latest menu details.",
    goodFor: "Birthdays, family gatherings, dessert tables",
  },
  {
    title: "Italian Meringue Cake",
    category: "Menu Cakes",
    image: "/images/Italian_Meringue.jpg",
    description:
      "A classic-style celebration cake finished with smooth Italian meringue-inspired decoration.",
    details:
      "Flavor, filling, available sizes, serving counts, and current pricing may vary. Please call Andy to confirm the exact options available for this cake.",
    goodFor: "Birthdays, family celebrations, classic cake orders",
  },
  {
    title: "Thousand Layer Cake",
    category: "Menu Cakes",
    image: "/images/Thousand_Layer_ With_Dulce_de_Leche.jpg",
    description:
      "A layered cake inspired by traditional thin pastry layers paired with rich dulce de leche.",
    details:
      "The exact number of layers, filling, size, serving count, and price should be confirmed when ordering. Please call Andy for current availability and menu details.",
    goodFor: "Family celebrations, dessert tables, special occasions",
  },
  {
    title: "Black Forest Cake",
    category: "Menu Cakes",
    image: "/images/selva_negra.jpg",
    description:
      "A classic Black Forest-inspired cake combining rich chocolate character with cherry-style flavor notes.",
    details:
      "Exact ingredients, filling, frosting, available sizes, and current pricing should be confirmed directly with the bakery. Please call Andy before ordering if you have ingredient or allergy questions.",
    goodFor: "Birthdays, chocolate lovers, family celebrations",
  },
];

const categoryKeyMap: Record<string, string> = {
  All: "gallery.all",
  "Custom Cakes": "gallery.customCakes",
  "Menu Cakes": "gallery.menuCakes",
  Pastries: "gallery.pastries",
  "Bakery Case": "gallery.bakeryCase",
};

export default function GalleryPage() {
  const { t } = useLanguage();

  const categories: {
    id: GalleryCategoryId;
    label: string;
    value: string;
  }[] = [
    { id: "all", label: t("gallery.all", "All"), value: "All" },
    {
      id: "customCakes",
      label: t("gallery.customCakes", "Custom Cakes"),
      value: "Custom Cakes",
    },
    {
      id: "menuCakes",
      label: t("gallery.menuCakes", "Menu Cakes"),
      value: "Menu Cakes",
    },
    {
      id: "pastries",
      label: t("gallery.pastries", "Pastries"),
      value: "Pastries",
    },
    {
      id: "bakeryCase",
      label: t("gallery.bakeryCase", "Bakery Case"),
      value: "Bakery Case",
    },
  ];

  const [selectedCategory, setSelectedCategory] =
    useState<GalleryCategoryId>("all");

  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const visiblePhotos = useMemo(() => {
    const currentCategory = categories.find(
      (category) => category.id === selectedCategory
    );

    if (!currentCategory || currentCategory.id === "all") {
      return galleryPhotos;
    }

    return galleryPhotos.filter(
      (photo) => photo.category === currentCategory.value
    );
  }, [selectedCategory, categories]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className={styles.galleryPage}>
      <div className={styles.galleryMenuFix}>
        <BottomSheetNav buttonTop="4.5rem" buttonLeft="1.5em" />
      </div>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>{t("gallery.eyebrow")}</p>
        <h1>{t("gallery.headline")}</h1>
        <p>{t("gallery.description")}</p>

        <div className={styles.buttonRow}>
          <Link href="/services" className={styles.primaryButton}>
            {t("gallery.startOrder")}
          </Link>

          <Link href="/contact" className={styles.secondaryButton}>
            {t("gallery.askQuestion")}
          </Link>
        </div>
      </section>

      <section className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <p className={styles.filterEyebrow}>
            {t("gallery.browseByCategory", "Browse by category")}
          </p>
          <h2>{t("gallery.filterTitle", "Filter Gallery")}</h2>
        </div>

        <div className={styles.filterButtons}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.filterButton} ${
                selectedCategory === category.id
                  ? styles.filterButtonActive
                  : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.galleryGrid}>
        {visiblePhotos.map((photo) => (
          <button
            key={photo.image}
            type="button"
            className={styles.photoCard}
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className={styles.imageWrap}>
              <img src={photo.image} alt={photo.title} />
            </div>

            <div className={styles.photoText}>
              <span>
                {t(categoryKeyMap[photo.category] ?? "gallery.customCakes")}
              </span>
              <h2>{photo.title}</h2>
              <p>{t("gallery.clickForDetails")}</p>
            </div>
          </button>
        ))}
      </section>

      <section className={styles.ctaSection}>
        <h2>{t("gallery.customEyebrow")}</h2>
        <p>{t("gallery.customText")}</p>

        <div className={styles.buttonRow}>
          <Link href="/services" className={styles.primaryButton}>
            {t("gallery.orderOnline")}
          </Link>

          <Link href="/policies" className={styles.secondaryButton}>
            {t("gallery.viewPolicies")}
          </Link>
        </div>
      </section>
  
      {selectedPhoto ? (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedPhoto(null)}
          role="presentation"
        >
          <article
            className={styles.detailModal}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeModalButton}
              onClick={() => setSelectedPhoto(null)}
              aria-label={t("gallery.close")}
            >
              ✕
            </button>

            <div className={styles.modalImageWrap}>
              <img src={selectedPhoto.image} alt={selectedPhoto.title} />
            </div>

            <div className={styles.modalText}>
              <p className={styles.modalCategory}>
                {t(
                  categoryKeyMap[selectedPhoto.category] ??
                    "gallery.customCakes"
                )}
              </p>

              <h2>{selectedPhoto.title}</h2>
              <p>{selectedPhoto.description}</p>

              <div className={styles.infoBox}>
                <span>{t("gallery.details")}</span>
                <p>{selectedPhoto.details}</p>
              </div>

              <div className={styles.infoBox}>
                <span>{t("gallery.goodFor")}</span>
                <p>{selectedPhoto.goodFor}</p>
              </div>

              <div className={styles.modalButtons}>
                <Link href="/services" className={styles.primaryButton}>
                  {t("gallery.startOrder")}
                </Link>

                <Link href="/contact" className={styles.secondaryButton}>
                  {t("gallery.askAboutThis")}
                </Link>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
}