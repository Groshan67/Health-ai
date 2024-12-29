import { Skeleton } from "@/app/components/Skeleton";

export const ResponseDisplay = ({ response, loading }: { response: any; loading: boolean }) => (
    <div className="mb-2">
        {response ? (
            // <div className="bg-gray-100 p-4 rounded-lg shadow">
            <pre
                style={{
                    fontFamily: '__Vazirmatn_abcc1e, sans-serif',
                    textAlign: 'justify',
                    direction: 'rtl',
                }}
            >
                {JSON.stringify(response.choices[0].message.content, null, 2)}
            </pre>
            // </div>
        ) : (
            loading ? (
                <>
                    <Skeleton width="100%" height="60px" borderRadius="12px" />
                    <Skeleton width="80%" height="40px" borderRadius="8px" />
                </>
            ) : null
        )}
    </div>
);
