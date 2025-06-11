import { ReactNode } from "react";

export default function Layout({
                                   children,
                                   modal,            // ⚠️ обязательно то же имя, что и папка «@modal»
                               }: {
    children: ReactNode;
    modal?: ReactNode; // можно добавить «| null», если хотите
}) {
    return (
        <>
            {children}
            {modal}        {/* будет undefined, когда модалки нет — React это игнорирует */}
        </>
    );
}
