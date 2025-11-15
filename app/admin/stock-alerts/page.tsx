import { StockAlerts } from "@/components/admin/stock-alerts";

export default function AdminStockAlertsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Alertas de Stock</h1>
      </div>
      <StockAlerts />
    </div>
  );
}

