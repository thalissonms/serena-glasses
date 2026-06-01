import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { withAdmin } from "@shared/lib/auth/withAdmin";

export const POST = withAdmin(async (req: NextRequest) => {
  const { to } = await req.json();
  if (!to || typeof to !== "string") {
    return NextResponse.json({ error: "Campo 'to' é obrigatório" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY não configurada nas variáveis de ambiente do Vercel" },
      { status: 500 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: `Serena Glasses <${fromEmail}>`,
      to,
      subject: "Teste de email — Serena Glasses",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#FF00B6;margin:0 0 16px">Serena Glasses</h2>
          <p style="color:#111;font-size:15px">Este é um email de teste enviado pelo painel admin.</p>
          <p style="color:#555;font-size:13px">
            <strong>From:</strong> ${fromEmail}<br>
            <strong>To:</strong> ${to}<br>
            <strong>Env:</strong> ${process.env.VERCEL_ENV ?? "local"}
          </p>
          <p style="color:#999;font-size:11px;margin-top:24px">Se recebeu este email, o Resend está funcionando corretamente.</p>
        </div>
      `,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message, detail: result.error },
        { status: 422 },
      );
    }

    return NextResponse.json({ ok: true, id: result.data?.id, from: fromEmail, to });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
});
