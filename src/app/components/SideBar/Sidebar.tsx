import { getNavItems } from "./actions/getNavItems";
import { ClientSidebar } from "./ClientSidebar";

export async function SideBar() {
  const navItems = await getNavItems();

  return <ClientSidebar navItems={navItems} />;
}
