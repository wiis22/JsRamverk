// src/components/Redirect.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const RedirectComp = ({ route }) => {
    const router = useRouter();

    useEffect(() => {
        router.push(`${route}`)
    }, [route, router]);

    return <div>Throbbing .... </div>
};

export default RedirectComp;