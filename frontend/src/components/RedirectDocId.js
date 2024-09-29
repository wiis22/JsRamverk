// src/components/Redirect.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const RedirectComp = ({ newDocId }) => {
    const router = useRouter();

    useEffect(() => {
        router.push(`/doc/${newDocId}`)
    }, [newDocId, router]);

    return <div>Throbbing .... </div>
};

export default RedirectComp;