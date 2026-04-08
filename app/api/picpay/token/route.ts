import { NextResponse } from "next/server";

export async function POST() {
  try {
    const clientId = process.env.PICPAY_CLIENT_ID;
    const clientSecret = process.env.PICPAY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          error: "Credenciais PicPay não configuradas no ambiente.",
          details:
            "Defina PICPAY_CLIENT_ID e PICPAY_CLIENT_SECRET no .env.local ou na Vercel.",
        },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.picpay.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Falha ao gerar token PicPay.",
          picpay_status: response.status,
          picpay_response: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      scope: data.scope ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro interno ao solicitar token do PicPay.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}