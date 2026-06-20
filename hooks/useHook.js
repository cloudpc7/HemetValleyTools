import { useState, useEffect } from "react"

export const useHook = (arg) => {
    const [data, setData] = useState(false);
    useEffect(() => {
        const getData = () => {
            console.log("data");
        }
    }, data);

    return data;
};