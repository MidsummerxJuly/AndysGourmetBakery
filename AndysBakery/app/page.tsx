"use client";

import Image from "next/image";
import Link from "next/link";
import BottomSheetNav from "./components/BottomSheetNav";
import styles from "./page.module.css";
import { useLanguage } from "./context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  const featuredItems = [
    {
      title: t("home.customCakesTitle"),
      description: t("home.customCakesDescription"),
      image: "/images/gallery13.jpg",
      href: "/gallery",
    },
    {
      title: t("home.menuCakesTitle"),
      description: t("home.menuCakesDescription"),
      image: "/images/Italian_Meringue.jpg",
      href: "/services",
    },
    {
      title: t("home.pastriesTitle"),
      description: t("home.pastriesDescription"),
      image: "/images/gallery10.jpg",
      href: "/services",
    },
  ];

  const quickInfo = [
    {
      title: t("home.orderOnlineTitle"),
      text: t("home.orderOnlineText"),
    },
    {
      title: t("home.customDesignsTitle"),
      text: t("home.customDesignsText"),
    },
    {
      title: t("home.localPickupTitle"),
      text: t("home.localPickupText"),
    },
  ];

  return (
    <main className={styles.homePage}>
      <BottomSheetNav />

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.logoBadge}>
            <Image
              src="/images/andy-logo-transparent.png"
              alt="Andy’s Gourmet Bakery logo"
              width={120}
              height={120}
              className={styles.logo}
              priority
            />

            <div>
              <p className={styles.eyebrow}>{t("home.eyebrow")}</p>
              <p className={styles.smallText}>{t("home.location")}</p>
            </div>
          </div>

          <h1>{t("home.headline")}</h1>

          <p className={styles.heroDescription}>{t("home.description")}</p>

          <div className={styles.buttonRow}>
            <Link href="/services" className={styles.primaryButton}>
              {t("home.startOrder")}
            </Link>

            <Link href="/gallery" className={styles.secondaryButton}>
              {t("home.viewGallery")}
            </Link>
          </div>

          <div className={styles.heroContact}>
            <span>📞 {t("home.phone")}</span>
            <span>🧁 {t("home.address")}</span>
          </div>
        </div>

        <div className={styles.heroImages}>
          <div className={styles.largeImageCard}>
            <Image
              src="/images/gallery15.jpg"
              alt="Custom blue rose cake"
              width={700}
              height={800}
              className={styles.heroImage}
              priority
            />
          </div>

          <div className={styles.smallImageCard}>
            <Image
              src="/images/gallery10.jpg"
              alt="Fruit tart"
              width={360}
              height={280}
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.infoGrid}>
        {quickInfo.map((item) => (
          <article key={item.title} className={styles.infoCard}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>{t("home.favoritesEyebrow")}</p>
          <h2>{t("home.favoritesHeadline")}</h2>
          <p>{t("home.favoritesNote")}</p>
        </div>

        <div className={styles.featuredGrid}>
          {featuredItems.map((item) => (
            <article key={item.title} className={styles.featuredCard}>
              <div className={styles.featuredImageWrap}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={520}
                  height={420}
                  className={styles.featuredImage}
                />
              </div>

              <div className={styles.featuredText}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <Link href={item.href} className={styles.cardLink}>
                  {t("home.viewItem")} {item.title}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.customSection}>
        <div>
          <p className={styles.eyebrow}>{t("home.customOrdersEyebrow")}</p>
          <h2>{t("home.customOrdersHeadline")}</h2>
          <p>{t("home.customOrdersText")}</p>
        </div>

        <div className={styles.customButtons}>
          <Link href="/services" className={styles.primaryButton}>
            {t("home.orderCustomCake")}
          </Link>

          <Link href="/contact" className={styles.secondaryButton}>
            {t("home.contactBakery")}
          </Link>
        </div>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.eyebrow}>{t("home.ctaEyebrow")}</p>
        <h2>{t("home.ctaHeadline")}</h2>
        <p>{t("home.ctaText")}</p>

        <div className={styles.buttonRow}>
          <Link href="/services" className={styles.primaryButton}>
            {t("home.startOrder")}
          </Link>

          <Link href="/policies" className={styles.secondaryButton}>
            {t("home.viewPolicies")}
          </Link>
        </div>
      </section>
    </main>
  );
}
