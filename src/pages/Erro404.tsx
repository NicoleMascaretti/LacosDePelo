import { useEffect } from "react";

const Erro404 = () => {

    useEffect(() => {
        console.error("Página não encontrada");
    }, [])

    return (
        
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-50 to-orange-50">
            <div className="text-center">

                {/* Titulo do erro */}
                <h1 className="text-9xl font-bold text-teal-600">Erro 404</h1>

                {/* Mensagem do erro */}
                <p className="text-3xl text-gray-900 font-bold">Página não encontrada</p>

                {/* Botão de redirecionamento */}
                <div className="mt-4 p-2">
                    <button className="bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-600 transition-colors">
                        <a href="/">Página Inicial</a>
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Erro404;