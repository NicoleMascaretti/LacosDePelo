import { User } from "lucide-react";

const UserMenu = () => {
    return (
        <div className="flex items-center justify-end">
            <a href="/login">
                <button className="rounded-3xl text-gray-600 hover:bg-gray-100 p-2 transition-colors" title="minha conta">
                    <User size={24} />
                </button>
            </a>
        </div>
    )
}

export default UserMenu;