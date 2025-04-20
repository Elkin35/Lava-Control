"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

function PaymentResponseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refPayco = searchParams.get("ref_payco");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!refPayco) return;

      try {
        const response = await fetch(
          `https://secure.epayco.co/validation/v1/reference/${refPayco}`
        );
        const data = await response.json();

        if (data.success && data.data) {
          const status = data.data.x_response;
          setPaymentStatus(status);

          // Si el pago es aceptado, redirigir a la página de activación
          if (status === "Aceptada") {
            try {
                await fetch('/api/ficha/register', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ ref_payco: refPayco })
                });
              } catch (error) {
                console.error("Error registrando ficha:", error);
              }
            setRedirecting(true);
            setTimeout(() => {
                router.push(`/activate?ref=${refPayco}`);
            }, 2000); // Redirigir después de 2 segundos para que el usuario vea el mensaje de éxito
          }
        } else {
          setPaymentStatus("Error consultando el pago");
        }
      } catch (error) {
        console.error("Error consultando ePayco:", error);
        setPaymentStatus("Error en la validación");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [refPayco, router, setPaymentStatus]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-slate-700">Verificando estado del pago...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
      <div className="max-w-md bg-white/90 rounded-3xl shadow-2xl border border-slate-100 backdrop-blur-lg overflow-hidden">
        <div className="p-8">
          {paymentStatus === "Aceptada" ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">
                ¡Pago aprobado!
              </h1>
              <p className="text-slate-600 mb-4">
                Tu transacción ha sido procesada exitosamente.
              </p>
              <div className="bg-slate-50 w-full rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-500">Referencia de pago</p>
                <p className="text-lg font-medium text-slate-800">{refPayco}</p>
              </div>
              {redirecting ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-indigo-600">
                    Redirigiendo a activación de ficha...
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => router.push("/activate")}
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <span>Activar Ficha</span>
                </button>
              )}
            </div>
          ) : paymentStatus === "Pendiente" ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <Clock size={40} className="text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-yellow-600 mb-2">
                Pago pendiente
              </h1>
              <p className="text-slate-600 mb-4">
                Tu transacción está siendo procesada. Por favor, espera un
                momento.
              </p>
              <div className="bg-slate-50 w-full rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-500">Referencia de pago</p>
                <p className="text-lg font-medium text-slate-800">{refPayco}</p>
              </div>
              <div className="bg-slate-50 w-full rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-500">Estado</p>
                <p className="text-lg font-medium text-yellow-600">
                  {paymentStatus}
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full h-12 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <span>Verificar nuevamente</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                {paymentStatus?.includes("Error") ? (
                  <AlertCircle size={40} className="text-red-600" />
                ) : (
                  <XCircle size={40} className="text-red-600" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">
                Pago no completado
              </h1>
              <p className="text-slate-600 mb-4">
                {paymentStatus?.includes("Error")
                  ? "Ocurrió un error al procesar tu pago."
                  : "Tu transacción ha sido rechazada."}
              </p>
              <div className="bg-slate-50 w-full rounded-xl p-4 mb-4">
                <p className="text-sm text-slate-500">Referencia de pago</p>
                <p className="text-lg font-medium text-slate-800">
                  {refPayco || "No disponible"}
                </p>
              </div>
              <div className="bg-slate-50 w-full rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-500">Estado</p>
                <p className="text-lg font-medium text-red-600">
                  {paymentStatus}
                </p>
              </div>
              <button
                onClick={() => router.push("/")}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <span>Volver al inicio</span>
              </button>
            </div>
          )}
        </div>

        {/* Logo */}
        <div className="p-8 pt-0 flex justify-center">
          <div>
            <span className="text-indigo-600 text-2xl font-bold">LAVA</span>
            <span className="text-slate-700 text-2xl font-light">CONTROL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentResponsePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-slate-700">Cargando...</p>
        </div>
      }
    >
      <PaymentResponseContent />
    </Suspense>
  );
}
