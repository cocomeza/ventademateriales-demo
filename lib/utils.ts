import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
}

export function formatWhatsAppMessage(
  items: Array<{ name: string; quantity: number; price: number }>,
  subtotal: number,
  discountAmount: number,
  total: number,
  customerName: string,
  customerPhone: string,
  customerEmail: string
): string {
  const itemsText = items
    .map(
      (item) =>
        `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  let message = `¡Hola! Quiero realizar el siguiente pedido:

${itemsText}

*Subtotal: ${formatPrice(subtotal)}*`;

  if (discountAmount > 0) {
    message += `\n*Descuento: -${formatPrice(discountAmount)}*`;
  }

  message += `\n*Total: ${formatPrice(total)}*

*Datos del cliente:*
Nombre: ${customerName}
Teléfono: ${customerPhone}
Email: ${customerEmail}

Gracias!`;

  return message;
}

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return "";
          if (typeof value === "object") return JSON.stringify(value);
          return String(value).includes(",") ? `"${value}"` : value;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSV(csvText: string): any[] {
  const lines = csvText.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    data.push(row);
  }

  return data;
}

