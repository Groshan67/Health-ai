export const Skeleton = ({
    width = "100%",
    height = "20px",
    borderRadius = "8px"
}: { width?: string; height?: string; borderRadius?: string }) => (
    <div
        className="bg-gray-300 animate-pulse space-y-4 ml-auto mb-4"
        style={{ width, height, borderRadius }}
    ></div>
);



