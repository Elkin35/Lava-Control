"use client";

import { useEffect } from "react";
import { Ticket } from 'lucide-react';

function transactionCode() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}${month}${day}001`;
}

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.epayco.co/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = () => {
    const handler = window.ePayco.checkout.configure({
      key: "b33c81c921bf2d213526981fcf590ec6",
      test: false,
    });

    handler.open({
      external: false,
      amount: "5000",
      tax: "0",
      tax_base: "5000",
      name: "Ficha LavaControl",
      description: "Ficha LavaControl",
      currency: "cop",
      country: "co",
      response: "https://lava-control.vercel.app/payment/response",
      confirmation: "https://lava-control.vercel.app/api/payment/confirm",
      lang: "es",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
      <div className="w-full max-w-6xl h-auto relative bg-white/90 rounded-3xl shadow-2xl border border-slate-100 backdrop-blur-lg overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl overflow-hidden flex items-center justify-center">
                <Ticket stroke="white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                Ficha LavaControl
              </h1>
            </div>
            <p className="text-slate-500 mb-8">
              Ficha para una lavada y una secada de ropa.
            </p>
          </div>

          {/* Botón de pago */}
          <button
            onClick={handlePayment}
            className="w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <span>Pagar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Logo */}
          <div className="mt-6 mb-4">
            <span className="text-indigo-600 text-3xl font-bold">LAVA</span>
            <span className="text-slate-700 text-3xl font-light">CONTROL</span>
          </div>
        </div>

        {/* Resumen */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-slate-50 to-indigo-50 p-8 rounded-l-3xl">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Resumen de Pago
          </h2>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Número de Pedido</span>
                <span className="text-slate-800 font-medium">{ transactionCode() }</span>
              </div>
              <div className="border-b border-slate-100"></div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">IVA</span>
                <span className="text-slate-800 font-medium">NA</span>
              </div>
              <div className="border-b border-slate-100"></div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Ficha LavaControl</span>
                <span className="text-slate-800 font-medium">$ 15.000</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 text-sm mb-1">Monto a Pagar</p>
                <p className="text-slate-800 text-2xl font-bold">
                  $ 15.000<span className="text-lg">,00</span>
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-8 h-5 bg-indigo-600 rounded"></span>
                <span className="w-8 h-5 bg-indigo-300 rounded"></span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 justify-center">
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-sm text-slate-600">Pago Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
