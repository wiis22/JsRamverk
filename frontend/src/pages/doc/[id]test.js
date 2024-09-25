import { useRouter } from 'next/router';

const Doc = () => {
    const router = useRouter();
    const { id } = router.query; // Hämta id-parametern

    return (
        <div>
            <h1>Document ID: {id}</h1>
            {/* Logik för att hämta och visa dokumentet baserat på id */}
        </div>
    );
};

export default Doc;
