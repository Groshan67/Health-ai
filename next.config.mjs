// next.config.mjs

/** @type {import('next').NextConfig} */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// برای اطمینان از وجود فایل‌ها، مسیر کامل را لاگ می‌کنیم
const certPath = path.join(__dirname, 'certificates', 'myrisk.ir.pem');
const keyPath = path.join(__dirname, 'certificates', 'myrisk.ir-key.pem');

console.log('Certificate path:', certPath);
console.log('Key path:', keyPath);

// چک کردن وجود فایل‌ها
if (!fs.existsSync(certPath)) {
    console.error('Certificate file not found:', certPath);
}
if (!fs.existsSync(keyPath)) {
    console.error('Key file not found:', keyPath);
}

const nextConfig = {
    server: {
        https: fs.existsSync(certPath) && fs.existsSync(keyPath) ? {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        } : undefined
    },
    webpack: (config, { isServer }) => {
        config.cache = false;
        return config;
    },
    // اضافه کردن تنظیمات headers
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Permissions-Policy',
                        value: 'microphone=self'
                    },
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin'
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp'
                    }
                ]
            }
        ];
    }
};

export default nextConfig;
