export default function Home() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
        <div className="w-full max-w-6xl h-auto md:h-[780px] relative bg-white/90 rounded-3xl shadow-2xl border border-slate-100 backdrop-blur-lg overflow-hidden flex flex-col md:flex-row">

          <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl overflow-hidden flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Pago</h1>
              </div>
              <p className="text-slate-500 mb-8">
                Para completar el pago, por favor ingrese la información completa.
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium">Nombre Apellido</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                </label>
                <input 
                  type="text" 
                  className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                  placeholder="Ingrese su nombre completo"
                />
              </div>
              
              {/* Número de Tarjeta */}
              <div className="space-y-2 relative">
                <label className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium">Número de Tarjeta</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                    placeholder="1234 5678 9012 3456"
                  />
                  <div className="absolute right-3 top-3 flex gap-2">
                    <span className="w-6 h-6 bg-slate-200 rounded"></span>
                    <span className="w-6 h-6 bg-slate-300 rounded"></span>
                  </div>
                </div>
                <div className="absolute -right-36 top-12 bg-indigo-50 text-xs text-indigo-700 p-2 rounded-lg shadow-sm border border-indigo-100">
                  Ingrese los 16 dígitos del frente de la tarjeta.
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CCV */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <span className="text-slate-700 font-medium">CCV</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                    placeholder="123"
                    maxLength="3"
                  />
                </div>
                
                {/* Fecha de Vencimiento */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <span className="text-slate-700 font-medium">Fecha de Vencimiento</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                    placeholder="MM / AA"
                  />
                </div>
              </div>
            </div>
            
            {/* Botón de pago */}
            <button className="mt-10 w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <span>Completar Pago</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Logo */}
            <div className="mt-6 mb-4">
              <span className="text-indigo-600 text-3xl font-bold">LAVA</span>
              <span className="text-slate-700 text-3xl font-light">CONTROL</span>
            </div>
          </div>
          
          {/* Panel derecho - Resumen */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-slate-50 to-indigo-50 p-8 rounded-l-3xl">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Resumen de Pago</h2>
            
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Número de Pedido</span>
                  <span className="text-slate-800 font-medium">11458523</span>
                </div>
                <div className="border-b border-slate-100"></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">IVA</span>
                  <span className="text-slate-800 font-medium">20%</span>
                </div>
                <div className="border-b border-slate-100"></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Monto de IVA</span>
                  <span className="text-slate-800 font-medium">$ 123,28</span>
                </div>
                <div className="border-b border-slate-100"></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Monto de Pedido</span>
                  <span className="text-slate-800 font-medium">$ 123,28</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-sm mb-1">Monto a Pagar</p>
                  <p className="text-slate-800 text-2xl font-bold">$ 576<span className="text-lg">,32</span></p>
                </div>
                <div className="flex gap-3">
                  <span className="w-8 h-5 bg-indigo-600 rounded"></span>
                  <span className="w-8 h-5 bg-indigo-300 rounded"></span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-4 justify-center">
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-sm text-slate-600">Pago Seguro</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }