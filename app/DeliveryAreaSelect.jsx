"use client";

import { useCart } from "./providers";

export default function DeliveryAreaSelect({ compact = false }) {
  const { deliveryArea, setDeliveryArea } = useCart();

  return (
    <label className={`delivery-area-select${compact ? " compact" : ""}`}>
      {!compact && <span>Delivery neighborhood</span>}
      <select
        aria-label="Delivery neighborhood"
        value={deliveryArea}
        onChange={(event) => setDeliveryArea(event.target.value)}
      >
        <option value="Bole">Bole</option>
        <option value="Kazanchis">Kazanchis</option>
        <option value="Piazza">Piazza</option>
        <option value="CMC">CMC</option>
      </select>
    </label>
  );
}