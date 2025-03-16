"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth/next";

export async function getNavItems() {
  const session = await getServerSession(authOptions);

  const baseNavItems = [
    { href: "/calendar", icon: "Calendar", text: "Kalendorius" },
    { href: "/account", icon: "User", text: "Paskyra" },
  ];

  const adminNavItems = [
    { href: "/admin", icon: "ShieldCheck", text: "Adminas" },
    {
      href: "/",
      icon: "Mail",
      text: "Eilės",
      subItems: [
        {
          href: "/queues/orders",
          icon: "ShoppingCart",
          text: "Užsakymai",
        },
        {
          href: "/queues",
          icon: "Mail",
          text: "Visos eilės",
        },
        {
          href: "/queues/tags",
          icon: "Tags",
          text: "Tagai",
        },
      ],
    },
    { href: "/email", icon: "SquareLibary", text: "Šablonai" },
  ];

  return session?.user?.role === "ADMIN"
    ? [...adminNavItems, ...baseNavItems]
    : baseNavItems;
}
