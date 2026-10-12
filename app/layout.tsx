import "./(main)/globals.css";

export default function RootLayout({children}: {children: React.ReactNode}) {
    return(
        <html lang="vi">
            <head />
            <body>{children}</body>
        </html>
    )
}