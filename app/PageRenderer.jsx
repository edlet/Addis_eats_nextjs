import ClientApp from "@/src/ClientApp";
import { getDishes } from "@/app/lib/dishes";

export default async function PageRenderer() {
  const dishes = await getDishes();
  return <ClientApp dishes={dishes} />;
}
