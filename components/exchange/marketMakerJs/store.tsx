'use client';

import { createContext, useContext, Dispatch, SetStateAction, ReactNode, useState } from "react";

type DataType = {
    symbol: string,
    side: string,
    quantity: number,
    openPrice: number,
    currentPrice: number,
    netPL: number,
    usuId: number,
    tradeId: number
}

interface ContextProps  {
    price: number,
    setPrice: Dispatch<SetStateAction<number>>,
    data: DataType[],
    setData: Dispatch<SetStateAction<DataType[]>>
}

const GlobalContext = createContext<ContextProps>({
    price: 0,
    setPrice: (): number => 0,
    data: [],
    setData: (): DataType[] => [
        { symbol: 'AAPL',
          side: 'LONG',
          quantity: 200,
          openPrice: 125,
          currentPrice: 125.1,
          netPL: 10,
          usuId: 1,
          tradeId: 1},
        { symbol: 'MSFT',
          side: 'LONG',
          quantity: 200,
          openPrice: 320,
          currentPrice: 321.5,
          netPL: 115,
          usuId: 1,
          tradeId: 2}
    ]
})

interface GlobalContextProviderProps {
    children: ReactNode;
}

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({ children }) => {
    const [price, setPrice] = useState(0);
    const [data, setData] = useState<[] | DataType[]>([]);

    return (
        <GlobalContext.Provider value={{ price, setPrice, data, setData}}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);
