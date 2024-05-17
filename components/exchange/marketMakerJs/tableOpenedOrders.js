import React, { useEffect } from "react";
import io from "socket.io-client";

const SocketComponent = (props) => {

    const { symbol } = props;

    const onNewSubscriptionSocket = (symbol) => {
        console.log("new subscription to socketmarket client");
        // socket.emit("subscribe", symbol);
    };

    useEffect(() => {
        const socket = io("https://websocketvcapital.academyedupro.com");
        if (symbol) {
            // console.log('new symbol changed: ', symbol);
            // onNewSubscriptionSocket(symbol);
            console.log("new subscription to socketmarket client");
            socket.emit("subscribe", "BINANCE:ETHUSDT");
        }

        // client-side
        socket.on("connect", () => {
            console.log('marketClient: ',socket.id); // x8WIv7-mJelg7on_ALbx
            // socket.emit("subscribe", "BINANCE:ETHUSDT");
        });

        socket.on("message", (message) => {
            console.log("MarketClient message: ", message); // message send from server
        });

        socket.on("disconnect", () => {
            console.log(socket.id); // undefined
        });
    }, [symbol]);

    return <div></div>;
};

export default SocketComponent;
