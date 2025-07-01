import React from "react";
import { CodeXml } from "lucide-react"

const App = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Olá</h1>
            <p className="text-lg mb-6">Testando...</p>
            <CodeXml className="w-16 h-16 text-blue-500 mx-auto" />
        </div>
        </div>
    );
}

export default App;