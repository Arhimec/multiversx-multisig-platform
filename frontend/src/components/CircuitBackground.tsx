/**
 * CircuitBackground — Grietas iluminadas desde atrás.
 * Las grietas nacen de los BORDES (lados, arriba, abajo) y se extienden
 * gradualmente hacia el interior. Pequeñas al inicio, creciendo un poco.
 * El centro queda relativamente limpio. Efecto de piedra agrietándose.
 */
export const CircuitBackground = () => {
    return (
        <div className="circuit-bg" aria-hidden="true">
            <svg
                className="circuit-svg"
                viewBox="0 0 1200 800"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="crackGlow">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="wide" />
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="tight" />
                        <feMerge>
                            <feMergeNode in="wide" />
                            <feMergeNode in="tight" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="crackGlowSoft">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* ========== CAPA 1: Resplandor amplio detrás ========== */}
                <g filter="url(#crackGlow)" opacity="0.25">
                    {/* Desde borde IZQUIERDO */}
                    <path d="M0,120 L55,140 L90,155 L130,175 L155,200" fill="none" stroke="#2dd4bf" strokeWidth="5" />
                    <path d="M0,340 L40,330 L80,345 L120,335 L170,360 L210,375" fill="none" stroke="#2dd4bf" strokeWidth="6" />
                    <path d="M0,550 L50,540 L95,555 L140,545 L185,565 L225,580 L260,570" fill="none" stroke="#2dd4bf" strokeWidth="5" />
                    <path d="M0,700 L45,685 L85,695 L120,680 L160,690" fill="none" stroke="#2dd4bf" strokeWidth="4" />
                    {/* Desde borde DERECHO */}
                    <path d="M1200,100 L1155,115 L1115,130 L1080,150 L1050,175" fill="none" stroke="#2dd4bf" strokeWidth="5" />
                    <path d="M1200,380 L1160,370 L1120,385 L1080,375 L1040,395 L1000,408" fill="none" stroke="#2dd4bf" strokeWidth="6" />
                    <path d="M1200,600 L1155,590 L1110,605 L1070,595 L1030,615 L990,625" fill="none" stroke="#2dd4bf" strokeWidth="5" />
                    <path d="M1200,730 L1160,720 L1125,735 L1090,725" fill="none" stroke="#2dd4bf" strokeWidth="4" />
                    {/* Desde borde SUPERIOR */}
                    <path d="M200,0 L210,45 L195,85 L215,130 L205,170 L225,210" fill="none" stroke="#2dd4bf" strokeWidth="5" />
                    <path d="M550,0 L545,40 L560,80 L550,120 L565,155" fill="none" stroke="#2dd4bf" strokeWidth="5" />
                    <path d="M900,0 L910,50 L895,90 L915,130 L905,165" fill="none" stroke="#2dd4bf" strokeWidth="4" />
                    {/* Desde borde INFERIOR */}
                    <path d="M300,800 L310,755 L295,715 L315,675 L305,640 L325,605" fill="none" stroke="#2dd4bf" strokeWidth="5" />
                    <path d="M700,800 L695,760 L710,720 L700,680 L715,645" fill="none" stroke="#2dd4bf" strokeWidth="5" />
                    <path d="M1000,800 L1010,760 L995,725 L1015,690" fill="none" stroke="#2dd4bf" strokeWidth="4" />
                </g>

                {/* ========== CAPA 2: Grietas finas visibles ========== */}
                <g opacity="0.7" strokeLinecap="round" strokeLinejoin="round">

                    {/* === BORDE IZQUIERDO === */}
                    {/* Grieta 1 — arriba-izq */}
                    <path d="M0,120 L55,140 L90,155 L130,175 L155,200"
                        fill="none" stroke="#5eead4" strokeWidth="1.4" />
                    <path d="M55,140 L40,170 L50,200"
                        fill="none" stroke="#67e8f9" strokeWidth="0.6" />
                    <path d="M130,175 L145,155 L165,140"
                        fill="none" stroke="#5eead4" strokeWidth="0.5" />

                    {/* Grieta 2 — centro-izq (la más larga de este lado) */}
                    <path d="M0,340 L40,330 L80,345 L120,335 L170,360 L210,375"
                        fill="none" stroke="#5eead4" strokeWidth="1.6" />
                    <path d="M80,345 L70,380 L85,410 L95,440"
                        fill="none" stroke="#67e8f9" strokeWidth="0.7" />
                    <path d="M170,360 L185,335 L200,310 L210,285"
                        fill="none" stroke="#5eead4" strokeWidth="0.6" />
                    <path d="M120,335 L105,310 L95,280"
                        fill="none" stroke="#67e8f9" strokeWidth="0.5" />

                    {/* Grieta 3 — abajo-izq */}
                    <path d="M0,550 L50,540 L95,555 L140,545 L185,565 L225,580 L260,570"
                        fill="none" stroke="#5eead4" strokeWidth="1.4" />
                    <path d="M95,555 L80,585 L90,615"
                        fill="none" stroke="#67e8f9" strokeWidth="0.6" />
                    <path d="M185,565 L200,540 L215,515"
                        fill="none" stroke="#5eead4" strokeWidth="0.5" />
                    <path d="M225,580 L240,605 L250,630"
                        fill="none" stroke="#67e8f9" strokeWidth="0.5" />

                    {/* Grieta 4 — esquina abajo-izq */}
                    <path d="M0,700 L45,685 L85,695 L120,680 L160,690"
                        fill="none" stroke="#5eead4" strokeWidth="1.1" />
                    <path d="M85,695 L95,720 L90,745"
                        fill="none" stroke="#67e8f9" strokeWidth="0.5" />

                    {/* === BORDE DERECHO === */}
                    {/* Grieta 5 — arriba-der */}
                    <path d="M1200,100 L1155,115 L1115,130 L1080,150 L1050,175"
                        fill="none" stroke="#5eead4" strokeWidth="1.4" />
                    <path d="M1115,130 L1130,160 L1120,190"
                        fill="none" stroke="#67e8f9" strokeWidth="0.6" />
                    <path d="M1080,150 L1065,130 L1050,105"
                        fill="none" stroke="#5eead4" strokeWidth="0.5" />

                    {/* Grieta 6 — centro-der (la más larga de este lado) */}
                    <path d="M1200,380 L1160,370 L1120,385 L1080,375 L1040,395 L1000,408"
                        fill="none" stroke="#5eead4" strokeWidth="1.6" />
                    <path d="M1120,385 L1135,415 L1125,445"
                        fill="none" stroke="#67e8f9" strokeWidth="0.7" />
                    <path d="M1040,395 L1025,365 L1015,335"
                        fill="none" stroke="#5eead4" strokeWidth="0.6" />
                    <path d="M1080,375 L1095,350 L1105,320"
                        fill="none" stroke="#67e8f9" strokeWidth="0.5" />

                    {/* Grieta 7 — abajo-der */}
                    <path d="M1200,600 L1155,590 L1110,605 L1070,595 L1030,615 L990,625"
                        fill="none" stroke="#5eead4" strokeWidth="1.4" />
                    <path d="M1110,605 L1125,630 L1115,660"
                        fill="none" stroke="#67e8f9" strokeWidth="0.6" />
                    <path d="M1030,615 L1015,590 L1005,565"
                        fill="none" stroke="#5eead4" strokeWidth="0.5" />

                    {/* Grieta 8 — esquina abajo-der */}
                    <path d="M1200,730 L1160,720 L1125,735 L1090,725"
                        fill="none" stroke="#5eead4" strokeWidth="1.1" />
                    <path d="M1125,735 L1135,760 L1130,785"
                        fill="none" stroke="#67e8f9" strokeWidth="0.5" />

                    {/* === BORDE SUPERIOR === */}
                    {/* Grieta 9 — arriba-izq */}
                    <path d="M200,0 L210,45 L195,85 L215,130 L205,170 L225,210"
                        fill="none" stroke="#5eead4" strokeWidth="1.5" />
                    <path d="M195,85 L170,95 L145,90"
                        fill="none" stroke="#67e8f9" strokeWidth="0.6" />
                    <path d="M215,130 L240,140 L265,135"
                        fill="none" stroke="#5eead4" strokeWidth="0.5" />
                    <path d="M205,170 L180,180 L160,195"
                        fill="none" stroke="#67e8f9" strokeWidth="0.5" />

                    {/* Grieta 10 — arriba-centro */}
                    <path d="M550,0 L545,40 L560,80 L550,120 L565,155"
                        fill="none" stroke="#5eead4" strokeWidth="1.3" />
                    <path d="M560,80 L585,90 L610,85"
                        fill="none" stroke="#67e8f9" strokeWidth="0.6" />
                    <path d="M550,120 L525,130 L500,125"
                        fill="none" stroke="#5eead4" strokeWidth="0.5" />

                    {/* Grieta 11 — arriba-der */}
                    <path d="M900,0 L910,50 L895,90 L915,130 L905,165"
                        fill="none" stroke="#5eead4" strokeWidth="1.2" />
                    <path d="M895,90 L870,100 L850,95"
                        fill="none" stroke="#67e8f9" strokeWidth="0.5" />
                    <path d="M915,130 L940,140 L960,135"
                        fill="none" stroke="#5eead4" strokeWidth="0.5" />

                    {/* === BORDE INFERIOR === */}
                    {/* Grieta 12 — abajo-izq */}
                    <path d="M300,800 L310,755 L295,715 L315,675 L305,640 L325,605"
                        fill="none" stroke="#5eead4" strokeWidth="1.5" />
                    <path d="M295,715 L270,705 L250,715"
                        fill="none" stroke="#67e8f9" strokeWidth="0.6" />
                    <path d="M315,675 L340,665 L360,670"
                        fill="none" stroke="#5eead4" strokeWidth="0.5" />
                    <path d="M305,640 L280,630 L260,640"
                        fill="none" stroke="#67e8f9" strokeWidth="0.5" />

                    {/* Grieta 13 — abajo-centro */}
                    <path d="M700,800 L695,760 L710,720 L700,680 L715,645"
                        fill="none" stroke="#5eead4" strokeWidth="1.3" />
                    <path d="M710,720 L735,710 L755,720"
                        fill="none" stroke="#67e8f9" strokeWidth="0.6" />
                    <path d="M700,680 L675,670 L655,680"
                        fill="none" stroke="#5eead4" strokeWidth="0.5" />

                    {/* Grieta 14 — abajo-der */}
                    <path d="M1000,800 L1010,760 L995,725 L1015,690"
                        fill="none" stroke="#5eead4" strokeWidth="1.2" />
                    <path d="M995,725 L970,715 L950,725"
                        fill="none" stroke="#67e8f9" strokeWidth="0.5" />

                    {/* === MICRO-GRIETAS en las esquinas === */}
                    {/* Esquina sup-izq */}
                    <path d="M0,40 L30,50 L55,45" fill="none" stroke="#5eead4" strokeWidth="0.6" />
                    <path d="M60,0 L70,30 L65,60" fill="none" stroke="#67e8f9" strokeWidth="0.5" />
                    {/* Esquina sup-der */}
                    <path d="M1200,55 L1170,65 L1150,55" fill="none" stroke="#5eead4" strokeWidth="0.6" />
                    <path d="M1130,0 L1120,35 L1130,65" fill="none" stroke="#67e8f9" strokeWidth="0.5" />
                    {/* Esquina inf-izq */}
                    <path d="M0,760 L35,750 L60,760" fill="none" stroke="#5eead4" strokeWidth="0.6" />
                    <path d="M80,800 L90,770 L80,740" fill="none" stroke="#67e8f9" strokeWidth="0.5" />
                    {/* Esquina inf-der */}
                    <path d="M1200,760 L1165,750 L1145,760" fill="none" stroke="#5eead4" strokeWidth="0.6" />
                    <path d="M1140,800 L1130,770 L1140,740" fill="none" stroke="#67e8f9" strokeWidth="0.5" />

                    {/* Micro-grietas sueltas en los bordes */}
                    <path d="M0,200 L25,210 L40,200" fill="none" stroke="#5eead4" strokeWidth="0.5" />
                    <path d="M0,460 L20,455 L35,465" fill="none" stroke="#67e8f9" strokeWidth="0.4" />
                    <path d="M1200,250 L1175,240 L1160,250" fill="none" stroke="#5eead4" strokeWidth="0.5" />
                    <path d="M1200,500 L1180,505 L1165,495" fill="none" stroke="#67e8f9" strokeWidth="0.4" />
                    <path d="M380,0 L385,25 L375,50" fill="none" stroke="#5eead4" strokeWidth="0.4" />
                    <path d="M750,0 L745,20 L755,40" fill="none" stroke="#67e8f9" strokeWidth="0.4" />
                    <path d="M480,800 L485,775 L475,755" fill="none" stroke="#5eead4" strokeWidth="0.4" />
                    <path d="M850,800 L855,780 L845,760" fill="none" stroke="#67e8f9" strokeWidth="0.4" />
                </g>

                {/* ========== CAPA 3: Puntos luminosos en bifurcaciones ========== */}
                <g fill="#5eead4" opacity="0.5">
                    {/* Izquierda */}
                    <circle cx="55" cy="140" r="1.5" />
                    <circle cx="80" cy="345" r="2" />
                    <circle cx="170" cy="360" r="2" />
                    <circle cx="95" cy="555" r="1.5" />
                    <circle cx="185" cy="565" r="1.5" />
                    {/* Derecha */}
                    <circle cx="1115" cy="130" r="1.5" />
                    <circle cx="1120" cy="385" r="2" />
                    <circle cx="1040" cy="395" r="2" />
                    <circle cx="1110" cy="605" r="1.5" />
                    {/* Arriba */}
                    <circle cx="195" cy="85" r="1.5" />
                    <circle cx="560" cy="80" r="1.5" />
                    <circle cx="895" cy="90" r="1.5" />
                    {/* Abajo */}
                    <circle cx="295" cy="715" r="1.5" />
                    <circle cx="710" cy="720" r="1.5" />
                    <circle cx="995" cy="725" r="1.5" />
                </g>

                {/* ========== CAPA 4: Pulso de luz recorriendo grietas ========== */}
                <g filter="url(#crackGlowSoft)">
                    {/* Pulso izq principal */}
                    <path className="vein-pulse vein-pulse-1"
                        d="M0,340 L40,330 L80,345 L120,335 L170,360 L210,375"
                        fill="none" stroke="#99f6e4" strokeWidth="2" strokeLinecap="round" />
                    {/* Pulso der principal */}
                    <path className="vein-pulse vein-pulse-2"
                        d="M1200,380 L1160,370 L1120,385 L1080,375 L1040,395 L1000,408"
                        fill="none" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" />
                    {/* Pulso arriba-izq */}
                    <path className="vein-pulse vein-pulse-3"
                        d="M200,0 L210,45 L195,85 L215,130 L205,170 L225,210"
                        fill="none" stroke="#99f6e4" strokeWidth="1.8" strokeLinecap="round" />
                    {/* Pulso abajo-izq */}
                    <path className="vein-pulse vein-pulse-4"
                        d="M300,800 L310,755 L295,715 L315,675 L305,640 L325,605"
                        fill="none" stroke="#a5f3fc" strokeWidth="1.8" strokeLinecap="round" />
                    {/* Pulso izq abajo */}
                    <path className="vein-pulse vein-pulse-5"
                        d="M0,550 L50,540 L95,555 L140,545 L185,565 L225,580 L260,570"
                        fill="none" stroke="#99f6e4" strokeWidth="1.8" strokeLinecap="round" />
                    {/* Pulso der abajo */}
                    <path className="vein-pulse vein-pulse-6"
                        d="M1200,600 L1155,590 L1110,605 L1070,595 L1030,615 L990,625"
                        fill="none" stroke="#a5f3fc" strokeWidth="1.8" strokeLinecap="round" />
                    {/* Pulso arriba-centro */}
                    <path className="vein-pulse vein-pulse-7"
                        d="M550,0 L545,40 L560,80 L550,120 L565,155"
                        fill="none" stroke="#99f6e4" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* ========== CAPA 5: Pings en nodos ========== */}
                <g>
                    <circle className="node-ping node-ping-1" cx="170" cy="360" r="4" fill="none" stroke="#99f6e4" strokeWidth="1" />
                    <circle className="node-ping node-ping-2" cx="1040" cy="395" r="4" fill="none" stroke="#a5f3fc" strokeWidth="1" />
                    <circle className="node-ping node-ping-3" cx="560" cy="80" r="4" fill="none" stroke="#99f6e4" strokeWidth="1" />
                    <circle className="node-ping node-ping-4" cx="710" cy="720" r="4" fill="none" stroke="#a5f3fc" strokeWidth="1" />
                </g>
            </svg>
        </div>
    );
};
