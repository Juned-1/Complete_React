import Link from "next/link";
import Image from "next/image";
import logoImage from "@/assets/logo.png";
import classes from "./main-headers.module.css";
import MainHeaderBackground from "./main-headers-backgound";
import NavLink from "./nav-link";
export default function MainHeader() {
  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link href="/" className={classes.logo}>
          <Image src={logoImage} alt="An image of food plate" priority />
          NextLevel food
        </Link>
        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink
                href="/meals"
              >
                Browse Meals
              </NavLink>
            </li>
            <li>
              <NavLink
                href="/community"
              >
                Foodies Community
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
