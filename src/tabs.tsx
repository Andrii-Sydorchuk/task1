import AppsIcon from "./assets/icons/fi-rs-apps.svg?react";
import BankIcon from "./assets/icons/fi-rs-bank.svg?react";
import PhoneCallIcon from "./assets/icons/fi-rs-phone-call.svg?react";
import UserAddIcon from "./assets/icons/fi-rs-user-add.svg?react";
import ShopIcon from "./assets/icons/fi-rs-shop.svg?react";
import ChartPieIcon from "./assets/icons/fi-rs-chart-pie.svg?react";
import MailIcon from "./assets/icons/fi-rs-mail.svg?react";
import SettingsIcon from "./assets/icons/fi-rs-settings.svg?react";
import BookIcon from "./assets/icons/fi-rs-book-alt.svg?react";
import CubeIcon from "./assets/icons/fi-rs-cube.svg?react";
import ListIcon from "./assets/icons/fi-rs-list.svg?react";
import ShoppingCartIcon from "./assets/icons/fi-rs-shopping-cart-check.svg?react";
import BrowserIcon from "./assets/icons/fi-rs-browser.svg?react";
import BoxIcon from "./assets/icons/fi-rs-box-alt.svg?react";

export interface Tab {
  label?: string;
  path: string;
  icon: React.ElementType;
  isPinned?: boolean;
}

export const TABS = [
  {
    path: "/",
    icon: BoxIcon,
  },
  {
    label: "Dashboard",
    path: "dashboard",
    icon: AppsIcon,
  },
  {
    label: "Banking",
    path: "banking",
    icon: BankIcon,
  },
  {
    label: "Telefonie",
    path: "telefony",
    icon: PhoneCallIcon,
  },
  {
    label: "Accounting",
    path: "accounting",
    icon: UserAddIcon,
  },
  {
    label: "Verkauf",
    path: "sale",
    icon: ShopIcon,
  },
  {
    label: "Statistik",
    path: "statistics",
    icon: ChartPieIcon,
  },
  {
    label: "Post Office",
    path: "post-office",
    icon: MailIcon,
  },
  {
    label: "Administration",
    path: "admin",
    icon: SettingsIcon,
  },
  {
    label: "Help",
    path: "help",
    icon: BookIcon,
  },
  {
    label: "Warenbestand",
    path: "inventory",
    icon: CubeIcon,
  },
  {
    label: "Auswahllisten",
    path: "shortlists",
    icon: ListIcon,
  },
  {
    label: "Einkauf",
    path: "shopping",
    icon: ShoppingCartIcon,
  },
  {
    label: "Rechn",
    path: "calc",
    icon: BrowserIcon,
  },
] satisfies Tab[];
