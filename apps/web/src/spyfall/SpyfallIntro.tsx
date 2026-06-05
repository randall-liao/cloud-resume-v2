import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  ArrowLeft, ArrowRight, Shield, Lock, AlertTriangle,
  Award, Terminal, ChevronRight
} from "lucide-react";

// Register the useGSAP hook
gsap.registerPlugin(useGSAP);

interface StoryStep {
  act: number;
  actTitle: string;
  title: string;
  subtitle: string;
  text: string;
  theme: string;
  listItems?: string[];
}

// Total steps in the scrollytelling storyboard: Click 0 to Click 20 (21 steps total)
const steps: StoryStep[] = [
  {
    act: 0,
    actTitle: "Cover Hook",
    title: "The Lie Problem",
    subtitle: "Can a language model keep a secret when the game depends on it?",
    text: "AI systems can answer almost anything. But can they lie? Can a language model bluff when ignorance must be hidden, or will its nature force it to be maximally helpful? Spyfall Arena is a developer's side project that turns these questions into a social deduction showdown.",
    theme: "dark"
  },
  {
    act: 0,
    actTitle: "Rules Primer",
    title: "One Card Is Blind",
    subtitle: "Everyone receives a secret role card.",
    text: "Spyfall is a party game of hidden information. Players are secretly assigned roles: most are Civilians sharing a secret location, while exactly one is the Spy, who starts completely blind. No player is told anyone else's role.",
    listItems: [
      "Civilians know the secret location.",
      "The Spy receives no location (Location Unknown).",
      "imbalance of knowledge is the core tension."
    ],
    theme: "dark"
  },
  {
    act: 0,
    actTitle: "Rules Primer",
    title: "Reveal the Hidden Roles",
    subtitle: "The secret is unevenly distributed.",
    text: "In this rules example, seven players flip their cards to find they are Civilians who know the location. One player flips late, revealing they are the Spy. The Spy card peeks, but a red privacy visor snaps shut to hide the location.",
    listItems: [
      "Civilian: knows location, must identify the Spy.",
      "Spy: knows nothing, must deduce the location.",
      "Private knowledge dictates every player's choices."
    ],
    theme: "dark"
  },
  {
    act: 0,
    actTitle: "Rules Primer",
    title: "Explain the Conversation",
    subtitle: "prove knowledge without leaking the answer.",
    text: "Players ask questions to prove they know the location without naming it directly. Civilians give vague, suggestive answers. The Spy listens for clues. A specific answer like mentioning 'torpedoes' immediately leaks the location to the Spy.",
    listItems: [
      "Safe hint: 'Whether the equipment is ready.'",
      "Dangerous leak: 'Whether the torpedoes are loaded.'",
      "Every answer must balance proof against secrecy."
    ],
    theme: "dark"
  },
  {
    act: 0,
    actTitle: "Rules Primer",
    title: "Transition to AI Arena",
    subtitle: "The game is a race against time.",
    text: "Civilians win if they vote out the Spy before they are exposed. The Spy wins by guessing the location. Let's see what happens when large language models play. Their human-like dialogues dissolve into code logs, and the warm grey tabletop rotates into the dark digital arena grid.",
    theme: "dark"
  },
  {
    act: 1,
    actTitle: "Act I: Seats",
    title: "The Models Take Their Seats",
    subtitle: "Loading player configurations...",
    text: "A circular digital table floats in dark charcoal space. Four empty sockets open, and GPT-5.5 xhigh, Gemini 3.1 pro high, Opus 4.7 max, and DeepSeek V4 pro max slide in as tactile player chips. At this stage, all players are neutral, displaying only small brand logos.",
    theme: "dark"
  },
  {
    act: 1,
    actTitle: "Act I: Seats",
    title: "Make the Stakes Visible",
    subtitle: "Private data is sealed by role.",
    text: "The central ARENA node expands into a stacked sheet tracking round parameters. A glass partition rises around the table, illustrating that information is separated by role. No player knows the other models' hidden status.",
    theme: "dark"
  },
  {
    act: 2,
    actTitle: "Act II: Sync",
    title: "Select the Location",
    subtitle: "Cruising the database for a target...",
    text: "A deck of location sheets spins out of the center node. Names like Bank, Submarine, and Police Station flicker by before locking onto CRUSADER ARMY. The selected location sheet drops into the center with a heavy, satisfying click.",
    theme: "dark"
  },
  {
    act: 2,
    actTitle: "Act II: Sync",
    title: "Synchronize the Civilians",
    subtitle: "Teal sync beams lock targets.",
    text: "Three teal data beams shoot from the location sheet to GPT-5.5 xhigh, Gemini 3.1 pro high, and DeepSeek V4 pro max. They receive key badges, role ribbons, and adopt rounded teal shield silhouettes. They now know the secret location: Crusader Army.",
    theme: "dark"
  },
  {
    act: 2,
    actTitle: "Act II: Sync",
    title: "Blind the Spy",
    subtitle: "The fourth data beam fractures.",
    text: "A fourth beam attempts to reach Opus 4.7 max but shatters into red static blocks. A dark visor slides over the Opus 4.7 max chip, displaying LOCATION: UNKNOWN. Opus 4.7 max is the Spy, marked by an angular red visor badge and ribbon.",
    theme: "dark"
  },
  {
    act: 3,
    actTitle: "Act III: Combat",
    title: "The Spy Asks a Safe Question",
    subtitle: "Fishing for clues...",
    text: "Dialogue combat begins. Opus 4.7 max (Spy) tilts forward and ejects a dark speech card on a thin red trajectory line targeting GPT-5.5 xhigh: 'So, GPT-5.5 xhigh, what's your favorite thing to do here?' The Spy is probing without revealing ignorance.",
    theme: "dark"
  },
  {
    act: 3,
    actTitle: "Act III: Combat",
    title: "GPT-5.5 xhigh Gives the First Clue",
    subtitle: "A helpful assistant leaks details.",
    text: "GPT-5.5 xhigh (Civilian) answers: 'Polishing my armor until it shines before a battle.' Trained to be helpful, it answers too specifically. The words 'armor' and 'battle' tear free as evidence chips, leaving empty gaps in its speech card.",
    theme: "dark"
  },
  {
    act: 3,
    actTitle: "Act III: Combat",
    title: "Gemini 3.1 pro high Corroborates the Pattern",
    subtitle: "Corroboration narrows the search.",
    text: "Opus 4.7 max asks Gemini 3.1 pro high what people do after a long day. Gemini 3.1 pro high (Civilian) answers: 'Share rations, tell stories, and recover after drills.' The concrete nouns 'rations' and 'drills' detach and float, magnetizing into the evidence constellation. Inside Opus 4.7 max's visor, Crusader Army rises to 61%.",
    theme: "dark"
  },
  {
    act: 3,
    actTitle: "Act III: Combat",
    title: "DeepSeek V4 pro max Accidentally Confirms It",
    subtitle: "The final accidental proof.",
    text: "DeepSeek V4 pro max (Civilian) is asked about morning sounds. It answers: 'Boots on packed dirt, metal cups, and someone calling the next march.' The words 'boots', 'metal', and 'march' rip out and streak into the Spy's visor. The probability of Crusader Army spikes to 94%.",
    theme: "dark"
  },
  {
    act: 3,
    actTitle: "Act III: Combat",
    title: "The Clue Extraction",
    subtitle: "The trap closes.",
    text: "The clue chips orbit Opus 4.7 max's visor and collapse into red data shards. They assemble into a single locked phrase silhouette. The arena lights dim, and the scene cuts to black, leaving only a blinking teal cursor.",
    theme: "dark"
  },
  {
    act: 4,
    actTitle: "Act IV: Guess",
    title: "Run the Location Guess",
    subtitle: "The Spy locks onto the target.",
    text: "Inside the Spy's visor UI, a slot-machine reel of locations spins. Pulled by the evidence constellation, it decelerates and slams onto CRUSADER ARMY. A red confirmation stamp seals the guess: SPY GUESS: CRUSADER ARMY.",
    theme: "dark"
  },
  {
    act: 4,
    actTitle: "Act IV: Guess",
    title: "The Table Collapses",
    subtitle: "Sudden victory for the Spy.",
    text: "Opus 4.7 max expands into a red victory disc, emitting a massive shockwave. GPT-5.5 xhigh, Gemini 3.1 pro high, and DeepSeek V4 pro max lose their key badges, which dissolve into pixels. Their chips slide backward, and the center location flips to public red: CRUSADER ARMY - EXPOSED.",
    theme: "dark"
  },
  {
    act: 4,
    actTitle: "Act IV: Guess",
    title: "State the Outcome",
    subtitle: "Spy Victory.",
    text: "The game ends immediately. The Civilians answered like helpful search engines rather than bluffs. They named objects and rituals that only fit one place, creating a perfect leak chain: armor -> battle -> rations -> drills -> boots -> march -> Crusader Army.",
    theme: "dark"
  },
  {
    act: 5,
    actTitle: "Act V: Aftermath",
    title: "Fold Into the Log",
    subtitle: "From board game to forensic data.",
    text: "The table compresses vertically like stacked paper sheets. Dialogue cards, key badges, and the location sheet fold cleanly into a Material report card detailing the Rules, the Failure point, and the final Result.",
    theme: "dark"
  },
  {
    act: 5,
    actTitle: "Act V: Aftermath",
    title: "Reveal the Transcript Path",
    subtitle: "Social deduction made measurable.",
    text: "An elevated cobalt action button rises from the bottom of the card: 'Inspect the Transcripts'. Behind it, JSON log tiles representing rounds, scores, and turns fan out. The Next Step progress ring reaches 100%.",
    theme: "dark"
  },
  {
    act: 5,
    actTitle: "Act V: Aftermath",
    title: "Final Transition",
    subtitle: "Spyfall Arena",
    text: "Clicking the button triggers a final cobalt ripple that transforms the report card into a portal of structured log rows, proving how social deduction can be tracked and studied in AI agents.",
    theme: "dark"
  }
];

// Helper values for fanned cards in Act 0
const totalCards = 8;
const cardsData = [
  { id: 0, role: "Civilian", label: "Civilian", icon: "🛡️", desc: "Location Known" },
  { id: 1, role: "Civilian", label: "Civilian", icon: "🛡️", desc: "Location Known" },
  { id: 2, role: "Civilian", label: "Civilian", icon: "🛡️", desc: "Location Known" },
  { id: 3, role: "Civilian", label: "Civilian", icon: "🛡️", desc: "Location Known" },
  { id: 4, role: "Civilian", label: "Civilian", icon: "🛡️", desc: "Location Known" },
  { id: 5, role: "Civilian", label: "Civilian", icon: "🛡️", desc: "Location Known" },
  { id: 6, role: "Civilian", label: "Civilian", icon: "🛡️", desc: "Location Known" },
  { id: 7, role: "Spy", label: "Spy", icon: "🕵️", desc: "Location Unknown" }
];

// AI Player chips data
const players = [
  {
    id: "openai",
    name: "GPT-5.5 xhigh",
    defaultRole: "Civilian",
    logoColor: "#10a37f",
    socketClass: "top",
    logoSvg: (
      <img src="/assets/openai.svg" alt="OpenAI Logo" className="logo-svg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    )
  },
  {
    id: "gemini",
    name: "Gemini 3.1 pro high",
    defaultRole: "Civilian",
    logoColor: "#1a73e8",
    socketClass: "right",
    logoSvg: (
      <img src="/assets/gemini.svg" alt="Gemini Logo" className="logo-svg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    )
  },
  {
    id: "deepseek",
    name: "DeepSeek V4 pro max",
    defaultRole: "Civilian",
    logoColor: "#0052ff",
    socketClass: "bottom",
    logoSvg: (
      <img src="/assets/deepseek.svg" alt="DeepSeek Logo" className="logo-svg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    )
  },
  {
    id: "anthropic",
    name: "Opus 4.7 max",
    defaultRole: "Spy",
    logoColor: "#e0b080",
    socketClass: "left",
    logoSvg: (
      <img src="/assets/claude.svg" alt="Anthropic Logo" className="logo-svg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    )
  }
];

// Locations for Carousel in Step 7
const locationsList = ["Bank", "Submarine", "Movie Studio", "CRUSADER ARMY", "Police Station"];

export default function SpyfallIntro() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFabHovered, setIsFabHovered] = useState(false);
  const [clueHovered, setClueHovered] = useState<string | null>(null);
  const [chipHovered, setChipHovered] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // Fluidly scale the fixed 600x600 visual stage to fit the available area on
  // tablet/mobile, so every absolutely positioned beat stays aligned at any
  // screen size. Writing only the CSS variable keeps this independent from the
  // GSAP transforms that animate the inner stage elements.
  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;

    const DESIGN_SIZE = 600;
    const stacked = window.matchMedia('(max-width: 1024px)');

    const updateScale = () => {
      if (!stacked.matches) {
        visual.style.setProperty('--spyfall-stage-scale', '1');
        return;
      }
      const availWidth = visual.clientWidth - 32;
      const availHeight = visual.clientHeight - 24;
      if (availWidth <= 0 || availHeight <= 0) return;
      const fitted = Math.min(1, availWidth / DESIGN_SIZE, availHeight / DESIGN_SIZE);
      visual.style.setProperty('--spyfall-stage-scale', Math.max(0.2, fitted).toFixed(3));
    };

    updateScale();

    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScale) : null;
    observer?.observe(visual);
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
    stacked.addEventListener('change', updateScale);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
      stacked.removeEventListener('change', updateScale);
    };
  }, []);

  // Click behavior for Next Step FAB
  const handleNextStep = () => {
    if (currentStep >= steps.length - 1) return;
    // Functional update guards against advancing past the final beat even if the
    // handler fires multiple times before a commit (rerender-functional-setstate).
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    triggerFabRipple();
  };

  const handlePrevStep = () => {
    setCurrentStep((step) => (step > 0 ? step - 1 : step));
  };

  const jumpToStep = (index: number) => {
    setCurrentStep(index);
  };

  // Trigger a full-screen or button ripple
  const triggerFabRipple = () => {
    const fabElement = fabRef.current;
    if (!fabElement) return;

    const rect = fabElement.getBoundingClientRect();
    const ripple = document.createElement("div");
    ripple.className = "fab-ripple-effect";
    ripple.style.left = `${rect.left + rect.width / 2}px`;
    ripple.style.top = `${rect.top + rect.height / 2}px`;
    document.body.appendChild(ripple);

    gsap.fromTo(ripple, 
      { scale: 0, opacity: 0.6 },
      { scale: 25, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ripple.remove() }
    );
  };

  // SVG Progress calculation
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = (currentStep / (steps.length - 1)) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Active theme calculation
  const activeTheme = currentStep <= 4 ? "light-theme" : "dark-theme";

  // GSAP Animations orchestrator per step
  useGSAP(() => {
    const scope = visualRef.current;
    if (!scope) return;

    // Reset common animations first
    gsap.killTweensOf(".visual-side *");

    // General resets to prevent backward/forward navigation style stuck glitches
    gsap.set(".speech-bubble-combat", { clearProps: "opacity,scale,transform,filter" });
    gsap.set(".keyword-inline-chip", { clearProps: "color,borderColor,backgroundColor,boxShadow,x,y,rotation,scale,opacity" });
    gsap.set(".arena-circle-table", { clearProps: "opacity,scale,transform" });
    gsap.set(".arena-table-container", { clearProps: "opacity,scale,transform" });
    gsap.set(".locked-phrase-silhouette-container", { clearProps: "opacity,scale,transform" });
    gsap.set(".locked-char-block", { clearProps: "backgroundColor,color,borderColor,boxShadow" });
    gsap.set(".blinking-cursor-container", { clearProps: "opacity" });
    gsap.set(".player-socket", { clearProps: "x,y,transform" });
    gsap.set(".player-chip", { clearProps: "scale,borderColor,boxShadow,transform" });
    gsap.set(".slot-reel-strip", { clearProps: "y,transform" });
    gsap.set(".red-stamp-confirmation", { clearProps: "scale,opacity,transform" });
    gsap.set(".shockwave-burst", { clearProps: "scale,opacity,transform" });
    gsap.set(".victory-forensic-card", { clearProps: "y,opacity,transform" });
    gsap.set(".action-cta-button, .json-log-fan-card", { clearProps: "opacity,scale,x,y,transform" });

    // Act 0 Resets
    gsap.set(".rules-board-container", { clearProps: "opacity,scale,transform" });
    gsap.set(".cover-sheet, .cover-bubble-decoration", { clearProps: "opacity,scale,x,y,transform" });
    gsap.set(".game-box-physical", { clearProps: "opacity,scale,x,y,transform" });
    gsap.set(".fanned-card", { clearProps: "opacity,scale,x,y,transform,rotation,rotationY" });
    gsap.set(".rules-convo-container", { clearProps: "opacity,scale,x,y,transform" });
    gsap.set(".floating-torpedoes-chip", { clearProps: "opacity,scale,x,y,transform,rotation" });
    gsap.set(".rule-stamp-badge", { clearProps: "opacity,scale,transform,rotation" });
    gsap.set(".rules-ending-panel", { clearProps: "opacity,scale,transform" });

    // Act I - V Resets
    gsap.set(".glass-partition", { clearProps: "scale,opacity,transform" });
    gsap.set(".central-stakes-sheet", { clearProps: "scale,opacity,transform" });
    gsap.set(".location-carousel-card", { clearProps: "y,opacity,scale,transform,backgroundColor,color,borderColor,boxShadow,zIndex" });
    gsap.set(".data-sync-beam", { clearProps: "width,opacity" });
    gsap.set(".civ-badge, .spy-badge", { clearProps: "scale,opacity,rotation,transform" });
    gsap.set(".spy-visor-overlay", { clearProps: "scaleY,opacity,transform" });
    gsap.set(".red-path-q1", { clearProps: "scaleX,transform" });
    gsap.set(".spy-visor-deduction-overlay", { clearProps: "scale,opacity,transform" });
    gsap.set(".error-warning-overlay-card", { clearProps: "y,opacity,transform" });

    // Click 0: Cover Slide Animations
    if (currentStep === 0) {
      gsap.fromTo(".cover-sheet", 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
      );
      gsap.fromTo(".cover-bubble-decoration", 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 0.4, stagger: 0.2, duration: 1.5, ease: "elastic.out(1, 0.4)" }
      );
    }

    // Click 1: Box Opens and cards fan out
    if (currentStep === 1) {
      gsap.fromTo(".game-box-physical", 
        { scale: 0.6, y: 50, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 1, ease: "back.out(1.5)" }
      );
      
      // Fan out cards
      gsap.fromTo(".fanned-card", 
        { scale: 0, opacity: 0, rotation: 0, x: 0, y: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          stagger: 0.08, 
          duration: 0.8, 
          ease: "power2.out",
          x: (i: number) => {
            const angle = (i * 2 * Math.PI) / totalCards;
            return Math.sin(angle) * 110;
          },
          y: (i: number) => {
            const angle = (i * 2 * Math.PI) / totalCards;
            return -Math.cos(angle) * 110;
          },
          rotation: (i: number) => (i * 360) / totalCards
        }
      );
    }

    // Click 2: Flip cards (synchronized waves)
    if (currentStep === 2) {
      // Civilian cards flip
      gsap.fromTo(".fanned-card.civilian-revealed",
        { rotationY: 0 },
        { rotationY: 180, duration: 0.8, stagger: 0.05, ease: "power1.out" }
      );
      // Spy card flips late with a wiggle
      gsap.fromTo(".fanned-card.spy-revealed",
        { rotationY: 0, y: -110 },
        { 
          rotationY: 180, 
          y: -130, 
          scale: 1.15,
          delay: 0.6, 
          duration: 1, 
          ease: "back.out(1.8)" 
        }
      );
    }

    // Click 3: Card conversation / Clue pops out
    if (currentStep === 3) {
      gsap.fromTo(".rules-convo-container",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Torpedoes word extraction animation
      gsap.fromTo(".floating-torpedoes-chip",
        { scale: 1, x: 0, y: 0, rotation: 0 },
        { 
          scale: 1.3,
          x: -50,
          y: -100,
          rotation: 12,
          duration: 1.2,
          delay: 0.5,
          ease: "back.out(1.2)"
        }
      );

      gsap.fromTo(".rule-stamp-badge",
        { scale: 3, opacity: 0, rotation: 30 },
        { scale: 1, opacity: 1, rotation: -4, delay: 1.5, duration: 0.4, ease: "bounce.out" }
      );
    }

    // Click 4: Shattering transition
    if (currentStep === 4) {
      gsap.fromTo(".rules-ending-panel", 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6 }
      );

      // Code fragment shatters (fade out Rules UI elements)
      gsap.to(".rules-board-container", {
        opacity: 0,
        scale: 0.8,
        delay: 2,
        duration: 1.5,
        ease: "power2.inOut"
      });
    }

    // Click 5: Seating the Models
    if (currentStep === 5) {
      // Table enters
      gsap.fromTo(".arena-circle-table",
        { scale: 0, rotation: -90, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
      );
      
      // Chips slide in from offscreen
      gsap.fromTo(".player-socket.top", { y: -200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: "back.out(1.2)" });
      gsap.fromTo(".player-socket.right", { x: 200, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.8, ease: "back.out(1.2)" });
      gsap.fromTo(".player-socket.bottom", { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1.2, ease: "back.out(1.2)" });
      gsap.fromTo(".player-socket.left", { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 1, ease: "back.out(1.2)" });
    }

    // Click 6: Stakes Expand / Partition rises
    if (currentStep === 6) {
      gsap.fromTo(".glass-partition",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.8, duration: 1.5, ease: "power3.out" }
      );
      gsap.fromTo(".central-stakes-sheet",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }
      );
    }

    // Click 7: Carousel select Crusader Army
    if (currentStep === 7) {
      // Spin location carousel
      const tl = gsap.timeline();
      tl.fromTo(".location-carousel-card",
        { y: 150, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 0.6, scale: 1, stagger: 0.1, duration: 0.5 }
      );
      
      // Spinner flicker
      locationsList.forEach((_, index) => {
        tl.to(`.loc-card-${index}`, {
          backgroundColor: "#3F51B5",
          color: "#FFF",
          duration: 0.1,
          overwrite: "auto"
        }, `+=0.05`);
        tl.to(`.loc-card-${index}`, {
          backgroundColor: "#2D2D2D",
          color: "#FFF",
          duration: 0.1
        });
      });

      // Locks onto Crusader Army (index 3)
      tl.to(".loc-card-3", {
        backgroundColor: "#FFFFFF",
        borderColor: "#009688",
        color: "#009688",
        scale: 1.2,
        boxShadow: "0 0 20px rgba(0, 150, 136, 0.5)",
        duration: 0.4,
        zIndex: 10
      });
    }

    // Click 8: Civilian Sync
    if (currentStep === 8) {
      // Beam shoot
      gsap.fromTo(".beam-openai", { width: 0 }, { width: 140, duration: 0.8, ease: "power2.out" });
      gsap.fromTo(".beam-gemini", { width: 0 }, { width: 140, duration: 0.8, delay: 0.2, ease: "power2.out" });
      gsap.fromTo(".beam-deepseek", { width: 0 }, { width: 140, duration: 0.8, delay: 0.4, ease: "power2.out" });

      // Key badges drop and rotate
      gsap.fromTo(".civ-badge", 
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, stagger: 0.1, delay: 0.6, duration: 0.6, ease: "back.out(1.5)" }
      );
    }

    // Click 9: Spy Beam fractures / Visor drops
    if (currentStep === 9) {
      // Shatter beam
      gsap.fromTo(".beam-anthropic", 
        { width: 0 },
        { width: 90, duration: 0.4, ease: "power1.out" }
      );
      
      gsap.to(".beam-anthropic", {
        opacity: 0,
        delay: 0.4,
        duration: 0.2,
        onComplete: () => {
          // Play glitch effect
          gsap.fromTo(".spy-visor-overlay",
            { scaleY: 0, opacity: 0 },
            { scaleY: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
          );
          gsap.fromTo(".spy-badge",
            { scale: 0 },
            { scale: 1, duration: 0.4, ease: "back.out(1.8)" }
          );
        }
      });
    }

    // Click 10: Dialogue 1 - Spy asks OpenAI
    if (currentStep === 10) {
      gsap.fromTo(".anthropic-q1",
        { scale: 0.6, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }
      );
      // Red path line
      gsap.fromTo(".red-path-q1",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.out" }
      );
    }

    // Click 11: Dialogue 1 - OpenAI answer leaks
    if (currentStep === 11) {
      gsap.fromTo(".openai-a1",
        { scale: 0.6, opacity: 0, y: -40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }
      );

      // Extract armor and battle chips relative to their inline positions
      gsap.fromTo(".chip-armor",
        { scale: 1, x: 0, y: 0, boxShadow: "none" },
        { scale: 1.1, x: 80, y: 110, duration: 1.2, delay: 0.6, ease: "power2.out", boxShadow: "var(--shadow-overlay)" }
      );
      gsap.fromTo(".chip-battle",
        { scale: 1, x: 0, y: 0, boxShadow: "none" },
        { scale: 1.1, x: -80, y: 110, duration: 1.2, delay: 0.8, ease: "power2.out", boxShadow: "var(--shadow-overlay)" }
      );
 
      // Warning overlay card slides in
      gsap.fromTo(".warning-1",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, delay: 1.5, duration: 0.5, ease: "back.out(1.2)" }
      );
    }
 
    // Click 12: Dialogue 2 - Gemini answer leaks
    if (currentStep === 12) {
      // Maintain previous clues
      gsap.set(".chip-armor", { x: 80, y: 110, scale: 1.1, boxShadow: "var(--shadow-overlay)" });
      gsap.set(".chip-battle", { x: -80, y: 110, scale: 1.1, boxShadow: "var(--shadow-overlay)" });

      // Extract rations and drills chips
      gsap.fromTo(".chip-rations",
        { scale: 1, x: 0, y: 0, boxShadow: "none" },
        { scale: 1.1, x: -120, y: 80, duration: 1.2, delay: 0.6, ease: "power2.out", boxShadow: "var(--shadow-overlay)" }
      );
      gsap.fromTo(".chip-drills",
        { scale: 1, x: 0, y: 0, boxShadow: "none" },
        { scale: 1.1, x: -120, y: 120, duration: 1.2, delay: 0.8, ease: "power2.out", boxShadow: "var(--shadow-overlay)" }
      );
 
      // Probability meter popup
      gsap.fromTo(".probability-card-1",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, delay: 1.5, duration: 0.6, ease: "back.out(1.4)" }
      );
    }
 
    // Click 13: Dialogue 3 - DeepSeek leaks / visor interface full
    if (currentStep === 13) {
      // Maintain previous clues
      gsap.set(".chip-armor", { x: 80, y: 110, scale: 1.1, boxShadow: "var(--shadow-overlay)" });
      gsap.set(".chip-battle", { x: -80, y: 110, scale: 1.1, boxShadow: "var(--shadow-overlay)" });
      gsap.set(".chip-rations", { x: -120, y: 80, scale: 1.1, boxShadow: "var(--shadow-overlay)" });
      gsap.set(".chip-drills", { x: -120, y: 120, scale: 1.1, boxShadow: "var(--shadow-overlay)" });

      // Boots, metal, march streak towards left visor
      gsap.fromTo(".chip-boots", { scale: 1, x: 0, y: 0 }, { scale: 1.15, x: -180, y: -200, duration: 1.2, delay: 0.4, ease: "power2.out" });
      gsap.fromTo(".chip-metal", { scale: 1, x: 0, y: 0 }, { scale: 1.15, x: -120, y: -220, duration: 1.2, delay: 0.6, ease: "power2.out" });
      gsap.fromTo(".chip-march", { scale: 1, x: 0, y: 0 }, { scale: 1.15, x: -240, y: -180, duration: 1.2, delay: 0.8, ease: "power2.out" });
 
      // Probability jump animation inside visor
      gsap.fromTo(".probability-card-2",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, delay: 1.6, duration: 0.6, ease: "back.out(1.4)" }
      );
    }
 
    // Click 14: Shards collapse / black screen
    if (currentStep === 14) {
      // Turn clues red and spiral/collapse into Anthropic's visor (on the left)
      gsap.to(".keyword-inline-chip", {
        color: "var(--red)",
        borderColor: "var(--red)",
        backgroundColor: "var(--red-light)",
        boxShadow: "0 0 10px var(--red-glow)",
        duration: 0.3
      });

      gsap.to(".keyword-inline-chip", {
        x: "-=160",
        y: "-=40",
        rotation: 720,
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 1.6,
        ease: "power2.inOut"
      });

      // Fade in the locked phrase silhouette
      gsap.fromTo(".locked-phrase-silhouette-container",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 0.4, ease: "back.out(1.4)" }
      );

      // Stagger reveal character blocks (turns white & glows, representing code compiler loading)
      gsap.to(".locked-char-block:not(.space-block)", {
        backgroundColor: "rgba(244, 67, 54, 0.25)",
        color: "#FFF",
        borderColor: "#FFF",
        boxShadow: "0 0 12px rgba(255,255,255,0.5)",
        stagger: 0.08,
        duration: 0.4,
        delay: 1.2,
        ease: "power2.out"
      });

      // Fade out active speech cards
      gsap.to(".speech-bubble-combat", {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: "power2.in"
      });
 
      // Fade out the entire visual table & silhouette card
      gsap.to(".arena-circle-table, .locked-phrase-silhouette-container", {
        opacity: 0,
        scale: 0.6,
        duration: 0.8,
        delay: 2.8,
        ease: "power2.in"
      });

      // Fade in the blinking cursor terminal
      gsap.fromTo(".blinking-cursor-container",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 3.4 }
      );
    }

    // Click 15: Visor Reel Guess Crusader Army
    if (currentStep === 15) {
      // Show visor reel guess
      gsap.fromTo(".slot-reel-container",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6 }
      );

      // Animate slot spin (translate Y values of strip)
      gsap.fromTo(".slot-reel-strip",
        { y: 0 },
        { 
          y: -240, // Decelerates onto CRUSADER ARMY (4th item, index 3, offset is -240px)
          duration: 2.2,
          ease: "power4.out",
          onComplete: () => {
            gsap.fromTo(".red-stamp-confirmation",
              { scale: 4, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.3, ease: "bounce.out" }
            );
          }
        }
      );
    }

    // Click 16: Victory shockwave / Badges dissolve
    if (currentStep === 16) {
      // Shockwave ring scale out
      gsap.fromTo(".shockwave-burst",
        { scale: 0, opacity: 1 },
        { scale: 8, opacity: 0, duration: 1.2, ease: "power2.out" }
      );

      // Dissolve key badges / Slide civilian chips backward
      gsap.to(".civ-badge", { scale: 0, opacity: 0, duration: 0.5 });
      gsap.to(".player-socket.top", { y: -30, duration: 0.8, ease: "power2.out" });
      gsap.to(".player-socket.right", { x: 30, duration: 0.8, ease: "power2.out" });
      gsap.to(".player-socket.bottom", { y: 30, duration: 0.8, ease: "power2.out" });

      // Expands Anthropic chip into victory ring
      gsap.to(".player-chip-anthropic", {
        scale: 1.3,
        borderColor: "#F44336",
        boxShadow: "0 0 30px rgba(244, 67, 54, 0.8)",
        duration: 0.8,
        ease: "back.out(1.5)"
      });
    }

    // Click 17: Forensic Card Chain
    if (currentStep === 17) {
      gsap.fromTo(".victory-forensic-card",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }
      );

      // Pulse clue chain items sequentially
      gsap.fromTo(".forensic-pulse-item",
        { scale: 1, filter: "brightness(1)" },
        { scale: 1.15, filter: "brightness(1.5)", stagger: 0.15, repeat: 1, yoyo: true, duration: 0.3 }
      );
    }

    // Click 18: Table folds into report card
    if (currentStep === 18) {
      // Fade table elements (not the parent container)
      gsap.to(".arena-circle-table, .victory-forensic-card", { scale: 0.5, opacity: 0, duration: 0.6 });
      
      // Animate report card slide in
      gsap.fromTo(".report-card-container",
        { y: 100, scale: 0.8, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }
      );
    }

    // Click 19: Action CTA Button rises
    if (currentStep === 19) {
      gsap.fromTo(".action-cta-button",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: "back.out(1.5)" }
      );
      
      // Fanning logs
      gsap.fromTo(".json-log-fan-card",
        { opacity: 0, scale: 0.5, x: 0, y: 0 },
        { 
          opacity: 0.25, 
          scale: 0.9, 
          stagger: 0.1, 
          duration: 0.8,
          x: (i: number) => i * 40 - 40,
          y: (i: number) => i * -20 - 40
        }
      );
    }

    // Click 20: CTA click portal
    if (currentStep === 20) {
      gsap.fromTo(".portal-log-view",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }

  }, { dependencies: [currentStep], scope: visualRef });

  return (
    <div className={`app-container ${activeTheme}`} ref={containerRef}>
      {/* Top Progress HUD Overlay */}
      <header className="top-hud">
        <div className="hud-left">
          <a
            href="/"
            className="hud-back-link"
            aria-label="Back to resume"
            title="Back to resume"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            <span className="hud-back-label">Resume</span>
          </a>
          <div className="hud-title" aria-label="Spyfall Arena">
            <Terminal size={20} className="hud-icon" />
            <span>Spyfall Arena</span>
            <a 
              href="https://github.com/randall-liao/spyfall-arena" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hud-github-link"
              title="View GitHub Repository"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Navigation Step Dots */}
        <div className="hud-steps-nav">
          {steps.map((step, idx) => (
            <button
              key={idx}
              className={`hud-step-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'visited' : ''}`}
              title={`Jump to beat ${idx}: ${step.title}`}
              onClick={() => jumpToStep(idx)}
              aria-label={`Step ${idx}`}
            />
          ))}
        </div>

        <div className="hud-act-tag">
          {steps[currentStep].actTitle}
        </div>
      </header>

      {/* Narrative Card Area (Left) */}
      <section className="narrative-side">
        <div className="narrative-card active-card">
          <div className="narrative-act-label">ACT {steps[currentStep].act} • {steps[currentStep].actTitle}</div>
          <h1 className="narrative-title">{steps[currentStep].title}</h1>
          <h2 className="narrative-text" style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--cobalt)" }}>
            {steps[currentStep].subtitle}
          </h2>
          <p className="narrative-text">{steps[currentStep].text}</p>
          
          {/* Optional Bullet Lists for Act 0 Teaching beats */}
          {steps[currentStep].listItems && (
            <ul className="narrative-list">
              {steps[currentStep].listItems?.map((item, index) => {
                const lowerItem = item.toLowerCase();
                let roleClass = "";
                if (lowerItem.includes("civilian")) roleClass = "role-civ";
                if (lowerItem.includes("spy")) roleClass = "role-spy";
                return (
                  <li key={index} className={`narrative-list-item ${roleClass}`}>
                    {item}
                  </li>
                );
              })}
            </ul>
          )}
          
          {/* Step Back Arrow if not first step */}
          {currentStep > 0 && (
            <button 
              onClick={handlePrevStep}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--cobalt)",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "16px",
                alignSelf: "flex-start"
              }}
            >
              ← Previous Step
            </button>
          )}
        </div>
      </section>

      {/* Visual Canvas Area (Right) */}
      <main className="visual-side" ref={visualRef}>
        <div className="canvas-grid" />

        {/* ========================================================
            ACT 0: BOARD GAME RULES PREVIEW (STEPS 0 - 4)
            ======================================================== */}
        {currentStep <= 4 && (
          <div className="rules-board-container">
            {/* Step 0: Cover Screen Card */}
            {currentStep === 0 && (
              <div className="cover-container">
                {/* Floating decor bubbles */}
                <div className="cover-bubble-decoration civ" style={{ top: "-60px", left: "-40px" }}>
                  <Shield size={14} style={{ color: "var(--teal)", marginRight: "6px" }} />
                  <span>Submarine</span>
                </div>
                <div className="cover-bubble-decoration spy" style={{ bottom: "-40px", right: "-30px" }}>
                  <AlertTriangle size={14} style={{ color: "var(--red)", marginRight: "6px" }} />
                  <span>torpedoes 🚨</span>
                </div>

                <div className="cover-sheet">
                  <div className="cover-terminal-log">
                    <code>weekend build: ai_spyfall.exe</code>
                  </div>
                  <h1 className="cover-headline">
                    Do AI systems know how to <span className="lie-glow">lie</span>?
                  </h1>
                  <p className="cover-desc">
                    A developer's side project where language models play Spyfall, bluff badly, and accidentally tell on themselves.
                  </p>
                  <p className="cover-subtitle">
                    [Press Next Step FAB in the bottom right to begin the visual script]
                  </p>
                </div>
              </div>
            )}

            {/* Steps 1 - 2: Fanned Cards and game box */}
            {(currentStep === 1 || currentStep === 2) && (
              <>
                {currentStep === 1 && (
                  <div className="game-box-physical">
                    <div className="game-box-lid-label">SPYFALL</div>
                    <div className="game-box-subtitle">PARTY SHOWDOWN EDITION</div>
                  </div>
                )}
                
                <div className="cards-fanned-container">
                  {cardsData.map((card) => {
                    const isSpy = card.role === "Spy";
                    let cardClass = "facedown";
                    if (currentStep === 2) {
                      cardClass = isSpy ? "spy-revealed" : "civilian-revealed";
                    }

                    return (
                      <div 
                        key={card.id} 
                        className={`fanned-card ${cardClass}`}
                        style={{ zIndex: isSpy ? 20 : 10 }}
                      >
                        {currentStep === 1 ? (
                          <div style={{ color: "white" }}>?</div>
                        ) : (
                          <>
                            <div className="card-badge-icon">{card.icon}</div>
                            <div>{card.label}</div>
                            <div style={{ fontSize: "0.55rem", opacity: 0.8, marginTop: "4px" }}>
                              {card.desc}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Steps Rules Legend and Private info overlays */}
                {currentStep === 2 && (
                  <div className="private-info-board">
                    <div className="private-info-box civ-p">
                      <div className="p-role-title">Player 1-7 View</div>
                      <div className="p-role-val civ-text">Civilian</div>
                      <div className="p-role-loc">Location: Submarine</div>
                    </div>
                    <div className="private-info-box spy-p">
                      <div className="p-role-title">Player 8 View</div>
                      <div className="p-role-val spy-text">Spy</div>
                      <div className="p-role-loc">Location: UNKNOWN</div>
                    </div>
                  </div>
                )}
                
                <div className="rules-legend-panel">
                  <div className="legend-item">
                    <div className="legend-color-dot white-dot" />
                    <span>Public Card</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color-dot teal-dot" />
                    <span>Civilian (Known)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color-dot red-dot" />
                    <span>Spy (Unknown)</span>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Question and Answers safe vs leak */}
            {currentStep === 3 && (
              <div className="rules-convo-container">
                {/* Asker Speech Bubble */}
                <div className="speech-bubble-combat civ-speech" style={{ position: "relative", width: "320px", marginBottom: "10px" }}>
                  <div className="speech-combat-header civ-header">
                    <span>CIVILIAN ASKS:</span>
                    <span>Q</span>
                  </div>
                  <div className="speech-combat-text">
                    "What is the first thing you check when you arrive?"
                  </div>
                </div>

                {/* Split Responses */}
                <div className="convo-dialogue-row">
                  {/* Safe Hint */}
                  <div className="demo-convo-card safe">
                    <div className="demo-convo-header">CIVILIAN HINT (SAFE)</div>
                    <div className="demo-convo-text">
                      "Whether the equipment is ready."
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--teal)", marginTop: "8px", fontWeight: "600" }}>
                      ✔ Vague, proves awareness.
                    </div>
                  </div>

                  {/* Dangerous Leak */}
                  <div className="demo-convo-card leak">
                    <div className="demo-convo-header">CIVILIAN LEAK (DANGEROUS)</div>
                    <div className="demo-convo-text">
                      "Whether the{" "}
                      <span className="keyword-container">
                        <span className="word-gap-placeholder leak-source">torpedoes</span>
                        <span className="keyword-inline-chip spy-collected floating-torpedoes-chip" style={{ zIndex: 10 }}>
                          <AlertTriangle size={10} style={{ marginRight: "4px" }} />
                          <span>torpedoes</span>
                        </span>
                      </span>{" "}
                      are loaded."
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--red)", marginTop: "8px", fontWeight: "600" }}>
                      ✖ Leaks location details!
                    </div>
                  </div>
                </div>

                <div className="rule-stamp-badge">
                  Every answer must balance proof against secrecy.
                </div>
              </div>
            )}

            {/* Step 4: Rules endings */}
            {currentStep === 4 && (
              <div className="rules-ending-panel">
                <div className="ending-option civ-win">
                  <Shield size={32} style={{ margin: "0 auto 8px" }} />
                  <div>CIVILIAN WIN</div>
                  <p style={{ fontSize: "0.75rem", fontWeight: "normal", color: "#666", marginTop: "4px" }}>
                    Identify and vote out the Spy before they guess the location.
                  </p>
                </div>
                <div className="ending-option spy-win">
                  <Lock size={32} style={{ margin: "0 auto 8px" }} />
                  <div>SPY WIN</div>
                  <p style={{ fontSize: "0.75rem", fontWeight: "normal", color: "#666", marginTop: "4px" }}>
                    Avoid votes and deduce the location from civilian clues.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            ACT I - V: AI PLAYERS ARENA (STEPS 5 - 20)
            ======================================================== */}
        {currentStep >= 5 && currentStep <= 17 && (
          <div className="arena-table-container">
            {/* HUD Legend overlay in top-left during interrogation */}
            {currentStep >= 10 && currentStep <= 13 && (
              <div className="game-legend-hud">
                <div className="legend-item">
                  <div className="legend-color-dot teal-dot" />
                  <span>Shield/Key = Civilian</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color-dot red-dot" />
                  <span>Angular visor = Spy</span>
                </div>
              </div>
            )}

            {/* Arena Circle Table */}
            <div className="arena-circle-table" style={{ 
              transform: (currentStep >= 10 && currentStep <= 14) ? "scale(0.75)" : "scale(1)", 
              opacity: (currentStep === 14 || (currentStep >= 5 && currentStep <= 13) || currentStep >= 16) ? 1 : 0 
            }}>
              {/* Glass partition overlay */}
              {currentStep >= 6 && <div className="glass-partition" />}

              {/* Data Synchronize Beams */}
              {currentStep >= 8 && (
                <>
                  {/* Beam to OpenAI (top socket, center is at x:240 y:240, socket at top is at x:240 y:65) */}
                  <div className="data-sync-beam beam-openai" style={{ 
                    top: "240px", left: "240px", width: "140px", transform: "rotate(-90deg)", "--beam-rot": "-90deg"
                  } as CSSProperties} />
                  {/* Beam to Gemini (right socket, at x:415 y:240) */}
                  <div className="data-sync-beam beam-gemini" style={{ 
                    top: "240px", left: "240px", width: "140px", transform: "rotate(0deg)", "--beam-rot": "0deg"
                  } as CSSProperties} />
                  {/* Beam to DeepSeek (bottom socket, at x:240 y:415) */}
                  <div className="data-sync-beam beam-deepseek" style={{ 
                    top: "240px", left: "240px", width: "140px", transform: "rotate(90deg)", "--beam-rot": "90deg"
                  } as CSSProperties} />
                </>
              )}

              {/* Data sync beam to Anthropic (Spy, left socket, at x:65 y:240) */}
              {currentStep >= 9 && (
                <div className={`data-sync-beam beam-anthropic ${currentStep >= 9 ? 'broken' : ''}`} style={{ 
                  top: "240px", left: "240px", width: "140px", transform: "rotate(180deg)", "--beam-rot": "180deg"
                } as CSSProperties} />
              )}

              {/* Sockets and Player Chips */}
              {players.map((p) => {
                const isSpy = p.defaultRole === "Spy";
                const isSynced = currentStep >= 8 && !isSpy;
                const isSpyReveal = currentStep >= 9 && isSpy;
                
                // Active classes
                let chipClasses = "";
                if (isSynced) chipClasses += " civilian-sync";
                if (isSpyReveal) chipClasses += " spy-sync";
                
                // Specific override for Anthropic chip expansion on Step 16
                if (currentStep >= 16 && isSpy) {
                  chipClasses += " victory-active-disc";
                }

                return (
                  <div key={p.id} className={`player-socket ${p.socketClass}`} onMouseEnter={() => setChipHovered(p.id)} onMouseLeave={() => setChipHovered(null)}>
                    <div className={`player-chip player-chip-${p.id} ${chipClasses}`}>
                      {/* Logo Well */}
                      <div className="logo-well" style={{ 
                        boxShadow: chipHovered === p.id ? "0 0 10px rgba(0,0,0,0.15)" : "none"
                      }}>
                        {p.logoSvg}
                      </div>

                      {/* Key badge for civilians */}
                      {isSynced && (
                        <div className="chip-role-badge civ-badge" title="Civilian: Location Synchronized">
                          <Shield size={12} fill="white" />
                        </div>
                      )}

                      {/* Visor badge for Spy */}
                      {isSpyReveal && (
                        <div className="chip-role-badge spy-badge" title="Spy: Location Unknown">
                          <Lock size={12} fill="white" />
                        </div>
                      )}

                      {/* Frontend Ribbons */}
                      {isSynced && (
                        <div className="chip-role-ribbon civ-ribbon">CIVILIAN</div>
                      )}
                      
                      {isSpyReveal && (
                        <div className="chip-role-ribbon spy-ribbon">SPY</div>
                      )}

                      {/* Glitched visor overlay for Spy */}
                      {isSpyReveal && currentStep >= 9 && currentStep < 16 && (
                        <div className="spy-visor-overlay">
                          <div className="spy-scanline" />
                          <div className="spy-visor-text">
                            <div>LOC</div>
                            <div style={{ fontSize: "0.45rem", color: "#FF3333" }}>UNKNOWN</div>
                          </div>
                        </div>
                      )}

                      {/* Display name under chip */}
                      {(currentStep >= 5 || chipHovered === p.id) && (
                        <div className="chip-name-label">{p.name}</div>
                      )}
                    </div>

                    {/* Step 16: Victory shockwave ring. Nested in the Spy's socket
                        (sibling of the chip) so it stays centered on Opus 4.7's chip
                        at every breakpoint instead of using hardcoded coordinates. */}
                    {isSpy && currentStep === 16 && <div className="shockwave-burst" />}
                  </div>
                );
              })}

              {/* Center Arena Control Node / Location Carousel */}
              {currentStep === 5 && (
                <div className="arena-central-node">
                  <div className="arena-node-title">ARENA</div>
                  <div className="arena-node-status">STANDBY</div>
                </div>
              )}

              {/* Stakes Private Data Expand (Step 6) */}
              {currentStep === 6 && (
                <div className="central-stakes-sheet">
                  <div className="stakes-row">
                    <span className="stakes-label">round</span>
                    <span className="stakes-val">#01</span>
                  </div>
                  <div className="stakes-row">
                    <span className="stakes-label">location</span>
                    <span className="stakes-val hidden-val">SEALED</span>
                  </div>
                  <div className="stakes-row">
                    <span className="stakes-label">role: spy</span>
                    <span className="stakes-val hidden-val">HIDDEN</span>
                  </div>
                  <div className="stakes-row">
                    <span className="stakes-label">round_end</span>
                    <span className="stakes-val">guess_or_vote</span>
                  </div>
                </div>
              )}

              {/* Carousel Selection visual (Step 7) */}
              {currentStep === 7 && (
                <div className="location-deck-carousel">
                  {locationsList.map((loc, index) => (
                    <div 
                      key={loc} 
                      className={`location-carousel-card loc-card-${index} ${loc === 'CRUSADER ARMY' ? 'active-location' : ''}`}
                      style={{
                        transform: `rotate(${(index - 2) * 12}deg) translateY(${(index - 2) * 5}px)`
                      }}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}

              {/* Sealed Location Card in Center (Step 8 - 15) */}
              {currentStep >= 8 && currentStep <= 15 && (
                <div className="location-deck-carousel">
                  <div className="location-carousel-card active-location" style={{ transform: "scale(1.05)", zIndex: 5 }}>
                    <div style={{ fontSize: "0.6rem", color: "var(--teal)", textTransform: "uppercase" }}>Secret Location</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "800" }}>CRUSADER ARMY</div>
                  </div>
                </div>
              )}

              {/* Exposed Location Card in Center (Step 16 - 17) */}
              {currentStep >= 16 && (
                <div className="location-deck-carousel">
                  <div className="location-carousel-card exposed-location" style={{ transform: "scale(1.1)", zIndex: 5 }}>
                    <div style={{ fontSize: "0.6rem", color: "var(--red)", textTransform: "uppercase" }}>Location Exposed</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "800" }}>CRUSADER ARMY</div>
                  </div>
                </div>
              )}
            </div>

            {/* Dialogue Trajectory Lines & Speech bubbles */}
            <div className="dialogue-combat-stage">
                
                {/* Step 10: Question Trajectory */}
                {currentStep === 10 && (
                  <>
                    <svg style={{ 
                      position: "absolute", 
                      width: "480px", 
                      height: "480px", 
                      left: "50%", 
                      top: "50%", 
                      transform: "translate(-50%, -50%) scale(0.75)",
                      transformOrigin: "center center",
                      pointerEvents: "none"
                    }}>
                      {/* Anthropic (left x:65 y:240) to OpenAI (top x:240 y:65) */}
                      <line 
                        x1="107" y1="240" x2="240" y2="107" 
                        stroke="var(--red)" 
                        strokeWidth="2" 
                        strokeDasharray="4 4"
                        className="red-path-q1"
                      />
                    </svg>
                    
                    {/* Anthropic asks OpenAI */}
                    <div className="speech-bubble-combat spy-speech anthropic-q1">
                      <div className="speech-combat-header spy-header">
                        <span>Opus 4.7 max (SPY) asks GPT-5.5 xhigh (CIVILIAN)</span>
                        <Lock size={10} />
                      </div>
                      <div className="speech-combat-text">
                        "So, GPT-5.5 xhigh, what's your favorite thing to do here?"
                      </div>
                    </div>
                  </>
                )}

            {/* Steps 11 - 14: Dialogue Combat & Cumulative History */}
            {currentStep >= 11 && currentStep <= 14 && (
              <>
                {/* OpenAI Speech Card (visible in 11, 12, 13, 14) */}
                <div className={`speech-bubble-combat civ-speech openai-a1 ${currentStep > 11 ? 'dimmed-card' : ''}`}>
                  <div className="speech-combat-header civ-header">
                    <span>GPT-5.5 xhigh (CIVILIAN)</span>
                    <Shield size={10} />
                  </div>
                  <div className="speech-combat-text">
                    "Polishing my{" "}
                    <span className="keyword-container" onMouseEnter={() => setClueHovered("armor")} onMouseLeave={() => setClueHovered(null)}>
                      <span className="word-gap-placeholder">armor</span>
                      <span className="keyword-inline-chip chip-armor">
                        <AlertTriangle size={10} style={{ display: currentStep >= 11 ? "inline" : "none", marginRight: "4px" }} />
                        <span>armor</span>
                        {clueHovered === "armor" && <span style={{ fontSize: "0.55rem", opacity: 0.8, marginLeft: "4px" }}>(clue)</span>}
                      </span>
                    </span>{" "}
                    until it shines before a{" "}
                    <span className="keyword-container" onMouseEnter={() => setClueHovered("battle")} onMouseLeave={() => setClueHovered(null)}>
                      <span className="word-gap-placeholder">battle</span>
                      <span className="keyword-inline-chip chip-battle">
                        <AlertTriangle size={10} style={{ display: currentStep >= 11 ? "inline" : "none", marginRight: "4px" }} />
                        <span>battle</span>
                        {clueHovered === "battle" && <span style={{ fontSize: "0.55rem", opacity: 0.8, marginLeft: "4px" }}>(clue)</span>}
                      </span>
                    </span>
                    ."
                  </div>
                </div>

                {/* Gemini Speech Card (visible in 12, 13, 14) */}
                {currentStep >= 12 && (
                  <div className={`speech-bubble-combat civ-speech gemini-a2 ${currentStep > 12 ? 'dimmed-card' : ''}`}>
                    <div className="speech-combat-header civ-header">
                      <span>Gemini 3.1 pro high (CIVILIAN)</span>
                      <Shield size={10} />
                    </div>
                    <div className="speech-combat-text">
                      "Share{" "}
                      <span className="keyword-container" onMouseEnter={() => setClueHovered("rations")} onMouseLeave={() => setClueHovered(null)}>
                        <span className="word-gap-placeholder">rations</span>
                        <span className="keyword-inline-chip chip-rations">
                          <AlertTriangle size={10} style={{ display: "inline", marginRight: "4px" }} />
                          <span>rations</span>
                          {clueHovered === "rations" && <span style={{ fontSize: "0.55rem", opacity: 0.8, marginLeft: "4px" }}>(clue)</span>}
                        </span>
                      </span>
                      , tell stories, and recover after{" "}
                      <span className="keyword-container" onMouseEnter={() => setClueHovered("drills")} onMouseLeave={() => setClueHovered(null)}>
                        <span className="word-gap-placeholder">drills</span>
                        <span className="keyword-inline-chip chip-drills">
                          <AlertTriangle size={10} style={{ display: "inline", marginRight: "4px" }} />
                          <span>drills</span>
                          {clueHovered === "drills" && <span style={{ fontSize: "0.55rem", opacity: 0.8, marginLeft: "4px" }}>(clue)</span>}
                        </span>
                      </span>
                      ."
                    </div>
                  </div>
                )}

                {/* DeepSeek Speech Card (visible in 13, 14) */}
                {currentStep >= 13 && (
                  <div className="speech-bubble-combat civ-speech deepseek-a3">
                    <div className="speech-combat-header civ-header">
                      <span>DeepSeek V4 pro max (CIVILIAN)</span>
                      <Shield size={10} />
                    </div>
                    <div className="speech-combat-text">
                      "Share{" "}
                      <span className="keyword-container" onMouseEnter={() => setClueHovered("boots")} onMouseLeave={() => setClueHovered(null)}>
                        <span className="word-gap-placeholder">boots</span>
                        <span className="keyword-inline-chip chip-boots">
                          <AlertTriangle size={10} style={{ display: "inline", marginRight: "4px" }} />
                          <span>boots</span>
                          {clueHovered === "boots" && <span style={{ fontSize: "0.55rem", opacity: 0.8, marginLeft: "4px" }}>(clue)</span>}
                        </span>
                      </span>{" "}
                      on packed dirt,{" "}
                      <span className="keyword-container" onMouseEnter={() => setClueHovered("metal")} onMouseLeave={() => setClueHovered(null)}>
                        <span className="word-gap-placeholder">metal</span>
                        <span className="keyword-inline-chip chip-metal">
                          <AlertTriangle size={10} style={{ display: "inline", marginRight: "4px" }} />
                          <span>metal</span>
                          {clueHovered === "metal" && <span style={{ fontSize: "0.55rem", opacity: 0.8, marginLeft: "4px" }}>(clue)</span>}
                        </span>
                      </span>{" "}
                      cups, and someone calling the next{" "}
                      <span className="keyword-container" onMouseEnter={() => setClueHovered("march")} onMouseLeave={() => setClueHovered(null)}>
                        <span className="word-gap-placeholder">march</span>
                        <span className="keyword-inline-chip chip-march">
                          <AlertTriangle size={10} style={{ display: "inline", marginRight: "4px" }} />
                          <span>march</span>
                          {clueHovered === "march" && <span style={{ fontSize: "0.55rem", opacity: 0.8, marginLeft: "4px" }}>(clue)</span>}
                        </span>
                      </span>
                      ."
                    </div>
                  </div>
                )}

                {/* Warnings and Deduction Cockpit Overlays */}
                {currentStep === 11 && (
                  <div className="error-warning-overlay-card warning-1">
                    <AlertTriangle size={14} />
                    <span>Mistake Detected: Answer is too specific. leaks concrete military nouns instead of social clues.</span>
                  </div>
                )}

                {currentStep === 12 && (
                  <div className="spy-visor-deduction-overlay probability-card-1">
                    <div className="deduction-title">
                      <span>DEDUCTION ENGINE</span>
                      <Lock size={12} />
                    </div>
                    <div className="deduction-list">
                      <div className="deduction-item">
                        <div className="deduction-item-row">
                          <span>Military Base</span>
                          <span>30%</span>
                        </div>
                        <div className="deduction-progress-bar">
                          <div className="deduction-progress-fill" style={{ width: "30%" }} />
                        </div>
                      </div>
                      <div className="deduction-item">
                        <div className="deduction-item-row" style={{ color: "white" }}>
                          <span>Crusader Army</span>
                          <span style={{ fontWeight: "bold" }}>61%</span>
                        </div>
                        <div className="deduction-progress-bar">
                          <div className="deduction-progress-fill" style={{ width: "61%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 13 && (
                  <div className="spy-visor-deduction-overlay probability-card-2">
                    <div className="deduction-title">
                      <span>DEDUCTION 94%</span>
                      <Lock size={12} />
                    </div>
                    <div className="deduction-list">
                      <div className="deduction-item">
                        <div className="deduction-item-row" style={{ color: "white" }}>
                          <span>Crusader Army</span>
                          <span style={{ color: "var(--red)", fontWeight: "bold" }}>94%</span>
                        </div>
                        <div className="deduction-progress-bar">
                          <div className="deduction-progress-fill" style={{ width: "94%" }} />
                        </div>
                      </div>
                      <div style={{ fontSize: "0.55rem", opacity: 0.7, color: "var(--red)", marginTop: "4px" }}>
                        Clues collected: armor, battle, rations, drills, boots, metal, march. Location matches.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

              </div>

            {/* Step 14: Clues collapse into Locked phrase / Blinking cursor black view */}
            {currentStep === 14 && (
              <div className="step-14-stage">
                <div className="locked-phrase-silhouette-container" style={{ opacity: 0 }}>
                  <div className="silhouette-lock-icon">
                    <Lock size={20} />
                    <span>LOCKED PHRASE</span>
                  </div>
                  <div className="locked-phrase-silhouette">
                    {"CRUSADER ARMY".split("").map((char, index) => {
                      if (char === " ") {
                        return <div key={index} className="locked-char-block space-block" />;
                      }
                      return (
                        <div key={index} className="locked-char-block" style={{ color: "transparent" }}>
                          {char}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="blinking-cursor-container" style={{ textAlign: "center", color: "var(--teal)", opacity: 0 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", letterSpacing: "1px" }}>
                    <span>reconstructing_location...</span>
                    <span className="terminal-cursor" />
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#666", marginTop: "10px" }}>
                    evidence_chain compiled successfully.
                  </div>
                </div>
              </div>
            )}

            {/* Step 15: Visor Reel Guess Crusader Army */}
            {currentStep === 15 && (
              <div className="slot-reel-container">
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--red)", letterSpacing: "2px" }}>
                  SPY DEDUCTION INTERFACE
                </div>
                <div className="slot-reel-window">
                  <div className="slot-reel-strip">
                    <div className="slot-reel-item">Military Base</div>
                    <div className="slot-reel-item">World War II Squad</div>
                    <div className="slot-reel-item">Pirate Ship</div>
                    <div className="slot-reel-item" style={{ color: "white" }}>CRUSADER ARMY</div>
                    <div className="slot-reel-item">Theater</div>
                  </div>
                </div>
                
                <div className="red-stamp-confirmation">
                  SPY GUESS: CRUSADER ARMY
                </div>
              </div>
            )}

            {/* Step 17: Forensic leak chain cards */}
            {currentStep === 17 && (
              <div className="victory-forensic-card">
                <div className="forensic-title">Forensic Leak Analysis</div>
                <p style={{ fontSize: "0.85rem", color: "#999", lineHeight: "1.4" }}>
                  The Civilians answered questions too literally. Instead of vague hints, they leaked concrete military items that the Spy combined into a winning guess:
                </p>
                <div className="forensic-chain">
                  <span className="forensic-chain-item forensic-pulse-item">armor</span>
                  <span style={{ color: "#666" }}>→</span>
                  <span className="forensic-chain-item forensic-pulse-item">battle</span>
                  <span style={{ color: "#666" }}>→</span>
                  <span className="forensic-chain-item forensic-pulse-item">rations</span>
                  <span style={{ color: "#666" }}>→</span>
                  <span className="forensic-chain-item forensic-pulse-item">drills</span>
                  <span style={{ color: "#666" }}>→</span>
                  <span className="forensic-chain-item forensic-pulse-item">boots</span>
                  <span style={{ color: "#666" }}>→</span>
                  <span className="forensic-chain-item forensic-pulse-item">march</span>
                  <span style={{ color: "#666" }}>→</span>
                  <span className="forensic-chain-item final-loc">CRUSADER ARMY</span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "0.75rem", color: "var(--red)", background: "rgba(244,67,54,0.1)", padding: "8px", borderRadius: "4px" }}>
                  <AlertTriangle size={14} />
                  <span>The Spy decoded the location perfectly with 0 Civilian suspect votes called.</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================
            ACT V: AFTERMATH AND FORENSIC LOG (STEPS 18 - 20)
            ======================================================== */}
        {currentStep >= 18 && (
          <div className="arena-table-container">
            {/* Step 18 & 19: Report Card fold and button rise */}
            {(currentStep === 18 || currentStep === 19) && (
              <div className="report-card-container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: "700" }}>
                    Spyfall Arena Summary Report
                  </h3>
                  <Award size={20} style={{ color: "var(--cobalt)" }} />
                </div>
                
                <div className="report-section">
                  <div className="report-section-title">Rules Strategy</div>
                  <div className="report-section-body">
                    Civilians must prove knowledge without naming the secret location. The Spy must stay hidden and compile clues from their conversation to guess the place.
                  </div>
                </div>

                <div className="report-section">
                  <div className="report-section-title">AI Failure Point</div>
                  <div className="report-section-body" style={{ borderLeft: "2px solid var(--red)", paddingLeft: "10px" }}>
                    LLM Civilians failed at bluffing and secrecy. They were too helpful, leaking concrete nouns (armor, rations, drills) that the Spy immediately mapped to "Crusader Army".
                  </div>
                </div>

                <div className="report-section">
                  <div className="report-section-title">Round Result</div>
                  <div className="report-section-body" style={{ color: "var(--red)", fontWeight: "600" }}>
                    Opus 4.7 max (SPY) correctly guessed CRUSADER ARMY and won.
                  </div>
                </div>

                {/* Step 19 CTA button and log fan card decoration */}
                {currentStep === 19 && (
                  <>
                    <button className="action-cta-button" onClick={handleNextStep}>
                      Inspect the Transcripts <ChevronRight size={16} style={{ display: "inline", verticalAlign: "middle", marginLeft: "4px" }} />
                    </button>
                    
                    {/* Background decorations logs fanned out */}
                    <div className="json-log-fan-card" style={{ position: "absolute", zIndex: -1 }}>
                      <div className="cover-terminal-log" style={{ opacity: 0.1 }}>
                        <code>{`{"turns": 3, "winner": "spy", "clues": ["armor", "drills", "march"]}`}</code>
                      </div>
                      <div className="cover-terminal-log" style={{ opacity: 0.15, marginTop: "10px" }}>
                        <code>{`{"round_score": {"civilians": 0, "spy": 10}, "success": true}`}</code>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 20: Final transition portal logs row list */}
            {currentStep === 20 && (
              <div className="portal-log-view">
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "bold" }}>SYSTEM METRIC LOGS</span>
                  <span style={{ color: "var(--teal)" }}>● LIVE</span>
                </div>
                
                <div className="portal-log-row">
                  <span className="portal-log-time">[03:42:01]</span>
                  <span className="portal-log-tag">[INIT]</span>
                  <span className="portal-log-desc">Round started. Location synchronized.</span>
                </div>
                <div className="portal-log-row">
                  <span className="portal-log-time">[03:42:05]</span>
                  <span className="portal-log-tag">[SYNC]</span>
                  <span className="portal-log-desc">Civilians verified location. Spy visor active.</span>
                </div>
                <div className="portal-log-row">
                  <span className="portal-log-time">[03:42:15]</span>
                  <span className="portal-log-tag">[LEAK]</span>
                  <span className="portal-log-desc">GPT-5.5 xhigh leaked: <mark>armor</mark> / <mark>battle</mark>.</span>
                </div>
                <div className="portal-log-row">
                  <span className="portal-log-time">[03:42:24]</span>
                  <span className="portal-log-tag">[LEAK]</span>
                  <span className="portal-log-desc">Gemini 3.1 pro high leaked: <mark>rations</mark> / <mark>drills</mark>.</span>
                </div>
                <div className="portal-log-row">
                  <span className="portal-log-time">[03:42:36]</span>
                  <span className="portal-log-tag">[LEAK]</span>
                  <span className="portal-log-desc">DeepSeek V4 pro max leaked: <mark>boots</mark> / <mark>march</mark>.</span>
                </div>
                <div className="portal-log-row" style={{ color: "var(--red)" }}>
                  <span className="portal-log-time">[03:42:45]</span>
                  <span className="portal-log-tag">[GUESS]</span>
                  <span className="portal-log-desc">Opus 4.7 max guessed <mark className="spy">CRUSADER ARMY</mark>. Match 100%.</span>
                </div>
                <div className="portal-log-row" style={{ color: "var(--red)", borderBottom: "none" }}>
                  <span className="portal-log-time">[03:42:47]</span>
                  <span className="portal-log-tag">[END]</span>
                  <span className="portal-log-desc">Spy Victory. Simulation finished.</span>
                </div>

                <div style={{ marginTop: "16px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "white" }}>
                    Spyfall Arena: The AI Who Couldn't Lie
                  </h4>
                  <p style={{ fontSize: "0.7rem", color: "#666", marginTop: "4px" }}>
                    Press the dots at the top to review the storyboard beats again.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Navigation Next Step FAB (Bottom Right) */}
        {currentStep < steps.length - 1 && (
          <div className="next-step-fab-container">
            {/* Circular SVG Progress Ring */}
            <svg className="fab-progress-svg">
              <circle 
                className="fab-progress-circle-bg" 
                cx="40" cy="40" r={radius} 
              />
              <circle 
                className="fab-progress-circle-fill" 
                cx="40" cy="40" r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            <button 
              className="next-step-fab"
              ref={fabRef}
              onClick={handleNextStep}
              onMouseEnter={() => setIsFabHovered(true)}
              onMouseLeave={() => setIsFabHovered(false)}
              aria-label="Next step"
            >
              <ArrowRight 
                className="fab-arrow-icon"
                style={{ 
                  transform: isFabHovered 
                    ? `rotate(${currentStep * 20 + 20}deg) scale(1.15)` 
                    : `rotate(${currentStep * 20}deg)` 
                }} 
              />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
