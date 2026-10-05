import { requireStaff } from "../lib/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  await requireStaff("/admin");
  return <section>{children}</section>;
}
