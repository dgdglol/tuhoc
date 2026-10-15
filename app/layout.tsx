import "./(main)/globals.css";
import GlobalBlurGuard from "@/components/ui/GlobalBlurGuard";
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi">
            <head />
            <body>
                <GlobalBlurGuard>
                    {children}
                </GlobalBlurGuard>
            </body>
        </html>
    )
}