"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import BottomSheetNav from "@/app/components/BottomSheetNav";

const categories = [
  "All",
  "Custom Cakes",
  "Menu Cakes",
  "Pastries",
  "Bakery Case",
];

type GalleryPhoto = {
  title: string;
  category: string;
  image: string;
  description: string;
  details: string;
  goodFor: string;
};

const galleryPhotos: GalleryPhoto[] = [
  {
    title: "Custom Floral Cake",
    category: "Custom Cakes",
    image: "/images/gallery1.jpg",
    description:
      "A custom decorated cake design that can be adjusted by color, size, flavor, and theme.",
    details:
      "Placeholder info: final flavor, filling, frosting, and decorations can be confirmed with Andy’s Bakery.",
    goodFor: "Birthdays, family events, celebrations",
  },
  {
    title: "Character Birthday Cake",
    category: "Custom Cakes",
    image: "/images/gallery2.jpg",
    description:
      "A themed birthday cake example with custom decorations and character-inspired details.",
    details:
      "Placeholder info: design details can vary based on theme, serving size, and availability.",
    goodFor: "Kids birthdays, themed parties",
  },
  {
    title: "Celebration Cake",
    category: "Custom Cakes",
    image: "/images/gallery3.jpg",
    description:
      "A decorated celebration cake that can be customized for different events and styles.",
    details:
      "Placeholder info: customer can request colors, message, flavor, filling, and frosting.",
    goodFor: "Birthdays, graduations, family gatherings",
  },
  {
    title: "Dulce de Leche Cake",
    category: "Menu Cakes",
    image: "/images/gallery4.jpg",
    description:
      "A menu-style cake option featuring dulce de leche flavor inspiration.",
    details:
      "Placeholder info: final cake layers, filling, and frosting details should be confirmed before launch.",
    goodFor: "Dessert tables, birthdays, family celebrations",
  },
  {
    title: "Sonic Birthday Cake",
    category: "Custom Cakes",
    image: "/images/gallery5.jpg",
    description:
      "A themed custom cake example made for a birthday celebration.",
    details:
      "Placeholder info: themed cakes may vary depending on customer request and decoration complexity.",
    goodFor: "Kids birthdays, themed parties",
  },
  {
    title: "Lavender Birthday Cake",
    category: "Custom Cakes",
    image: "/images/gallery6.jpg",
    description:
      "A soft decorative birthday cake with a clean custom design.",
    details:
      "Placeholder info: colors, decorations, and writing can be customized.",
    goodFor: "Birthdays, small celebrations",
  },
  {
    title: "Heart Cake",
    category: "Custom Cakes",
    image: "/images/gallery7.jpg",
    description:
      "A heart-shaped custom cake design for special occasions.",
    details:
      "Placeholder info: available flavors, fillings, and design options should be finalized with the bakery.",
    goodFor: "Birthdays, anniversaries, romantic celebrations",
  },
  {
    title: "Bakery Case",
    category: "Bakery Case",
    image: "/images/gallery8.jpg",
    description:
      "A look at bakery items and dessert options available from Andy’s Bakery.",
    details:
      "Placeholder info: availability may change depending on the day and order schedule.",
    goodFor: "Walk-in style inspiration, dessert trays",
  },
  {
    title: "Dulce de Leche Celebration Cake",
    category: "Menu Cakes",
    image: "/images/gallery9.jpg",
    description:
      "A cake option inspired by dulce de leche and classic bakery flavors.",
    details:
      "Placeholder info: final price, size, and flavor details should be confirmed.",
    goodFor: "Family parties, birthdays, dessert tables",
  },
  {
    title: "Fruit Tart",
    category: "Pastries",
    image: "/images/gallery10.jpg",
    description:
      "A fruit tart dessert option with fresh fruit presentation.",
    details:
      "Placeholder price: around $4.00 each. Final price should be confirmed.",
    goodFor: "Dessert trays, parties, individual treats",
  },
  {
    title: "Dessert Tarts",
    category: "Pastries",
    image: "/images/gallery11.jpg",
    description:
      "Small tart-style pastries that work well for dessert tables and gatherings.",
    details:
      "Placeholder info: flavors, topping options, and pricing should be confirmed.",
    goodFor: "Dessert tables, parties, small events",
  },
  {
    title: "Custom Communion Cake",
    category: "Custom Cakes",
    image: "/images/galley12.jpg",
    description:
      "A custom event cake example for a special religious or family celebration.",
    details:
      "Placeholder info: decorations, colors, and serving size can be adjusted.",
    goodFor: "Communions, baptisms, family events",
  },
  {
    title: "Rose Tier Cake",
    category: "Custom Cakes",
    image: "/images/gallery13.jpg",
    description:
      "A tiered custom cake design with floral decoration inspiration.",
    details:
      "Placeholder info: tiered cakes may require custom pricing based on size and detail.",
    goodFor: "Weddings, birthdays, large celebrations",
  },
  {
    title: "Elegant Custom Cake",
    category: "Custom Cakes",
    image: "/images/galerry14.jpg",
    description:
      "An elegant custom cake example with decorative details.",
    details:
      "Placeholder info: final design, filling, frosting, and price should be confirmed.",
    goodFor: "Formal events, birthdays, celebrations",
  },
  {
    title: "Blue Rose Tier Cake",
    category: "Custom Cakes",
    image: "/images/gallery15.jpg",
    description:
      "A custom tier cake with blue floral decoration.",
    details:
      "Placeholder info: colors and floral details can be adjusted based on customer request.",
    goodFor: "Birthdays, formal events, large celebrations",
  },
  {
    title: "Elegant Gold Cake",
    category: "Custom Cakes",
    image: "/images/gallery16.jpg",
    description:
      "A decorated custom cake with elegant gold-inspired details.",
    details:
      "Placeholder info: final decorations and pricing depend on cake size and complexity.",
    goodFor: "Adult birthdays, formal celebrations",
  },
  {
    title: "Ocean Theme Cake",
    category: "Custom Cakes",
    image: "/images/gallery17.jpg",
    description:
      "A custom themed cake example with ocean-style decoration.",
    details:
      "Placeholder info: custom themes can be adjusted by color, flavor, and cake size.",
    goodFor: "Kids birthdays, themed events",
  },
  {
    title: "Bakery Display",
    category: "Bakery Case",
    image: "/images/gallery19.jpg",
    description:
      "A display of bakery items and dessert options.",
    details:
      "Placeholder info: availability may change depending on orders and baking schedule.",
    goodFor: "Dessert inspiration, bakery variety",
  },
  {
    title: "Pink Sheet Cake",
    category: "Custom Cakes",
    image: "/images/gallery20.jpg",
    description:
      "A custom sheet cake design with pink decoration.",
    details:
      "Placeholder info: sheet cakes can be customized with writing, color, and flavor options.",
    goodFor: "Birthdays, family parties, larger servings",
  },
  {
    title: "Dulce de Leche & Peach Cake",
    category: "Menu Cakes",
    image: "/images/Dulce_de_Leche_&_Peach.jpg",
    description:
      "A menu cake option with dulce de leche and peach flavor inspiration.",
    details:
      "Placeholder info: final layers, filling, frosting, size, and price should be confirmed.",
    goodFor: "Birthdays, dessert tables, family gatherings",
  },
  {
    title: "Italian Meringue Cake",
    category: "Menu Cakes",
    image: "/images/Italian_Meringue.jpg",
    description:
      "A cake option featuring Italian meringue-style frosting.",
    details:
      "Placeholder info: final cake flavor, filling, and size options should be confirmed.",
    goodFor: "Birthdays, celebrations, classic cake orders",
  },
  {
    title:"Thousand Layer Cake",
    category: "Menu Cakes",
    image: "/images/Thousand_Layer_ With_Dulce_de_Leche.jpg",
    description:
      "A layered cake option with dulce de leche inspiration.",
    details:
      "Placeholder info: final name, serving sizes, and pricing should be confirmed.",
    goodFor: "Family parties, dessert tables, special occasions",
  },
  {
    title: "Black Forest Cake",
    category: "Menu Cakes",
    image: "/images/selva_negra.jpg",
    description:
      "A Black Forest-style cake option with chocolate and cherry flavor inspiration.",
    details:
      "Placeholder info: final ingredients, filling, frosting, and price should be confirmed.",
    goodFor: "Birthdays, chocolate lovers, celebrations",
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const visiblePhotos = useMemo(() => {
    if (activeCategory === "All") return galleryPhotos;

    return galleryPhotos.filter(
      (photo) => photo.category === activeCategory
    );
  }, [activeCategory]);

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
      <BottomSheetNav />
      
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Andy’s Bakery Gallery</p>
        <h1>Custom cakes, pastries, and sweet creations.</h1>
        <p>
          Browse recent bakery work, custom cake ideas, and menu favorites.
          Custom designs can vary based on size, theme, flavor, and availability.
        </p>

        <div className={styles.buttonRow}>
          <Link href="/services" className={styles.primaryButton}>
            Start an Order
          </Link>

          <Link href="/contact" className={styles.secondaryButton}>
            Ask a Question
          </Link>
        </div>
      </section>

      <section className={styles.filterSection}>
        <p>Filter gallery</p>

        <div className={styles.filterButtons}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? `${styles.filterButton} ${styles.activeFilterButton}`
                  : styles.filterButton
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
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
              <span>{photo.category}</span>
              <h2>{photo.title}</h2>
              <p>Click for details</p>
            </div>
          </button>
        ))}
      </section>

      <section className={styles.ctaSection}>
        <h2>Want something custom?</h2>
        <p>
          Send inspiration photos, serving size, colors, flavors, and the date
          you need it. Andy’s Bakery can follow up with details.
        </p>

        <div className={styles.buttonRow}>
          <Link href="/services" className={styles.primaryButton}>
            Order Online
          </Link>

          <Link href="/policies" className={styles.secondaryButton}>
            View Policies
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
              aria-label="Close gallery details"
            >
              ✕
            </button>

            <div className={styles.modalImageWrap}>
              <img src={selectedPhoto.image} alt={selectedPhoto.title} />
            </div>

            <div className={styles.modalText}>
              <p className={styles.modalCategory}>{selectedPhoto.category}</p>
              <h2>{selectedPhoto.title}</h2>
              <p>{selectedPhoto.description}</p>

              <div className={styles.infoBox}>
                <span>Details</span>
                <p>{selectedPhoto.details}</p>
              </div>

              <div className={styles.infoBox}>
                <span>Good For</span>
                <p>{selectedPhoto.goodFor}</p>
              </div>

              <div className={styles.modalButtons}>
                <Link href="/services" className={styles.primaryButton}>
                  Start an Order
                </Link>

                <Link href="/contact" className={styles.secondaryButton}>
                  Ask About This
                </Link>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
}