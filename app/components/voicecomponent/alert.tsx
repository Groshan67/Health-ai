import React from 'react';

const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: 'default' | 'destructive';
    }
>(({ className = '', variant = 'default', children, ...props }, ref) => {
    const baseStyles = "relative w-full rounded-lg border p-4 mb-4";
    const variantStyles = {
        default: "bg-white text-gray-900 border-gray-200",
        destructive: "bg-red-50 text-red-900 border-red-200"
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;

    return (
        <div
            ref={ref}
            role="alert"
            className={classes}
            {...props}
        >
            {children}
        </div>
    );
});
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className = '', children, ...props }, ref) => (
    <div
        ref={ref}
        className={`text-sm ${className}`}
        {...props}
    >
        {children}
    </div>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };

