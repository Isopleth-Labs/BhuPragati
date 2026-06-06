import React, { useEffect, useRef, useState, useMemo } from 'react';

// ─── Utility: Deterministic Random ───
function srand(seed) {
  return Math.abs(Math.sin(seed * 9876.54321)) % 1;
}

// ─── Geographic Corridor Network Definition ───
// Built to look like an infrastructure planning dashboard.
function buildInfrastructureData() {
  const regions = [];
  const corridors = [];
  let id = 0;

  // Add a region/city cluster
  const addRegion = (x, y, minTier, size, type = 'hub') => {
    const region = { id: id++, x, y, minTier, size, type };
    regions.push(region);
    return region;
  };

  // Add a corridor with intermediate waypoints for geographic realism
  const addCorridor = (r1, r2, minTier, type = 'highway') => {
    if (!r1 || !r2) return;
    const waypoints = [];
    const dist = Math.hypot(r2.x - r1.x, r2.y - r1.y);
    const numWaypoints = Math.max(1, Math.floor(dist / 25));
    
    for (let i = 1; i < numWaypoints; i++) {
      const t = i / numWaypoints;
      const jx = (srand(r1.id + i * 10) - 0.5) * 8; // jitter
      const jy = (srand(r2.id + i * 10) - 0.5) * 8;
      waypoints.push({ x: r1.x + (r2.x - r1.x) * t + jx, y: r1.y + (r2.y - r1.y) * t + jy });
    }
    
    corridors.push({ id: id++, r1, r2, waypoints, minTier, type, length: dist });
  };

  // Canvas bounds: roughly 200x120

  // 1. TIER 0: Current State (Sparse, Gaps)
  // Major Northern Corridor
  const delhi = addRegion(60, 25, 0, 1.0, 'mega-hub');
  const lucknow = addRegion(90, 35, 0, 0.6, 'regional');
  const patna = addRegion(125, 45, 0, 0.7, 'regional');
  addCorridor(delhi, lucknow, 0, 'highway');
  addCorridor(lucknow, patna, 0, 'highway');

  // Major Western Corridor
  const ahmedabad = addRegion(40, 50, 0, 0.8, 'regional');
  const mumbai = addRegion(35, 75, 0, 1.0, 'mega-hub');
  addCorridor(delhi, ahmedabad, 0, 'highway');
  addCorridor(ahmedabad, mumbai, 0, 'highway');

  // Disconnected Eastern Cluster
  const kolkata = addRegion(160, 60, 0, 0.9, 'mega-hub');
  const guwahati = addRegion(185, 45, 0, 0.5, 'regional');
  addCorridor(kolkata, guwahati, 0, 'rail'); // Only local rail, no highway west

  // Disconnected Southern Cluster
  const bangalore = addRegion(75, 100, 0, 0.9, 'mega-hub');
  const chennai = addRegion(105, 95, 0, 0.8, 'regional');
  addCorridor(bangalore, chennai, 0, 'highway');

  // Central Void - Isolated settlements
  const nagpur = addRegion(95, 65, 0, 0.4, 'settlement');
  const raipur = addRegion(115, 60, 0, 0.3, 'settlement');
  // No corridors to them


  // 2. TIER 1: Investment Scenario (New Corridors Under Construction)
  // Bridging the East Gap
  const asansol = addRegion(145, 50, 1, 0.5, 'settlement');
  addCorridor(patna, asansol, 1, 'highway');
  addCorridor(asansol, kolkata, 1, 'highway');

  // Bridging the South Gap (Mumbai to Bangalore)
  const pune = addRegion(50, 80, 1, 0.6, 'regional');
  const belgaum = addRegion(60, 90, 1, 0.4, 'settlement');
  addCorridor(mumbai, pune, 1, 'highway');
  addCorridor(pune, belgaum, 1, 'highway');
  addCorridor(belgaum, bangalore, 1, 'highway');

  // Central Grid Initiation
  addRegion(95, 65, 1, 0.7, 'regional'); // Upgraded Nagpur
  const hyderabad = addRegion(85, 80, 1, 0.8, 'regional');
  addCorridor(delhi, nagpur, 1, 'rail');
  addCorridor(nagpur, hyderabad, 1, 'rail');
  addCorridor(hyderabad, bangalore, 1, 'rail');


  // 3. TIER 2: Projected Outcome (Fully Connected Resilience)
  // East Coast Corridor
  const bhubaneswar = addRegion(135, 75, 2, 0.6, 'regional');
  const vizag = addRegion(120, 85, 2, 0.5, 'regional');
  const vijayawada = addRegion(105, 90, 2, 0.5, 'regional');
  addCorridor(kolkata, bhubaneswar, 2, 'highway');
  addCorridor(bhubaneswar, vizag, 2, 'highway');
  addCorridor(vizag, vijayawada, 2, 'highway');
  addCorridor(vijayawada, chennai, 2, 'highway');

  // Trans-Central Cross Links
  addCorridor(nagpur, raipur, 2, 'highway');
  addCorridor(raipur, kolkata, 2, 'highway');
  
  const indore = addRegion(65, 55, 2, 0.6, 'regional');
  addCorridor(ahmedabad, indore, 2, 'highway');
  addCorridor(indore, nagpur, 2, 'highway');
  addCorridor(hyderabad, vijayawada, 2, 'highway');

  return { regions, corridors };
}

const INFRA_DATA = buildInfrastructureData();

// ─── Theming & Configs ───
const THEMES = [
  {
    colorRGB: '255, 107, 87',   // Red/Orange - Current State
    bgColor: 'rgba(255, 107, 87, 0.05)',
  },
  {
    colorRGB: '255, 211, 77',   // Yellow - Investment
    bgColor: 'rgba(255, 211, 77, 0.08)',
  },
  {
    colorRGB: '39, 255, 208',   // Cyan - Outcome
    bgColor: 'rgba(39, 255, 208, 0.08)',
  }
];

// ─── Canvas Component ───
function NetworkCanvas({ stepIndex, isHovered, onHoverStart, onHoverEnd }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const hoverProgressRef = useRef(0);
  
  const theme = THEMES[stepIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;
    
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(container);

    let width, height;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const mapX = (x) => (x / 200) * width * 0.9 + (width * 0.05);
    const mapY = (y) => (y / 120) * height * 0.9 + (height * 0.05);

    let lastTime = performance.now();
    
    const render = (time) => {
      if (!isVisible) {
        lastTime = time;
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      
      const dt = time - lastTime;
      lastTime = time;
      
      hoverProgressRef.current += (isHovered ? 1 : -1) * dt * 0.003;
      hoverProgressRef.current = Math.max(0, Math.min(1, hoverProgressRef.current));
      const hp = hoverProgressRef.current;
      
      ctx.clearRect(0, 0, width, height);

      // --- Draw Coverage Zones (Heatmap underlay) ---
      INFRA_DATA.regions.forEach(reg => {
        if (reg.minTier <= stepIndex) {
          const cx = mapX(reg.x);
          const cy = mapY(reg.y);
          // Base coverage radius based on size and tier
          let r = (20 + reg.size * 25);
          // If this region was just added in this step, animate its coverage radius
          if (reg.minTier === stepIndex && stepIndex > 0) {
            r *= (0.2 + 0.8 * hp); 
          } else {
            // Existing regions expand coverage on hover
            r *= (1.0 + 0.2 * hp);
          }

          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          // Color based on tier: Tier 0 regions use theme color, etc.
          const zoneColor = (reg.minTier === 0 && stepIndex === 0) ? theme.colorRGB :
                            (reg.minTier === 1 && stepIndex === 1) ? theme.colorRGB :
                            (stepIndex === 2) ? theme.colorRGB : '255,255,255';
                            
          let alpha = (reg.minTier === stepIndex) ? (0.03 + 0.06 * hp) : 0.02;

          grad.addColorStop(0, `rgba(${zoneColor}, ${alpha})`);
          grad.addColorStop(0.5, `rgba(${zoneColor}, ${alpha * 0.5})`);
          grad.addColorStop(1, `rgba(${zoneColor}, 0)`);
          
          ctx.beginPath();
          ctx.fillStyle = grad;
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // --- Draw Corridors ---
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';

      INFRA_DATA.corridors.forEach(c => {
        if (c.minTier > stepIndex) return;

        const path = [c.r1, ...c.waypoints, c.r2];
        
        let isBuilding = (c.minTier === stepIndex && stepIndex > 0);
        
        // Define route appearance
        let lineAlpha = 0.25;
        let lineWidth = c.type === 'highway' ? 3 : 2;
        let isDashed = false;
        let drawPercent = 1.0;

        if (isBuilding) {
          // New corridors animate in on hover
          if (hp < 0.05) {
            isDashed = true;
            lineAlpha = 0.15;
            lineWidth = 1.5;
          } else {
            isDashed = true;
            lineAlpha = 0.4 * hp;
            lineWidth = 2 + 1 * hp;
            drawPercent = hp;
          }
        } else {
          // Existing corridors get brighter on hover
          lineAlpha = 0.25 + 0.2 * hp;
          lineWidth = c.type === 'highway' ? (3 + hp) : (2 + hp);
        }

        // Helper to draw the path
        const drawPath = (percent, dashArray, colorStr, width) => {
          ctx.beginPath();
          ctx.lineWidth = width;
          ctx.strokeStyle = colorStr;
          ctx.setLineDash(dashArray);
          
          let totalLen = 0;
          const segments = [];
          for (let i = 0; i < path.length - 1; i++) {
            const sx = mapX(path[i].x), sy = mapY(path[i].y);
            const ex = mapX(path[i+1].x), ey = mapY(path[i+1].y);
            const l = Math.hypot(ex - sx, ey - sy);
            segments.push({ sx, sy, ex, ey, l });
            totalLen += l;
          }
          
          let targetLen = totalLen * percent;
          let currentLen = 0;
          
          if (segments.length > 0) {
            ctx.moveTo(segments[0].sx, segments[0].sy);
            for (const seg of segments) {
              if (currentLen + seg.l <= targetLen) {
                ctx.lineTo(seg.ex, seg.ey);
                currentLen += seg.l;
              } else {
                const p = (targetLen - currentLen) / seg.l;
                ctx.lineTo(seg.sx + (seg.ex - seg.sx)*p, seg.sy + (seg.ey - seg.sy)*p);
                break;
              }
            }
          }
          ctx.stroke();
          ctx.setLineDash([]);
        };

        const col = isBuilding ? theme.colorRGB : (stepIndex === 2 ? theme.colorRGB : '180,190,200');

        // Draw Base Route
        drawPath(drawPercent, isDashed ? [6, 6] : [], `rgba(${col}, ${lineAlpha})`, lineWidth);
        
        // Draw Core highlight for existing routes on hover
        if (!isBuilding && hp > 0.1) {
          drawPath(1.0, [], `rgba(${col}, ${lineAlpha * 0.8 * hp})`, lineWidth * 0.4);
        }

        // Draw Light Pulses (Infrastructure Flow) instead of particles
        if (!isBuilding && hp > 0) {
          // A thick glow sweeping along the path
          const pulseProgress = ((time * 0.0005) + c.id * 0.3) % 1;
          const pulseLen = 0.15; // 15% of the path length
          
          // Draw a segment of the path
          if (pulseProgress < 1.0) {
             const startP = Math.max(0, pulseProgress - pulseLen);
             const endP = pulseProgress;
             
             // We can simulate this by drawing the full path with a line-dash that offsets, 
             // but calculating the exact segment is better.
             // For simplicity, let's just use a radial gradient at the moving point.
             let currentLen = 0;
             let totalLen = 0;
             const segments = [];
             for (let i = 0; i < path.length - 1; i++) {
               const sx = mapX(path[i].x), sy = mapY(path[i].y);
               const ex = mapX(path[i+1].x), ey = mapY(path[i+1].y);
               const l = Math.hypot(ex - sx, ey - sy);
               segments.push({ sx, sy, ex, ey, l });
               totalLen += l;
             }
             
             let targetLen = totalLen * pulseProgress;
             let px = segments[0]?.sx, py = segments[0]?.sy;
             for (const seg of segments) {
               if (currentLen + seg.l <= targetLen) {
                 currentLen += seg.l;
               } else {
                 const p = (targetLen - currentLen) / seg.l;
                 px = seg.sx + (seg.ex - seg.sx)*p;
                 py = seg.sy + (seg.ey - seg.sy)*p;
                 break;
               }
             }

             if (px && py) {
               ctx.beginPath();
               const pulseGlow = ctx.createRadialGradient(px, py, 0, px, py, 15);
               pulseGlow.addColorStop(0, `rgba(${col}, ${0.35 * hp})`);
               pulseGlow.addColorStop(1, `rgba(${col}, 0)`);
               ctx.fillStyle = pulseGlow;
               ctx.arc(px, py, 20, 0, Math.PI * 2);
               ctx.fill();
             }
          }
        }
      });

      // --- Draw Regional Settlements / Hubs ---
      INFRA_DATA.regions.forEach(reg => {
        if (reg.minTier > stepIndex) return;

        const x = mapX(reg.x);
        const y = mapY(reg.y);
        
        let alpha = 0.6;
        let scale = 1.0;
        
        if (reg.minTier === stepIndex && stepIndex > 0) {
          alpha = 0.2 + 0.6 * hp;
          scale = 0.5 + 0.5 * hp;
        } else {
          alpha = 0.6 + 0.4 * hp;
        }

        const baseSize = reg.type === 'mega-hub' ? 5 : reg.type === 'regional' ? 3.5 : 2;
        const s = baseSize * scale;

        const cRGB = (reg.minTier === stepIndex) ? theme.colorRGB : (stepIndex === 2 ? theme.colorRGB : '220,230,240');

        ctx.fillStyle = `rgba(${cRGB}, ${alpha})`;
        
        // Draw city as a small cluster of blocks rather than a circle
        if (reg.type === 'mega-hub') {
          ctx.fillRect(x - s, y - s, s*2, s*2);
          ctx.fillRect(x - s*1.5, y + s*0.2, s, s);
          ctx.fillRect(x + s*0.5, y - s*1.5, s, s);
        } else if (reg.type === 'regional') {
          ctx.fillRect(x - s, y - s, s*2, s*2);
          ctx.beginPath();
          ctx.arc(x, y, s*0.5, 0, Math.PI*2);
          ctx.fillStyle = '#0a1018';
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, s, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${cRGB}, ${alpha})`;
          ctx.fill();
        }
        
        // Glow for active hubs
        if (hp > 0 && reg.type !== 'settlement') {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${cRGB}, ${0.15 * hp})`;
          ctx.arc(x, y, s * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [stepIndex, theme, isHovered]);

  return (
    <div 
      className="sim-card__visual" 
      ref={containerRef}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <canvas ref={canvasRef} className="sim-card__canvas" />
    </div>
  );
}

// ─── Main Simulation Component ───
const STEPS = [
  {
    title: 'Current State',
    description: 'Identify isolated regions and infrastructure gaps.',
    stepIndex: 0,
  },
  {
    title: 'Investment Scenario',
    description: 'Plan corridors and bridge critical missing links.',
    stepIndex: 1,
  },
  {
    title: 'Projected Outcome',
    description: 'Achieve fully connected, resilient infrastructure.',
    stepIndex: 2,
  },
];

function Simulation() {
  const [hoveredCard, setHoveredCard] = useState(-1);

  return (
    <section className="section-row simulation" id="simulation">
      <div className="simulation__left">
        <p className="eyebrow">DEVELOPMENT SIMULATION</p>
        <h2 className="section-heading">Plan Today, Transform Tomorrow</h2>
        <p className="section-body">
          Simulate infrastructure investments and see the projected impact
          before it happens.
        </p>
        <a
          href="#simulation-tool"
          className="btn btn-secondary"
          id="sim-explore-btn"
        >
          <span>EXPLORE SIMULATION</span>
          <span className="btn__arrow" aria-hidden="true" />
        </a>
      </div>

      <div className="simulation__right">
        <div className="sim-flow">
          {STEPS.map((step, index) => {
            const isHovered = hoveredCard === index;
            let arrowClass = 'sim-flow__arrow';
            if (isHovered) {
              if (index === 0) arrowClass += ' sim-flow__arrow--pulse-red';
              if (index === 1) arrowClass += ' sim-flow__arrow--move-yellow';
              if (index === 2) arrowClass += ' sim-flow__arrow--flow-cyan';
            }

            return (
              <React.Fragment key={step.title}>
                <article 
                  className="sim-card"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(-1)}
                >
                  <h3 className="sim-card__title">{step.title}</h3>
                  
                  <NetworkCanvas 
                    stepIndex={step.stepIndex} 
                    isHovered={isHovered}
                    onHoverStart={() => setHoveredCard(index)}
                    onHoverEnd={() => setHoveredCard(-1)}
                  />
                  
                  <p className="sim-card__desc">{step.description}</p>
                </article>
                
                {index < STEPS.length - 1 && (
                  <span className={arrowClass} aria-hidden="true">
                    <svg
                      className="sim-flow__arrow-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Simulation;
