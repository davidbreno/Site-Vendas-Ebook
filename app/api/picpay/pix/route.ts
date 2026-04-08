import { NextRequest, NextResponse } from "next/server";

type CartItem = {
  title?: string;
  quantity?: number;
  unitPrice?: number;
};

export async function POST(req: NextRequest) {
  try {
    const clientId = process.env.PICPAY_CLIENT_ID;
    const clientSecret = process.env.PICPAY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          error: "Credenciais PicPay não configuradas.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      amount,
      buyer,
      items,
      referenceId,
      callbackUrl,
      returnUrl,
    }: {
      amount: number;
      buyer?: {
        firstName?: string;
        lastName?: string;
        document?: string;
        email?: string;
        phone?: string;
      };
      items?: CartItem[];
      referenceId?: string;
      callbackUrl?: string;
      returnUrl?: string;
    } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Valor inválido para cobrança." },
        { status: 400 }
      );
    }

    const authResponse = await fetch("https://api.picpay.com/oauth2/token", {
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

    const authData = await authResponse.json();

    if (!authResponse.ok || !authData.access_token) {
      return NextResponse.json(
        {
          error: "Não foi possível autenticar no PicPay.",
          picpay_response: authData,
        },
        { status: authResponse.status || 500 }
      );
    }

    const orderReference =
      referenceId || `pedido-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payload = {
      paymentSource: "GATEWAY",
      modality: "PIX",
      value: Number(amount),
      currency: "BRL",
      referenceId: orderReference,
      callbackUrl:
        callbackUrl || `${req.nextUrl.origin}/api/picpay/webhook`,
      returnUrl: returnUrl || `${req.nextUrl.origin}/pedido/sucesso`,
      buyer: buyer
        ? {
            firstName: buyer.firstName || "Cliente",
            lastName: buyer.lastName || "Site",
            document: buyer.document,
            email: buyer.email,
            phone: buyer.phone,
          }
        : undefined,
      items: Array.isArray(items)
        ? items.map((item, index) => ({
            referenceId: `item-${index + 1}`,
            name: item.title || `Produto ${index + 1}`,
            quantity: Number(item.quantity || 1),
            unitPrice: Number(item.unitPrice || 0),
          }))
        : undefined,
    };

    const paymentResponse = await fetch(
      "https://api.picpay.com/checkout/v2/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
          "Content-Type": "application/json",
          "x-picpay-e2e-id": crypto.randomUUID(),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      return NextResponse.json(
        {
          error: "Falha ao criar cobrança PIX no PicPay.",
          picpay_status: paymentResponse.status,
          picpay_response: paymentData,
        },
        { status: paymentResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      order: paymentData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro interno ao criar PIX.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}