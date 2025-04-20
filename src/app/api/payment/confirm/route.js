// app/api/payment/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req) {
    const body = await req.formData(); // ePayco envía application/x-www-form-urlencoded

    const refPayco = body.get('ref_payco');

    console.log('Confirmación recibida de ePayco. ref_payco:', refPayco);

    // Aquí podrías consultar el estado del pago en ePayco si quieres (opcional)
    // También podrías actualizar la base de datos

    return NextResponse.json({ message: 'Confirmation received' }, { status: 200 });
}
