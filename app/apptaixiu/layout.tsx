import type { ReactNode } from 'react';
import {Metadata} from 'next';

export const metadata: Metadata = {
    title: 'Game',
    description: 'Trang chơi Game',
};

export default function TaixiuLayout({children}: {children: ReactNode}) {
    return (
        <section>
            {children}
        </section>
    );
}