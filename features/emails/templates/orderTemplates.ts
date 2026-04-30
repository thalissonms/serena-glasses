function formatBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

interface ItemRow {
  name: string;
  colorName: string;
  quantity: number;
  price: number;
}

function buildItemRows(items: ItemRow[]): string {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 8px;border-bottom:1px solid #fce7f3;">
          <strong style="font-family:'Poppins',sans-serif;font-size:13px;">${item.name}</strong><br/>
          <span style="font-size:11px;color:#888;">${item.colorName} · ${item.quantity}x</span>
        </td>
        <td style="padding:12px 8px;border-bottom:1px solid #fce7f3;text-align:right;font-family:'Poppins',sans-serif;font-size:13px;white-space:nowrap;">
          ${formatBRL(item.price * item.quantity)}
        </td>
      </tr>`,
    )
    .join("");
}

function buildTotalsRows(subtotal: number, discount: number, total: number, couponCode?: string | null): string {
  if (discount <= 0) {
    return `<tr>
      <td style="padding:16px 8px 0;font-weight:700;font-family:'Poppins',sans-serif;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Total</td>
      <td style="padding:16px 8px 0;text-align:right;font-weight:900;font-family:'Poppins',sans-serif;font-size:18px;color:#FF00B6;">${formatBRL(total)}</td>
    </tr>`;
  }
  return `
    <tr>
      <td style="padding:8px 8px 0;font-size:13px;font-family:'Poppins',sans-serif;color:#555;">Subtotal</td>
      <td style="padding:8px 8px 0;text-align:right;font-size:13px;font-family:'Poppins',sans-serif;color:#555;">${formatBRL(subtotal)}</td>
    </tr>
    <tr>
      <td style="padding:4px 8px 0;font-size:13px;font-family:'Poppins',sans-serif;color:#FF00B6;">Cupom${couponCode ? ` (${couponCode})` : ""}</td>
      <td style="padding:4px 8px 0;text-align:right;font-size:13px;font-family:'Poppins',sans-serif;color:#FF00B6;">-${formatBRL(discount)}</td>
    </tr>
    <tr>
      <td style="padding:16px 8px 0;font-weight:700;font-family:'Poppins',sans-serif;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Total</td>
      <td style="padding:16px 8px 0;text-align:right;font-weight:900;font-family:'Poppins',sans-serif;font-size:18px;color:#FF00B6;">${formatBRL(total)}</td>
    </tr>`;
}

function wrapInLayout(body: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><title>Serena Glasses</title></head>
<body style="margin:0;padding:0;background:#FFF0FA;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF0FA;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:3px solid #000;box-shadow:6px 6px 0 #FF00B6;max-width:100%;">
        <tr>
          <td style="background:#FF00B6;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-family:'Poppins',sans-serif;font-size:26px;font-weight:900;letter-spacing:1px;">SERENA GLASSES</h1>
          </td>
        </tr>
        ${body}
        <tr>
          <td style="background:#111;padding:16px 32px;text-align:center;">
            <p style="margin:0;color:#888;font-size:11px;">© 2025 Serena Glasses. Todos os direitos reservados.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export interface OrderEmailParams {
  orderNumber: string;
  name: string;
  items: ItemRow[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string | null;
}

export function buildOrderConfirmedEmail(params: OrderEmailParams): string {
  const { orderNumber, name, items, subtotal, discount, total, couponCode } = params;
  return wrapInLayout(`
    <tr><td style="padding:32px;">
      <p style="margin:0 0 8px;font-size:16px;color:#111;">Olá, <strong>${name}</strong>!</p>
      <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
        Seu pedido foi confirmado e o pagamento aprovado. Em breve você receberá atualizações sobre o envio.
      </p>
      <div style="background:#FFF0FA;border:2px solid #000;padding:16px 20px;display:inline-block;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888;">Número do pedido</p>
        <p style="margin:0;font-size:20px;font-weight:900;font-family:'Poppins',sans-serif;color:#111;">#${orderNumber}</p>
      </div>
      <h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#111;border-bottom:2px solid #000;padding-bottom:8px;margin:0 0 0;">Itens do pedido</h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${buildItemRows(items)}
        ${buildTotalsRows(subtotal, discount, total, couponCode)}
      </table>
      <p style="margin:28px 0 0;font-size:12px;color:#aaa;text-align:center;line-height:1.6;">
        Dúvidas? Fale com a gente pelo Instagram <strong>@serenaglasses</strong>
      </p>
    </td></tr>`);
}

export function buildOrderReceivedEmail(params: Pick<OrderEmailParams, "orderNumber" | "name">): string {
  const { orderNumber, name } = params;
  return wrapInLayout(`
    <tr><td style="padding:32px;">
      <p style="margin:0 0 8px;font-size:16px;color:#111;">Olá, <strong>${name}</strong>!</p>
      <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
        Recebemos seu pedido! Assim que confirmarmos o pagamento, você receberá outro e-mail com a confirmação.
      </p>
      <div style="background:#FFF0FA;border:2px solid #000;padding:16px 20px;display:inline-block;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888;">Número do pedido</p>
        <p style="margin:0;font-size:20px;font-weight:900;font-family:'Poppins',sans-serif;color:#111;">#${orderNumber}</p>
      </div>
      <p style="margin:28px 0 0;font-size:12px;color:#aaa;text-align:center;line-height:1.6;">
        Dúvidas? Fale com a gente pelo Instagram <strong>@serenaglasses</strong>
      </p>
    </td></tr>`);
}

export function buildOrderShippedEmail(params: { orderNumber: string; name: string; trackingCode?: string; carrier?: string }): string {
  const { orderNumber, name, trackingCode, carrier } = params;
  return wrapInLayout(`
    <tr><td style="padding:32px;">
      <p style="margin:0 0 8px;font-size:16px;color:#111;">Olá, <strong>${name}</strong>!</p>
      <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
        Seu pedido foi enviado! 🚚
      </p>
      <div style="background:#FFF0FA;border:2px solid #000;padding:16px 20px;display:inline-block;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888;">Número do pedido</p>
        <p style="margin:0;font-size:20px;font-weight:900;font-family:'Poppins',sans-serif;color:#111;">#${orderNumber}</p>
      </div>
      ${trackingCode ? `
      <div style="background:#f8f8f8;border:2px solid #000;padding:16px 20px;display:inline-block;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888;">Código de rastreio${carrier ? ` (${carrier})` : ""}</p>
        <p style="margin:0;font-size:16px;font-weight:900;font-family:'Poppins',sans-serif;color:#111;">${trackingCode}</p>
      </div>` : ""}
      <p style="margin:28px 0 0;font-size:12px;color:#aaa;text-align:center;line-height:1.6;">
        Dúvidas? Fale com a gente pelo Instagram <strong>@serenaglasses</strong>
      </p>
    </td></tr>`);
}

export function buildOrderCancelledEmail(params: Pick<OrderEmailParams, "orderNumber" | "name">): string {
  const { orderNumber, name } = params;
  return wrapInLayout(`
    <tr><td style="padding:32px;">
      <p style="margin:0 0 8px;font-size:16px;color:#111;">Olá, <strong>${name}</strong>!</p>
      <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
        Seu pedido foi cancelado. Se você tiver dúvidas ou precisar de ajuda, entre em contato.
      </p>
      <div style="background:#FFF0FA;border:2px solid #000;padding:16px 20px;display:inline-block;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888;">Número do pedido</p>
        <p style="margin:0;font-size:20px;font-weight:900;font-family:'Poppins',sans-serif;color:#111;">#${orderNumber}</p>
      </div>
      <p style="margin:28px 0 0;font-size:12px;color:#aaa;text-align:center;line-height:1.6;">
        Dúvidas? Fale com a gente pelo Instagram <strong>@serenaglasses</strong>
      </p>
    </td></tr>`);
}
