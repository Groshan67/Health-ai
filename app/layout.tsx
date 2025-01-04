import { Inter, Vazirmatn } from "next/font/google";
import "./globals.css";
import Warnings from "./components/warnings";
import { assistantId } from "./assistant-config";
const inter = Inter({ subsets: ["latin"] });
const vazirmatn = Vazirmatn({ subsets: ["arabic"], weight: "400" });


export const metadata = {
  title: "MyRisk|دستیار پزشک هوشمند",
  description: "A using the Assistants API with HealthAI",
  icons: {
    icon: "/openai.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={vazirmatn.className}>
        {assistantId ? children : <Warnings />}
        <img className="logo" src="/openai.svg" alt="MyRisk Logo" />
      </body>
    </html>
  );
}
