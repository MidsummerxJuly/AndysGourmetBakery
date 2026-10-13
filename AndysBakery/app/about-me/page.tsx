"use client";

import BottomSheetNav from "@/app/components/BottomSheetNav";
import styles from "./page.module.css";
import Link from "next/link";
import {useLanguage} from "@/app/context/LanguageContext";

export default function AboutMePage() {
    const {t} = useLanguage();

    return (
        <main className={styles.aboutPage}>
            <BottomSheetNav/>

            <section className={styles.heroSection}>
                <p className={styles.eyebrow}>
                    {t("about.eyebrow", "About Andy's Bakery")}
                </p>

                <h1>{t("about.title", "Meet Andy")}</h1>

                <p>
                    {t(
                        "about.heroText",
                        "Hi, I’m Andrea Chereau!, baking has been my passion for over 15 years. What started off as homemade baking for friends and family has grown into a journey filled with creativity and love for creating delicious desserts. Throughout the years, I have continued developing my skills by taking courses in gastronomy and pastry design. I truly enjoy experimenting and putting my own personal touch into every cake and dessert I make!"
                    )}
                </p>

                <div className={styles.buttonRow}>
                    <Link href="/services" className={styles.primaryButton}>
                        {t("about.orderOnline", "Order Online")}
                    </Link>

                    <Link href="/contact" className={styles.secondaryButton}>
                        {t("about.contactUs", "Contact Us")}
                    </Link>
                </div>
            </section>

            <section className={styles.storySection}>
                <div className={styles.storyText}>
                    <p className={styles.eyebrow}>
                        {t("about.storyEyebrow", "Our Story")}
                    </p>

                    <h2>
                        {t(
                            "about.storyTitle",
                            "Made from home, shared with the community"
                        )}
                    </h2>

                    <p>
                        {t(
                            "about.storyTextOne",
                            "My cakes are inspired by the traditional flavors and styles of Chile, bringing a taste of Chilean baking to every occasion. At the same time, I cherish working closely with my customers to create cakes tailored to their individual tastes, whether it’s a favorite flavor, filling, or special design. All of the products and ingredients I use are Kosher, allowing me to provide quality desserts made with care and attention to every detail."
                        )}
                    </p>

                    <p>
                        {t(
                            "about.storyTextTwo",
                            "Since 2023, I have opened my own bakery, proudly serving the community from Davie. Every creation is made with love, creativity, and the goal of making your every occasion even sweeter!"
                        )}
                    </p>
                </div>

                <div className={styles.valuesColumn}>
                    <section className={styles.valuesSection}>
                        <div className={styles.valuesHeader}>
                        <h3>{t("Homemade Care")}</h3>
                        <ul>
                            <li>
                                {t(
                                    "Made with attention, love, and care"
                                )}
                            </li>
                        </ul>
                        </div>
                        <div className={styles.valuesHeader}>
                        <h3>{t("Custom Designs & Desserts")}</h3>

                        <ul>
                            <li>
                                {t(
                                    "Cakes made for your events."
                                )}
                            </li>
                        </ul>
                        </div>
                        <div className={styles.valuesHeader}>
                        <h3>{t("Chilean Flavor")}</h3>

                        <ul>
                            <li>
                                {t(
                                    "Inspired by Chilean traditions."
                                )}
                            </li>
                        </ul>
                        </div>
                    </section>

                    <div className={styles.storyCard}>
                        <h3>{t("about.specialTitle", "What makes us special")}</h3>

                        <ul>
                            <li>
                                {t(
                                    "about.specialOne",
                                    "Custom cakes for birthdays and events"
                                )}
                            </li>
                            <li>
                                {t(
                                    "about.specialTwo",
                                    "Homemade desserts with a personal touch"
                                )}
                            </li>
                            <li>
                                {t(
                                    "about.specialThree",
                                    "Pickup orders made with care and planning"
                                )}
                            </li>
                            <li>
                                {t(
                                    "All kosher ingredients"
                                )}
                            </li>
                            <li>
                                {t(
                                    "Served with positivity"
                                )}
                            </li>
                        </ul>
                    </div>
                </div>

                {/*<section className={styles.valuesSection}>*/}
                {/*    /!*<div className={styles.valuesHeader}>*!/*/}
                {/*    /!*    <p className={styles.eyebrow}>*!/*/}
                {/*    /!*        {t("about.valuesEyebrow", "Our Values")}*!/*/}
                {/*    /!*    </p>*!/*/}

                {/*    /!*    <h2>*!/*/}
                {/*    /!*        {t(*!/*/}
                {/*    /!*            "about.valuesTitle",*!/*/}
                {/*    /!*            "What makes every dessert special"*!/*/}
                {/*    /!*        )}*!/*/}
                {/*    /!*    </h2>*!/*/}

                {/*    /!*    <p>*!/*/}
                {/*    /!*        {t(*!/*/}
                {/*    /!*            "about.valuesText",*!/*/}
                {/*    /!*            "Every order is made with care, creativity, and a personal touch."*!/*/}
                {/*    /!*        )}*!/*/}
                {/*    /!*    </p>*!/*/}
                {/*    /!*</div>*!/*/}

                {/*    /!*<div className={styles.valuesGrid}>*!/*/}
                {/*    /!*    <div className={styles.valueCard}>*!/*/}
                {/*    /!*        <h3>{t("about.valueOneTitle", "Homemade Care")}</h3>*!/*/}
                {/*    /!*        <p>*!/*/}
                {/*    /!*            {t(*!/*/}
                {/*    /!*                "about.valueOneText",*!/*/}
                {/*    /!*                "Made with attention, love, and care."*!/*/}
                {/*    /!*            )}*!/*/}
                {/*    /!*        </p>*!/*/}
                {/*    /!*    </div>*!/*/}

                {/*    /!*    <div className={styles.valueCard}>*!/*/}
                {/*    /!*        <h3>*!/*/}
                {/*    /!*            {t(*!/*/}
                {/*    /!*                "about.valueTwoTitle",*!/*/}
                {/*    /!*                "Custom Designs & Desserts"*!/*/}
                {/*    /!*            )}*!/*/}
                {/*    /!*        </h3>*!/*/}
                {/*    /!*        <p>*!/*/}
                {/*    /!*            {t(*!/*/}
                {/*    /!*                "about.valueTwoText",*!/*/}
                {/*    /!*                "Cakes made for your events."*!/*/}
                {/*    /!*            )}*!/*/}
                {/*    /!*        </p>*!/*/}
                {/*    /!*    </div>*!/*/}

                {/*    /!*    <div className={styles.valueCard}>*!/*/}
                {/*    /!*        <h3>{t("about.valueThreeTitle", "Chilean Flavor")}</h3>*!/*/}
                {/*    /!*        <p>*!/*/}
                {/*    /!*            {t(*!/*/}
                {/*    /!*                "about.valueThreeText",*!/*/}
                {/*    /!*                "Inspired by Chilean traditions."*!/*/}
                {/*    /!*            )}*!/*/}
                {/*    /!*        </p>*!/*/}
                {/*    /!*    </div>*!/*/}
                {/*    /!*</div>*!/*/}
                {/*</section>*/}

            </section>

            <section className={styles.familySection}>
                <div className={styles.familyHeader}>
                    <p className={styles.eyebrow}>
                        {t("about.familyEyebrow", "Family Owned")}
                    </p>

                    <h2>
                        {t("about.familyTitle", "From our family to yours")}
                    </h2>

                    <p>
                        {t(
                            "about.familyText",
                            "Behind Andy’s Bakery is a family story built on love, support, and the joy of sharing homemade sweets with the community."
                        )}
                    </p>
                </div>

                <div className={styles.familyGrid}>
                    <div className={styles.familyPhotoCard}>
                        <img
                            src="/images/about/andy-family-1.jpg"
                            alt={t("about.familyPhotoOneAlt", "Andy and her husband")}
                        />
                    </div>

                    <div className={styles.familyPhotoCard}>
                        <img
                            src="/images/about/andy-family-2.jpg"
                            alt={t(
                                "about.familyPhotoTwoAlt",
                                "Andy and her husband smiling together"
                            )}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
