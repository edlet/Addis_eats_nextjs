import HomePage from "./HomePage";
import Day40Shell from "./Day40Shell";
import { dishes } from "./menu/dishes";

export default function Home() {
  return <Day40Shell><HomePage dishes={dishes.slice(0, 4)} /></Day40Shell>;
}
