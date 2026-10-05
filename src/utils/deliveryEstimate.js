const deliveryAreas = {
  Bole: { fee: 80, minutes: 30 },
  Kazanchis: { fee: 90, minutes: 35 },
  Piazza: { fee: 100, minutes: 40 },
  Atlas: { fee: 85, minutes: 35 },
};

export function getDeliveryEstimate(area) {
  return deliveryAreas[area] || { fee: 120, minutes: 45 };
}
