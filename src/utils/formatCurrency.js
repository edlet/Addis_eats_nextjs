export function formatCurrency(amount) {
  return `${new Intl.NumberFormat("en-US").format(amount)} ETB`;
}
