"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  WashingMachineIcon as Washing,
  Wind,
  Timer,
  AlertCircle,
  Ticket,
} from "lucide-react";

const MACHINE_TIMERS = {
  washer: 100 * 60,
  dryer: 70 * 60,
};

const MACHINE_TIMERS_DISPLAY = {
  washer: "1 hora 40 min",
  dryer: "1 hora 10 min",
};

function transactionCode() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}${month}${day}${Math.floor(Math.random() * 900) + 100}`;
}

const parseDateSafely = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error("Invalid date string:", dateString);
    return null;
  }
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refPayco = searchParams.get("ref");

  const [ficha, setFicha] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [activationCode, setActivationCode] = useState("");
  const [isActivated, setIsActivated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [validRef, setValidRef] = useState(null); // null mientras valida

  // Validar la referencia al cargar
  useEffect(() => {
    const validateReference = async () => {
      if (!refPayco) {
        setValidRef(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/ficha/validate?ref_payco=${refPayco}`
        );
        const data = await response.json();
        setValidRef(data.valid);
        if (data.valid) {
          setFicha(data.ficha);
        }
      } catch (error) {
        console.error("Error validando ficha:", error);
        setValidRef(false);
      }
    };

    validateReference();
  }, [refPayco]);

  // Cuenta regresiva
  useEffect(() => {
    let interval = null;

    if (timerActive && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeRemaining === 0) {
      setTimerActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTokenSelection = (tokenType) => {
    const now = parseDateSafely((new Date()).toDateString());

    if (tokenType === "washer" && ficha?.used_washer) {
      const washerUsedAt = parseDateSafely(ficha.used_washer);
      const washerExpires = parseDateSafely(
        new Date(
          washerUsedAt.getTime() + MACHINE_TIMERS["washer"] * 1000
        ).toDateString()
      );

      if (now < washerExpires) {
        // Todavía está activa
        const secondsRemaining = Math.floor((washerExpires - now) / 1000);
        setSelectedToken("washer");
        setIsActivated(true);
        setTimeRemaining(secondsRemaining);
        setTimerActive(true);
        return;
      } else {
        alert("Esta ficha de lavadora ya fue usada y expiró.");
        return;
      }
    }

    if (tokenType === "dryer" && ficha?.used_dryer) {
      const dryerUsedAt = parseDateSafely(ficha?.used_dryer);
      const dryerExpires = parseDateSafely(
        new Date(
          dryerUsedAt.getTime() + MACHINE_TIMERS["dryer"] * 1000
        ).toDateString()
      );

      if (now < dryerExpires) {
        const secondsRemaining = Math.floor((dryerExpires - now) / 1000);
        setSelectedToken("dryer");
        setIsActivated(true);
        setTimeRemaining(secondsRemaining);
        setTimerActive(true);
        return;
      } else {
        alert("Esta ficha de secadora ya fue usada y expiró.");
        return;
      }
    }

    // Si nunca ha sido usado
    setSelectedToken(tokenType);
    setIsActivated(false);
    setActivationCode("");
    setTimeRemaining(null);
    setTimerActive(false);
  };

  const handleActivation = async () => {
    if (!refPayco || !selectedToken) return;

    const now = parseDateSafely((new Date()).toDateString());

    if (selectedToken === "washer" && ficha?.used_washer) {
      const washerUsedAt = parseDateSafely(ficha.used_washer);
      const washerExpires = parseDateSafely((new Date(
        washerUsedAt.getTime() + MACHINE_TIMERS["washer"] * 1000
      )).toDateString());
      if (now > washerExpires) {
        alert("Esta ficha de lavadora ya fue usada y expiró.");
        return;
      }
    }

    if (selectedToken === "dryer" && ficha?.used_dryer) {
      const dryerUsedAt = parseDateSafely(ficha?.used_dryer);
      const dryerExpires = parseDateSafely((new Date(
        dryerUsedAt.getTime() + MACHINE_TIMERS["dryer"] * 1000
      )).toDateString());
      if (now > dryerExpires) {
        alert("Esta ficha de secadora ya fue usada y expiró.");
        return;
      }
    }

    try {
      const endpointWemos = `/api/lavacontrol/change-timer?seconds=${MACHINE_TIMERS[selectedToken]}`;

      const wemosResponse = await fetch(endpointWemos);
      if (!wemosResponse.ok) {
        alert("Error al activar el equipo. Intente más tarde.");
        return;
      }

      const endpoint =
        selectedToken === "washer"
          ? "/api/ficha/use-washer"
          : "/api/ficha/use-dryer";

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref_payco: refPayco }),
      });

      // refrescar ficha
      try {
        const response = await fetch(
          `/api/ficha/validate?ref_payco=${refPayco}`
        );
        const data = await response.json();
        setValidRef(data.valid);
        if (data.valid) {
          setFicha(data.ficha);
        }
      } catch (error) {
        console.error("Error validando ficha:", error);
        setValidRef(false);
      }

      const newCode = transactionCode();
      setActivationCode(newCode);
      setIsActivated(true);

      if (selectedToken === "washer") {
        setTimeRemaining(MACHINE_TIMERS["washer"]);
      } else if (selectedToken === "dryer") {
        setTimeRemaining(MACHINE_TIMERS["dryer"]);
      }

      setTimerActive(true);
    } catch (error) {
      console.error("Error usando ficha:", error);
    }
  };

  const handleBack = () => {
    const now = parseDateSafely((new Date()).toDateString());

    if (selectedToken === "washer" && ficha?.used_washer) {
      const washerUsedAt = parseDateSafely(ficha.used_washer);
      const washerExpires = parseDateSafely((new Date(
        washerUsedAt.getTime() + MACHINE_TIMERS["washer"] * 1000
      )).toDateString());
      if (now < washerExpires) {
        const secondsRemaining = Math.floor((washerExpires - now) / 1000);
        setIsActivated(true);
        setTimeRemaining(secondsRemaining);
        setTimerActive(true);
        setSelectedToken(null); // Vuelve a selección
        return;
      }
    }

    if (selectedToken === "dryer" && ficha?.used_dryer) {
      const dryerUsedAt = parseDateSafely(ficha?.used_dryer);
      const dryerExpires = parseDateSafely((new Date(
        dryerUsedAt.getTime() + MACHINE_TIMERS["dryer"] * 1000
      )).toDateString());
      if (now < dryerExpires) {
        const secondsRemaining = Math.floor((dryerExpires - now) / 1000);
        setIsActivated(true);
        setTimeRemaining(secondsRemaining);
        setTimerActive(true);
        setSelectedToken(null); // Vuelve a selección
        return;
      }
    }

    // Si ya se venció o no había nada
    setSelectedToken(null);
    setIsActivated(false);
    setTimeRemaining(null);
    setTimerActive(false);
  };

  const isWasherExpired = () => {
    if (!ficha?.used_washer) return false;
    const washerUsedAt = parseDateSafely(ficha.used_washer);
    const washerExpires = parseDateSafely(
      new Date(
        washerUsedAt.getTime() + MACHINE_TIMERS["washer"] * 1000
      ).toDateString()
    );
    return parseDateSafely(new Date().toDateString()) > washerExpires;
  };

  const isDryerExpired = () => {
    if (!ficha?.used_dryer) return false;
    const dryerUsedAt = parseDateSafely(ficha?.used_dryer);
    const dryerExpires = parseDateSafely(
      new Date(
        dryerUsedAt.getTime() + MACHINE_TIMERS["dryer"] * 1000
      ).toDateString()
    );
    return parseDateSafely(new Date().toDateString()) > dryerExpires;
  };

  if (validRef === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
        <Timer className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-lg text-slate-700">Verificando ficha...</p>
      </div>
    );
  }

  if (validRef === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          Ficha inválida o ya usada
        </h1>
        <p className="text-slate-600 mb-6">
          La ficha que intentas usar no es válida o ya fue utilizada.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-200 transition-all"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const now = parseDateSafely((new Date()).toDateString());
  const washerUsed = ficha?.used_washer
    ? parseDateSafely(ficha.used_washer)
    : null;
  const dryerUsed = ficha?.used_dryer
    ? parseDateSafely(ficha.used_dryer)
    : null;

  const washerExpired = washerUsed
    ? now > parseDateSafely((new Date(washerUsed.getTime() + MACHINE_TIMERS["washer"] * 1000)).toDateString())
    : false;
  const dryerExpired = dryerUsed
    ? now > parseDateSafely((new Date(dryerUsed.getTime() + MACHINE_TIMERS["dryer"] * 1000)).toDateString())
    : false;

  const washerAvailable = !washerUsed || (washerUsed && !washerExpired);
  const dryerAvailable = !dryerUsed || (dryerUsed && !dryerExpired);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
      <div className="w-full max-w-6xl h-auto relative bg-white/90 rounded-3xl shadow-2xl border border-slate-100 backdrop-blur-lg overflow-hidden flex flex-col md:flex-row">
        {/* Panel izquierdo */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                {selectedToken === "washer" ? (
                  <Washing stroke="white" />
                ) : selectedToken === "dryer" ? (
                  <Wind stroke="white" />
                ) : (
                  <Ticket stroke="white" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                {selectedToken === "washer"
                  ? "Ficha Lavadora"
                  : selectedToken === "dryer"
                  ? "Ficha Secadora"
                  : "Seleccione Ficha"}
              </h1>
            </div>
            <p className="text-slate-500 mb-8">
              {selectedToken
                ? "Administra tu ficha activada"
                : "Selecciona una ficha para activar o revisar."}
            </p>
          </div>

          {/* Selección */}
          {!selectedToken && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Ficha Lavadora */}
              <div className="relative bg-white border-2 border-dashed border-indigo-200 rounded-xl overflow-hidden p-6 flex flex-col items-center">
                <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-100 rounded-full transform -translate-y-1/2"></div>
                <div className="absolute -right-3 top-1/2 w-6 h-6 bg-slate-100 rounded-full transform -translate-y-1/2"></div>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Washing size={32} className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Ficha Lavadora
                </h3>
                <p className="text-sm text-slate-500 mb-4 text-center">
                  Tiempo: {MACHINE_TIMERS_DISPLAY["washer"]}
                </p>

                {isWasherExpired() ? (
                  <div className="w-full h-12 flex items-center justify-center bg-red-100 text-red-600 font-semibold rounded-lg mb-2">
                    Ficha usada
                  </div>
                ) : (
                  <button
                    onClick={() => handleTokenSelection("washer")}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold rounded-lg shadow-md transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <span>
                      {ficha?.used_washer ? "Ver detalle" : "Seleccionar"}
                    </span>
                  </button>
                )}
              </div>

              {/* Ficha Secadora */}
              <div className="relative bg-white border-2 border-dashed border-indigo-200 rounded-xl overflow-hidden p-6 flex flex-col items-center">
                <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-100 rounded-full transform -translate-y-1/2"></div>
                <div className="absolute -right-3 top-1/2 w-6 h-6 bg-slate-100 rounded-full transform -translate-y-1/2"></div>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Wind size={32} className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Ficha Secadora
                </h3>
                <p className="text-sm text-slate-500 mb-4 text-center">
                  Tiempo: {MACHINE_TIMERS_DISPLAY["dryer"]}
                </p>

                {isDryerExpired() ? (
                  <div className="w-full h-12 flex items-center justify-center bg-red-100 text-red-600 font-semibold rounded-lg mb-2">
                    Ficha usada
                  </div>
                ) : (
                  <button
                    onClick={() => handleTokenSelection("dryer")}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold rounded-lg shadow-md transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Seleccionar</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Ticket de ficha seleccionada */}
          {selectedToken && (
            <div className="relative bg-white border-2 border-dashed border-indigo-200 rounded-xl overflow-hidden mb-6">
              {/* Círculos decorativos del ticket */}
              <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-100 rounded-full transform -translate-y-1/2"></div>
              <div className="absolute -right-3 top-1/2 w-6 h-6 bg-slate-100 rounded-full transform -translate-y-1/2"></div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      {selectedToken === "washer" ? (
                        <Washing size={24} className="text-indigo-600" />
                      ) : (
                        <Wind size={24} className="text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {selectedToken === "washer"
                          ? "Ficha Lavadora"
                          : "Ficha Secadora"}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {selectedToken === "washer"
                          ? "Tiempo: " + MACHINE_TIMERS_DISPLAY["washer"]
                          : "Tiempo: " + MACHINE_TIMERS_DISPLAY["dryer"]}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Fecha</p>
                    <p className="text-sm font-bold text-indigo-600">
                      {new Date().toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Línea punteada */}
                <div className="border-t border-dashed border-slate-200 my-4"></div>

                {/* Temporizador */}
                {timerActive && timeRemaining !== null ? (
                  <div className="flex flex-col items-center mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Timer size={20} className="text-indigo-600" />
                      <span className="text-sm font-medium text-slate-700">
                        Tiempo restante
                      </span>
                    </div>
                    <div className="bg-indigo-50 px-6 py-3 rounded-lg">
                      <span className="text-2xl font-bold text-indigo-700">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mb-4">
                    <p className="text-sm text-slate-500">
                      {isActivated
                        ? "Tiempo finalizado"
                        : "Presione el botón para usar su ficha"}
                    </p>
                  </div>
                )}

                {/* Botón de activación */}
                {!isActivated && (
                  <button
                    onClick={handleActivation}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold rounded-lg shadow-md hover:shadow-indigo-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mb-4"
                  >
                    <span>Usar Ficha</span>
                  </button>
                )}

                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all"
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/5 bg-gradient-to-br from-slate-50 to-indigo-50 p-8 rounded-l-3xl">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Información de Ficha
          </h2>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Referencia</span>
                <span className="text-slate-800 font-medium">
                  {String(ficha.id).padStart(8, "0")}
                </span>
              </div>
              <div className="border-b border-slate-100"></div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Estado</span>
                <span
                  className={`font-medium ${
                    !ficha.used ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {!ficha.used ? "Activada" : "Redimida"}
                </span>
              </div>
              <div className="border-b border-slate-100"></div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tiempo Total</span>
                <span className="text-slate-800 font-medium">
                  {selectedToken === "washer"
                    ? MACHINE_TIMERS_DISPLAY["washer"]
                    : selectedToken === "dryer"
                    ? MACHINE_TIMERS_DISPLAY["dryer"]
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 text-sm mb-1">Instrucciones</p>
                <p className="text-slate-800 text-sm">
                  {selectedToken && isActivated
                    ? "Una vez el tiempo haya terminado, el equipo se desactivará automáticamente."
                    : selectedToken
                    ? "Use la ficha para activar el equipo."
                    : "Seleccione el tipo de ficha que desea usar para continuar."}
                </p>
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
              <span className="ml-2 text-sm text-slate-600">
                Servicio Seguro
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
