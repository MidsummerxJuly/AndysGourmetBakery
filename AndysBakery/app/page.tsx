import Image from "next/image";
import Link from "next/link";
import BottomSheetNav from "./components/BottomSheetNav";
import styles from "./page.module.css";

const featuredItems = [
  {
    title: "Custom Cakes",
    description:
      "Beautiful custom cakes for birthdays, weddings, family events, and special celebrations.",
    image: "/images/gallery13.jpg",
    href: "/gallery",
  },
  {
    title: "Menu Cakes",
    description:
      "Classic cake options like dulce de leche, Italian meringue, Black Forest, and layered cakes.",
    image: "/images/Italian_Meringue.jpg",
    href: "/services",
  },
  {
    title: "Pastries & Sweets",
    description:
      "Sweet bakery favorites including fruit tarts, alfajores, berlines, chilenitos, and more.",
    image: "/images/gallery10.jpg",
    href: "/services",
  },
];

const quickInfo = [
  {
    title: "Order Online",
    text: "Choose menu items, add them to your basket, and checkout securely online.",
  },
  {
    title: "Custom Designs",
    text: "Send details for theme, colors, flavor, filling, date needed, and serving size.",
  },
  {
    title: "Local Pickup",
    text: "Orders are prepared by Andy’s Bakery and pickup details can be confirmed after ordering.",
  },
];

export default function HomePage() {
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
              <p className={styles.eyebrow}>Andy’s Gourmet Bakery</p>
              <p className={styles.smallText}>Davie, Florida</p>
            </div>
          </div>

          <h1>Custom cakes, pastries, and desserts for every celebration.</h1>

          <p className={styles.heroDescription}>
            Browse bakery favorites, view custom cake inspiration, and place an
            order online for pickup.
          </p>

          <div className={styles.buttonRow}>
            <Link href="/services" className={styles.primaryButton}>
              Start an Order
            </Link>

            <Link href="/gallery" className={styles.secondaryButton}>
              View Gallery
            </Link>
          </div>

          <div className={styles.heroContact}>
            <span>📞 754-242-4383</span>
            <span>🧁 6947 Stirling Road, Davie, FL 33314</span>
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
          <p className={styles.eyebrow}>Bakery Favorites</p>
          <h2>Explore what Andy’s Bakery makes.</h2>
          <p>
            These sections use placeholder descriptions for now. Final names,
            ingredients, and pricing can be adjusted after review.
          </p>
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
                  View {item.title}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.customSection}>
        <div>
          <p className={styles.eyebrow}>Custom Orders</p>
          <h2>Need a cake made for your event?</h2>
          <p>
            Send the date needed, serving size, flavor ideas, colors, theme, and
            any inspiration photos. Andy’s Bakery can review the details and
            follow up if anything needs clarification.
          </p>
        </div>

        <div className={styles.customButtons}>
          <Link href="/services" className={styles.primaryButton}>
            Order a Custom Cake
          </Link>

          <Link href="/contact" className={styles.secondaryButton}>
            Contact the Bakery
          </Link>
        </div>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.eyebrow}>Ready to order?</p>
        <h2>Start your bakery order online.</h2>
        <p>
          Choose your items, confirm your basket, and complete payment through
          secure checkout.
        </p>

        <div className={styles.buttonRow}>
          <Link href="/services" className={styles.primaryButton}>
            Start an Order
          </Link>

          <Link href="/policies" className={styles.secondaryButton}>
            View Policies
          </Link>
        </div>
      </section>
    </main>
  );
}