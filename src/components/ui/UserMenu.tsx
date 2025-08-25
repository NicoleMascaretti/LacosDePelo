import { useState } from "react";
import { User } from "lucide-react";

const UserMenu = () => {
    const [mensage, setMensage] = useState<void>();
    console.log(mensage);
    return (
        <div className="flex items-center justify-end">
            <button className="rounded-3xl hover:bg-gray-100 p-2 transition-colors" onClick={() => {setMensage(alert("Bem-vindo ao Lacos de Pelo!"));}} title="minha conta">
                <User size={24}/>
            </button>
        </div>
    )
}

export default UserMenu;