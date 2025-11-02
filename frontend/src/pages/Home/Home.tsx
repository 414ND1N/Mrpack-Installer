
// Componentes
import Sidebar from "@/pages/Sidebar"
import { useRef } from "react";
import type { WebviewTag } from "electron";
import { MCButton } from "@/components/MC/MC";
// Css
import "./Home.css"

function Home() {

    const webviewRef = useRef<WebviewTag | null>(null);
    
    return (
        <main className="main-container">
            <Sidebar/>
            <section className="home-container">
                <MCButton
                    className="back-button"
                    variant="block"
                    onClick={() => {
                        webviewRef.current?.goBack();
                    }}
                >
                    <strong> ( </strong>
                </MCButton>

                <webview
                    ref={webviewRef}
                    src="https://www.minecraft.net/es-es"
                    style={{ width: '100%', height: '100%' }}
                ></webview>
            </section>
        </main>
    );

}

export default Home