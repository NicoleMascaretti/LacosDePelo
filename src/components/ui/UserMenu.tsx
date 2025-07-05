import { useNavigate } from "react-router-dom";
import { useState } from "react";


const UserMenu = () => {
    const [mensage, setMensage] = useState<void>();
    console.log(mensage);
    return (
        <div className="flex items-center justify-end p-4">
            <button className="rounded-md bg-teal-400 text-white p-2 hover:bg-teal-700 font-sans font-bold" onClick={() => {setMensage(alert("Bem-vindo ao Lacos de Pelo!"));}}>
                Minha conta
            </button>
        </div>
    )
}

export default UserMenu;