/**
 * R2Droid — Robot mascot with electronic key and tank treads.
 * Treads animate to simulate rolling. Pure CSS animation — GPU accelerated.
 */
export const R2Droid = ({ className = '', size = 120 }: { className?: string; size?: number }) => {
    const w = size * 1.8;
    const h = size * 1.4;

    return (
        <div className={`r2-droid-container ${className}`}>
            <svg
                className="r2-droid-svg"
                width={w}
                height={h}
                viewBox="0 0 180 140"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <radialGradient id="droidGlow" cx="50%" cy="30%" r="60%">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <linearGradient id="droidBody" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1a3040" />
                        <stop offset="100%" stopColor="#0d1a24" />
                    </linearGradient>
                    <linearGradient id="droidDome" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1e4050" />
                        <stop offset="50%" stopColor="#163040" />
                        <stop offset="100%" stopColor="#0d2030" />
                    </linearGradient>
                    <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2dd4bf" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <linearGradient id="treadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#142830" />
                        <stop offset="100%" stopColor="#0a1820" />
                    </linearGradient>
                    <clipPath id="leftTreadClip">
                        <rect x="28" y="92" width="32" height="18" rx="9" />
                    </clipPath>
                    <clipPath id="rightTreadClip">
                        <rect x="70" y="92" width="32" height="18" rx="9" />
                    </clipPath>
                </defs>

                {/* Subtle ambient glow behind droid */}
                <ellipse cx="65" cy="60" rx="35" ry="45" fill="url(#droidGlow)" />

                {/* === Dome (head) === */}
                <ellipse cx="65" cy="38" rx="26" ry="20" fill="url(#droidDome)" stroke="#2dd4bf" strokeWidth="0.6" strokeOpacity="0.4" />

                {/* Eye / Lens */}
                <circle cx="65" cy="32" r="7" fill="#0d1a24" stroke="#2dd4bf" strokeWidth="1" />
                <circle cx="65" cy="32" r="4.5" fill="#0f766e" className="droid-eye" />
                <circle cx="65" cy="32" r="2.5" fill="#2dd4bf" className="droid-eye-inner" />
                <circle cx="63.5" cy="30.5" r="0.8" fill="#ffffff" opacity="0.8" />

                {/* Dome panel lines */}
                <path d="M44,36 Q65,28 86,36" fill="none" stroke="#2dd4bf" strokeWidth="0.4" strokeOpacity="0.4" />
                <path d="M42,42 Q65,35 88,42" fill="none" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />

                {/* Indicator lights */}
                <circle cx="53" cy="28" r="1.8" fill="#0ea5e9" className="droid-indicator" />
                <circle cx="77" cy="28" r="1.3" fill="#ef4444" opacity="0.5" />

                {/* === Body === */}
                <rect x="40" y="50" width="50" height="38" rx="5" fill="url(#droidBody)" stroke="#2dd4bf" strokeWidth="0.5" strokeOpacity="0.3" />

                {/* Body panels */}
                <rect x="44" y="54" width="18" height="12" rx="2" fill="#0d2030" stroke="#2dd4bf" strokeWidth="0.4" strokeOpacity="0.35" />
                <rect x="66" y="54" width="18" height="12" rx="2" fill="#0d2030" stroke="#0ea5e9" strokeWidth="0.4" strokeOpacity="0.35" />

                {/* Body circuit veins */}
                <path className="droid-vein dv1"
                    d="M46,70 C50,70 54,72 58,74 S66,76 72,74 S80,70 84,70"
                    fill="none" stroke="#2dd4bf" strokeWidth="0.6" />
                <path className="droid-vein dv2"
                    d="M46,78 C52,78 56,80 60,82 S68,82 74,80"
                    fill="none" stroke="#0ea5e9" strokeWidth="0.5" />

                {/* Status lights */}
                <circle cx="50" cy="58" r="1.5" fill="#2dd4bf" className="droid-indicator" />
                <circle cx="50" cy="62" r="1.3" fill="#0ea5e9" opacity="0.5" />

                {/* === Left arm holding electronic padlock === */}
                <g className="droid-arm-left">
                    {/* Arm */}
                    <line x1="40" y1="58" x2="20" y2="48" stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.6" />

                    {/* Electronic Padlock */}
                    <g className="key-glow-pulse">
                        {/* Lock body */}
                        <rect x="-2" y="42" width="16" height="14" rx="3" fill="#0d2030" stroke="url(#keyGrad)" strokeWidth="1.5" />
                        {/* Circuit lines on lock body */}
                        <line x1="1" y1="46" x2="5" y2="46" stroke="#5eead4" strokeWidth="0.5" strokeOpacity="0.6" />
                        <line x1="1" y1="49" x2="5" y2="49" stroke="#5eead4" strokeWidth="0.5" strokeOpacity="0.6" />
                        <line x1="9" y1="46" x2="13" y2="46" stroke="#0ea5e9" strokeWidth="0.5" strokeOpacity="0.5" />
                        <line x1="9" y1="49" x2="13" y2="49" stroke="#0ea5e9" strokeWidth="0.5" strokeOpacity="0.5" />
                        {/* Shackle (arc) */}
                        <path d="M2,43 C2,33 12,33 12,43" fill="none" stroke="url(#keyGrad)" strokeWidth="2" strokeLinecap="round" />
                        {/* Keyhole */}
                        <circle cx="7" cy="48" r="2" fill="#0a1820" stroke="#2dd4bf" strokeWidth="0.6" />
                        <circle cx="7" cy="48" r="0.8" fill="#2dd4bf" className="key-dot" />
                        {/* Lock glow indicator */}
                        <circle cx="7" cy="44" r="1" fill="#2dd4bf" className="droid-indicator" />
                    </g>
                </g>

                {/* === Right arm holding electronic key === */}
                <g className="droid-arm">
                    {/* Arm */}
                    <line x1="90" y1="58" x2="110" y2="48" stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.6" />

                    {/* Electronic Key — futuristic shape */}
                    <g className="key-glow-pulse">
                        {/* Key handle (ring) */}
                        <circle cx="125" cy="40" r="8" fill="none" stroke="url(#keyGrad)" strokeWidth="2" />
                        <circle cx="125" cy="40" r="5" fill="none" stroke="#2dd4bf" strokeWidth="0.5" strokeOpacity="0.4" />
                        {/* Key shaft */}
                        <line x1="133" y1="40" x2="158" y2="40" stroke="url(#keyGrad)" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Key teeth */}
                        <line x1="148" y1="40" x2="148" y2="47" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
                        <line x1="153" y1="40" x2="153" y2="45" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="158" y1="40" x2="158" y2="46" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
                        {/* Circuit pattern on key */}
                        <line x1="136" y1="38.5" x2="145" y2="38.5" stroke="#5eead4" strokeWidth="0.5" strokeOpacity="0.6" />
                        <line x1="136" y1="41.5" x2="145" y2="41.5" stroke="#5eead4" strokeWidth="0.5" strokeOpacity="0.6" />
                        {/* Key glow dot */}
                        <circle cx="125" cy="40" r="2" fill="#2dd4bf" className="key-dot" />
                    </g>
                </g>

                {/* === TANK TREADS === */}
                {/* Left tread — outer track */}
                <rect x="28" y="92" width="32" height="18" rx="9" fill="url(#treadGrad)" stroke="#2dd4bf" strokeWidth="0.6" strokeOpacity="0.4" />
                {/* Left tread segments (rolling) */}
                <g clipPath="url(#leftTreadClip)">
                    <g className="tread-segments-left">
                        <rect x="30" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        <rect x="36" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        <rect x="42" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        <rect x="48" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        <rect x="54" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        {/* Duplicate set for seamless loop */}
                        <rect x="60" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        <rect x="66" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                    </g>
                </g>
                {/* Left tread wheels */}
                <circle cx="37" cy="101" r="4" fill="#0d1a24" stroke="#2dd4bf" strokeWidth="0.4" strokeOpacity="0.3" />
                <circle cx="51" cy="101" r="4" fill="#0d1a24" stroke="#2dd4bf" strokeWidth="0.4" strokeOpacity="0.3" />
                <circle cx="37" cy="101" r="1.5" fill="#163040" />
                <circle cx="51" cy="101" r="1.5" fill="#163040" />

                {/* Right tread — outer track */}
                <rect x="70" y="92" width="32" height="18" rx="9" fill="url(#treadGrad)" stroke="#2dd4bf" strokeWidth="0.6" strokeOpacity="0.4" />
                {/* Right tread segments (rolling) */}
                <g clipPath="url(#rightTreadClip)">
                    <g className="tread-segments-right">
                        <rect x="72" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        <rect x="78" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        <rect x="84" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        <rect x="90" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        <rect x="96" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        {/* Duplicate set for seamless loop */}
                        <rect x="102" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                        <rect x="108" y="93" width="3" height="16" rx="1" fill="#1a3540" stroke="#2dd4bf" strokeWidth="0.3" strokeOpacity="0.3" />
                    </g>
                </g>
                {/* Right tread wheels */}
                <circle cx="79" cy="101" r="4" fill="#0d1a24" stroke="#2dd4bf" strokeWidth="0.4" strokeOpacity="0.3" />
                <circle cx="93" cy="101" r="4" fill="#0d1a24" stroke="#2dd4bf" strokeWidth="0.4" strokeOpacity="0.3" />
                <circle cx="79" cy="101" r="1.5" fill="#163040" />
                <circle cx="93" cy="101" r="1.5" fill="#163040" />

                {/* Tread glow lines */}
                <line className="droid-vein dv3" x1="33" y1="101" x2="57" y2="101" stroke="#2dd4bf" strokeWidth="0.4" />
                <line className="droid-vein dv3" x1="75" y1="101" x2="99" y2="101" stroke="#2dd4bf" strokeWidth="0.4" />
            </svg>
        </div>
    );
};
