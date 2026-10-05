import { useMemo } from "react";
import { useOrdersStore } from "../store/ordersStore";
import { formatCurrency } from "../utils/formatCurrency";

const statuses = ["Pending", "Preparing", "Delivering", "Delivered"];

export default function Dashboard() {
  const orders = useOrdersStore((state) => state.orders);

  const metrics = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const dishCounts = orders.flatMap((order) => order.items || []).reduce((counts, item) => {
      counts[item.name] = (counts[item.name] || 0) + (item.quantity || 1);
      return counts;
    }, {});
    const topDishes = Object.entries(dishCounts)
      .sort(([, first], [, second]) => second - first)
      .slice(0, 5);
    const statusCounts = statuses.map((status) => ({
      status,
      count: orders.filter((order) => order.status === status).length,
    }));

    return {
      revenue,
      average: orders.length ? revenue / orders.length : 0,
      topDishes,
      statusCounts,
    };
  }, [orders]);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="section-kicker">Overview</p>
          <h2>Dashboard</h2>
          <p>Monitor Addis Eats performance from one place.</p>
        </div>
        <span className="admin-live-badge">Live data</span>
      </div>

      <div className="admin-metric-grid">
        <article className="admin-metric-card"><span>Revenue</span><strong>{formatCurrency(metrics.revenue)}</strong></article>
        <article className="admin-metric-card"><span>Orders</span><strong>{orders.length}</strong></article>
        <article className="admin-metric-card"><span>Average order</span><strong>{formatCurrency(metrics.average)}</strong></article>
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading"><h3>Top dishes</h3><span>Units ordered</span></div>
          {metrics.topDishes.length === 0 ? <p className="admin-muted">Orders will populate this list.</p> : (
            <ol className="admin-ranking-list">
              {metrics.topDishes.map(([name, count]) => <li key={name}><span>{name}</span><strong>{count}</strong></li>)}
            </ol>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-heading"><h3>Order status</h3><span>Current queue</span></div>
          <div className="status-breakdown">
            {metrics.statusCounts.map(({ status, count }) => <div key={status}><span>{status}</span><strong>{count}</strong></div>)}
          </div>
        </section>
      </div>
    </section>
  );
}
