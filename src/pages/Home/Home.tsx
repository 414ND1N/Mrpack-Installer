
// Componentes
import Sidebar from "@/pages/Sidebar"
import { useRef } from "react";

// Css
import "./Home.css"


function Home() {

    const webviewRef = useRef<HTMLWebViewElement>(null);
    

    return (
        <main className="main-container">
            <Sidebar/>
            <section className="home-container">

                <button 
                    className="back-button minecraft block" 
                    onClick={() => {
                        if (webviewRef.current) {
                            webviewRef.current.goBack();
                        }
                    }}
                >
                    <strong>(</strong>
                </button>

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