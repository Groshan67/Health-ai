import { Skeleton } from "@/app/components/Skeleton";

export const ResponseDisplay = ({ response, loading }: { response: any; loading: boolean }) => {
    console.log("Response in ResponseDisplay:", response); // برای بررسی محتویات پاسخ

    return (
        <div className="mb-2">
            {response ? (
                // بررسی صحت ساختار داده‌ها قبل از نمایش
                response.messages && response.messages.content ? (
                    <pre
                        style={{
                            fontFamily: '__Vazirmatn_abcc1e, sans-serif',
                            textAlign: 'justify',
                            direction: 'rtl',
                        }}
                    >
                        {JSON.stringify(response.messages.content, null, 2)}
                    </pre>
                ) : (
                    <p>No valid content found in response</p> // در صورت عدم وجود محتوا
                )
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
};
