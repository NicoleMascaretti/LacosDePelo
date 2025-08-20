import { ArrowRight } from 'lucide-react';

const ButtonsHome = () => {
    return (
        <div className="flex items-center gap-5 p-2">
            <div>
                <button className='bg-teal-600 text-white font-semibold rounded-full px-4 py-4 hover:bg-teal-700 transition-colors flex items-center justify-between gap-4'>
                    <span>Ver Produtos</span>
                    <ArrowRight size={24} className='hover:translate-x-1'/>
                </button>
            </div>

            <div>
                <button className='border-2 border-orange-400 text-orange-500 font-semibold rounded-full px-4 py-4 hover:bg-orange-400 hover:text-white'>
                    Conheça Nossa Historia
                </button>
            </div>
        </div>
    )
}

export default ButtonsHome;