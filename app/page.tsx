"use client";

import { CssVarsProvider } from "@mui/joy";
import { ThemeProvider } from "./contexts/theme";
import Content from "./content";


export default function Home() {
    return (
        <CssVarsProvider defaultMode={'dark'}>
            <ThemeProvider>
                <Content></Content>
            </ThemeProvider>
        </CssVarsProvider>
    );
}
