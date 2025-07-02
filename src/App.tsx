import React from "react";
import { ShoppingCart } from "lucide-react"

const App = () => {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="bg-white p-2 hover:bg-gray-200 rounded-full hover:cursor-pointer">
                <ShoppingCart size={30}/>
            </div>
        </div>
    );
}

export default App;