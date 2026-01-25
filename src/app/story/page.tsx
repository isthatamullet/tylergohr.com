'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';

// Beat type definitions for V2
type BeatLine = {
  text: string;
  timing?: number; // Override per-word timing (ms)
  scale?: number; // CSS scale transform
  pauseAfter?: boolean; // Requires click to continue
  centered?: boolean; // Center this line
  delayBefore?: number; // Delay before this line starts (ms)
  delayAfterLine?: number; // Delay after this line's last word (ms)
};

type Beat = {
  lines: (string | BeatLine)[];
  centered?: boolean; // Center entire beat
  ownSlide?: boolean; // This is a standalone click-reveal slide
  hasMusicalNotes?: boolean; // Add floating musical notes animation
};

// V2 Script - 48 beats with all revisions
const beats: Beat[] = [
  // SLIDE 0: THE HOOK (centered)
  {
    centered: true,
    lines: [
      "16 years of fixing content operations that couldn't scale.",
      "It keeps getting bigger. So do I.",
      "Here's how."
    ]
  },

  // CHAPTER 1: FUEL TV (2008-2011) - Condensed to 5 beats

  // Beat 1: The Setup
  { lines: ["It's 2008. New Media department. No playbook."] },

  // Beat 2: Flash Joke (Split for comedic timing)
  { lines: [
    { text: "We delivered in Flash.", pauseAfter: true },
  ]},
  // Beat 2b: Click reveal
  { ownSlide: true, lines: ["Yep."] },

  // Beat 3: Proof
  { lines: [
    "Built 7 podcast channels. Discovered a timing trick for live sports streaming.",
    "Management was impressed. Now it's mandatory forever."
  ]},

  // Beat 4: The Skill
  { lines: [
    "I learned to figure out things nobody taught me.",
    "Turns out, that's a skill people pay for."
  ]},

  // Beat 5: Transition
  { lines: [
    "📞",
    "Hello, Tyler? It's Warner Bros."
  ]},

  // CHAPTER 2: WARNER BROS (2012-2014) - 10 beats

  // Beat 6: The Call
  { lines: ["We have a problem..."] },

  // Beat 7: The Problem
  { lines: [
    "iTunes is rejecting 68% of our film deliveries.",
    "We sent Castilian Spanish audio for Corpse Bride to Watchmen."
  ]},

  // Beat 8: The Fix
  { lines: [
    "Every delivery had hundreds of ways to fail. I learned them all."
  ]},

  // Beat 9: iTunes Whisperer
  { lines: [
    "Within a month, I became the iTunes Whisperer.",
    "32% acceptance became 96%. While tripling the volume.",
    "The rejection emails stopped."
  ]},

  // Beat 10: Peter Jackson Setup
  { lines: [
    "📧",
    "Peter Jackson's team needs chapter updates.",
    "All three extended editions. Due tonight."
  ]},

  // Beat 11: The Challenge
  { lines: [
    "194 chapters. Multiple languages. Frame-specific timecodes.",
    "Our tool only handled one language at a time."
  ]},

  // Beat 12: The Sorcery (Expanded)
  { lines: [
    { text: "I went \"hmmm... alright, here's my plan.\"", pauseAfter: true },
    "Then..."
  ]},
  // Beat 12b: Click reveal - own slide
  { ownSlide: true, lines: [
    "I started jamming text files together.",
    "Different formats. Different structures."
  ]},

  // Beat 13: The Result
  { lines: [
    "After a few tries... perfect XML.",
    "Apple accepted it. Pete smiled."
  ]},

  // Beat 14: Recognition
  { lines: [
    "Got an award.",
    "Apple's head of content partnerships had me on speed dial.",
    "When iTunes launched eBooks, I built that operation too. From scratch. Again."
  ]},

  // Beat 15: Transition
  { lines: [
    "📞",
    "Hello, iTunes guy? This is SDI Media."
  ]},

  // CHAPTER 3: SDI MEDIA (2016) - 6 beats

  // Beat 16: The Scale
  { lines: [
    "20+ languages. Hundreds of files a day.",
    "Dozens of points of failure."
  ]},

  // Beat 17: The Languages (⭐ ESCALATING EFFECT - grows but leaves room for punchline)
  { lines: [
    { text: "French. German. Italian. Spanish...", timing: 400, scale: 1 },
    { text: "Portuguese. Dutch. Danish. Finnish. Norwegian. Swedish...", timing: 200, scale: 1.5 },
    { text: "Polish. Romanian. Russian. Turkish...", timing: 100, scale: 2.5 },
    { text: "MANDARIN. JAPANESE. KOREAN. ARABIC. PERSIAN...", timing: 50, scale: 4 },
  ]},
  // Beat 17b: Punchline on its own slide (so it's not covered)
  { ownSlide: true, lines: [
    { text: "You get the idea.", timing: 190 },
  ]},

  // Beat 18: The Template
  { lines: [
    "Somewhere in there, I designed a simple template.",
    "Foreign language dub credits.",
    "The screens listing every voice actor."
  ]},

  // Beat 19: The Legacy
  { lines: [
    "I built that in 2016.",
    "It's still used today."
  ]},

  // Beat 20: The Lesson
  { lines: ["Some things outlast the job."] },

  // Beat 21: Transition
  { lines: [
    "📞",
    { text: "Hello, Tyler? It's Fox. What's your favorite Beethoven symphony?", pauseAfter: true },
  ]},
  // Beat 21b: Click reveal - Eroica answer
  { ownSlide: true, centered: true, lines: [
    "The most important piece of music ever written, of course.",
    "Number 3. Eroica."
  ]},
  // Beat 21c: Click reveal - You're hired
  { ownSlide: true, centered: true, lines: ["You're hired!"] },

  // CHAPTER 4: FOX CORPORATION (2017-2022) - 16 beats

  // Beat 22: Scale (with musical notes callback to symphony question)
  {
    hasMusicalNotes: true,
    lines: [
      "Fox was a different scale.",
      "70,000 titles. 250,000 assets."
    ]
  },

  // Beat 23: Library Project
  { lines: [
    "First up: the library project.",
    "15,000 titles. Every movie. Every episode Fox owned.",
    "I trained the team. Led the QC."
  ]},

  // Beat 24: Caption Fix
  { lines: [
    "Along the way, noticed we were bleeding money on captions.",
    "Bought some software, trained some pros, brought it in-house."
  ]},

  // Beat 25: Savings (own slide for impact)
  { ownSlide: true, lines: ["Saved $1.5 million in six months."] },

  // Beat 26: Ad Breaks
  { lines: [
    "Built a tool to detect ad breaks automatically.",
    "10,000 episodes. Hours of work per file became five minutes."
  ]},

  // Beat 27: Ready
  { lines: ["We had 15,000 titles ready to launch."] },

  // Beat 28: Disney (Dramatic split)
  { lines: [
    { text: "Then...", pauseAfter: true },
  ]},
  // Beat 28b: Click reveal
  { ownSlide: true, lines: ["Disney happened."] },

  // Beat 29: Pivot
  { lines: [
    "Fox pivoted to live content.",
    "Good thing I knew how to build for live."
  ]},

  // Beat 30: World Cup
  { lines: [
    "2018 FIFA World Cup.",
    "Over a billion minutes streamed.",
    "I built the CMS from scratch. Live. VOD. Every device. Every app."
  ]},

  // Beat 31: Emmy Fake-Out
  { lines: [
    { text: "It didn't work.", pauseAfter: true },
  ]},
  // Beat 31b: Click reveal
  { ownSlide: true, lines: [
    "Just kidding - we won an Emmy for Outstanding Trans-Media Sports Coverage.",
    "My name's on my trophy."
  ]},

  // Beat 32: Not Done
  { lines: ["But I wasn't done."] },

  // Beat 33: Fox Nation
  { lines: [
    "Fox Nation needed a CMS. Built it.",
    "100 episodes ready on launch day."
  ]},

  // Beat 34: Distribution Platform
  { lines: [
    "Then, I got to help Fox build a new content distribution platform.",
    "From scratch. Teams across 10 countries."
  ]},

  // Beat 35: Fox Weather + You're Welcome (own slide, centered, with 2s pause)
  { ownSlide: true, centered: true, lines: [
    { text: "Launched Fox Weather.", delayAfterLine: 2000 },
    "You're welcome!"
  ]},

  // Beat 36: Building How to Build
  { lines: [
    { text: "I wasn't just building platforms anymore.", pauseAfter: true },
  ]},
  // Beat 36b: Click reveal
  { ownSlide: true, lines: ["I was building HOW to build."] },

  // Beat 37: The Pattern (Confident reframe)
  { lines: [
    "Every company had the same problem.",
    { text: "Content operations that COULD scale...", pauseAfter: true },
  ]},
  // Beat 37b: Click reveal
  { ownSlide: true, lines: ["...but needed me to fix it."] },

  // CHAPTER 5: THE FUTURE - 8 beats

  // Beat 38: New Media Redux
  { lines: [
    "In 2008, they called it \"New Media.\"",
    { text: "Nobody knew the rules yet.", pauseAfter: true },
  ]},
  // Beat 38b: Click reveal
  { ownSlide: true, lines: ["I figured them out anyway."] },

  // Beat 39: Happening Again
  { lines: ["Now it's happening again."] },

  // Beat 40: AI (Deliberate pacing)
  { lines: [
    "AI is changing everything about content.",
    { text: "How we create it.", timing: 400 },
    { text: "How we scale it.", timing: 400 },
    { text: "How we deliver it.", timing: 400 },
  ]},

  // Beat 41: Watching (setup)
  { lines: ["Most people are watching."] },

  // Beat 42: Building (own slide - THE thesis, centered)
  { ownSlide: true, centered: true, lines: ["I'm building."] },

  // Beat 43: FactSpark (Concrete proof)
  { lines: [
    "Built FactSpark.io from scratch.",
    "An AI-powered news analysis pipeline.",
    "170 articles analyzed. Live. Anyone can read it."
  ]},

  // Beat 44: Same Pattern
  { lines: [
    "For years, I've been the person who figured out the new platforms.",
    "Now I'm the person who figures out AI.",
    "Same pattern. Bigger tools."
  ]},

  // Beat 45: Been Here Before
  { lines: [
    "Content operations is changing.",
    "I've been here before."
  ]},

  // CLOSING - 2 beats

  // Beat 46: Browser Tabs Callback
  { lines: [
    "A million browser tabs later...",
    "Half those platforms from earlier are dead."
  ]},

  // Beat 47: The Best Part (Click to reveal finale, centered)
  { lines: [
    { text: "Figuring things out is still mandatory.", pauseAfter: true },
  ]},
  // Beat 47b: Click reveal - final punchline (slow, dramatic timing)
  { ownSlide: true, centered: true, lines: [
    { text: "That's the best part.", timing: 1000 }
  ]},
];

// Helper to convert a line into word fragments with timing support
function lineToFragments(
  line: string | BeatLine,
  isLastLine: boolean,
  beatIndex: number,
  lineIndex: number
): React.ReactNode[] {
  const lineData = typeof line === 'string' ? { text: line } : line;
  const words = lineData.text.split(' ');
  const wordTiming = lineData.timing || 190; // Default 190ms per word
  const scale = lineData.scale || 1;
  const pauseAfter = lineData.pauseAfter || false;
  const delayBefore = lineData.delayBefore || 0;
  const delayAfterLine = lineData.delayAfterLine || 0;

  return words.map((word, wordIndex) => {
    const isLastWord = wordIndex === words.length - 1;
    const isFirstWord = wordIndex === 0;
    // Stop auto-advance if: last word of beat OR pauseAfter is true
    const shouldStop = (isLastLine && isLastWord) || (isLastWord && pauseAfter);

    // Determine timing for this word
    let timing = wordTiming;
    if (isFirstWord && delayBefore > 0) {
      timing = delayBefore;
    } else if (isLastWord && delayAfterLine > 0 && !isLastLine) {
      // Last word of this line (but not last line of beat) - add delay before next line
      timing = delayAfterLine;
    }

    const style: React.CSSProperties = {};
    if (scale !== 1) {
      style.display = 'inline-block';
      style.transform = `scale(${scale})`;
      style.transformOrigin = 'left center';
    }

    return (
      <span
        key={`${beatIndex}-${lineIndex}-${wordIndex}`}
        className="fragment fade-in"
        data-autoslide={shouldStop ? "0" : String(timing)}
        style={style}
      >
        {word}{' '}
      </span>
    );
  });
}

export default function StoryPage() {
  const deckRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const revealRef = useRef<any>(null);

  useEffect(() => {
    async function initReveal() {
      // Dynamically import Reveal.js (needs window)
      const Reveal = (await import('reveal.js')).default;

      if (deckRef.current && !revealRef.current) {
        const deck = new Reveal(deckRef.current, {
          // Display and Layout
          width: '100%',
          height: '100%',
          margin: 0.05,
          center: true,

          // Navigation and Controls
          controls: true,
          controlsLayout: 'bottom-right',
          progress: true,
          hash: true,
          touch: true,
          keyboard: true,

          // Fragments
          fragments: true,
          fragmentInURL: false, // Don't track fragments in URL

          // Auto-Slide (190ms baseline - overridden per-fragment)
          autoSlide: 190,
          autoSlideStoppable: true,

          // Transitions
          transition: 'none',
          backgroundTransition: 'none',

          // Disable features we don't need
          overview: false,
          help: false,
        });

        await deck.initialize();
        revealRef.current = deck;

        // Override arrow keys to jump slides instead of fragments
        document.addEventListener('keydown', (e) => {
          if (!revealRef.current) return;

          // Arrow keys: jump to prev/next slide (skip fragments)
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            revealRef.current.prev();
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            revealRef.current.next();
          }
        });
      }
    }

    initReveal();

    return () => {
      if (revealRef.current) {
        revealRef.current.destroy();
        revealRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* Hide the site navigation on story page */
        nav, header, .navigation, .skip-nav, #accessibility-announcements {
          display: none !important;
        }

        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #000;
        }

        .reveal-viewport {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          height: 100dvh;
          width: 100vw;
          z-index: 9999;
        }

        .reveal {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .reveal .slides section {
          text-align: left;
          padding: 5vh 5vw;
          font-size: clamp(0.9rem, 2.5vw, 1.4rem);
          line-height: 1.5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reveal .slides section.centered-beat {
          text-align: center;
        }

        .reveal .slides section .beat-content {
          max-width: min(90vw, 700px);
          max-height: 80vh;
          overflow-y: auto;
        }

        .reveal .slides section .beat-line {
          display: block;
          margin-bottom: 0.4em;
        }

        .reveal .fragment.fade-in {
          opacity: 0;
          transition: opacity 0.15s ease-in;
        }

        .reveal .fragment.fade-in.visible {
          opacity: 1;
        }

        /* Emoji styling for phone/email animations */
        .reveal .slides section .beat-line:first-child .fragment:first-child {
          font-size: 1.3em;
        }

        /* Escalating effect - scale transforms handled inline */
        .reveal .slides section .beat-line .fragment[style*="scale"] {
          white-space: nowrap;
        }

        /* Own-slide beats get slightly larger text for impact */
        .reveal .slides section.own-slide .beat-content {
          font-size: 1.1em;
        }

        /* Musical notes animation for Fox scale slide */
        .musical-notes {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .musical-note {
          position: absolute;
          font-size: 2rem;
          opacity: 0.3;
          animation: floatNote 4s ease-in-out infinite;
        }

        .musical-note:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; }
        .musical-note:nth-child(2) { left: 85%; top: 15%; animation-delay: 0.5s; }
        .musical-note:nth-child(3) { left: 15%; top: 70%; animation-delay: 1s; }
        .musical-note:nth-child(4) { left: 80%; top: 75%; animation-delay: 1.5s; }
        .musical-note:nth-child(5) { left: 50%; top: 10%; animation-delay: 2s; }
        .musical-note:nth-child(6) { left: 45%; top: 85%; animation-delay: 2.5s; }

        @keyframes floatNote {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-15px) rotate(10deg); opacity: 0.5; }
        }

        /* iPad and tablets */
        @media (max-width: 1024px) {
          .reveal .slides section {
            font-size: clamp(0.85rem, 2.2vw, 1.2rem);
            padding: 4vh 4vw;
          }
        }

        /* Mobile phones */
        @media (max-width: 480px) {
          .reveal .slides section {
            font-size: clamp(0.8rem, 4vw, 1rem);
            padding: 3vh 3vw;
            line-height: 1.4;
          }
          .reveal .slides section .beat-line {
            margin-bottom: 0.3em;
          }
        }

        /* Progress bar styling */
        .reveal .progress {
          height: 4px;
          color: #42affa;
        }

        /* Controls styling */
        .reveal .controls {
          color: #42affa;
        }
      `}</style>

      <div className="reveal-viewport">
        <div className="reveal" ref={deckRef}>
          <div className="slides">
            {/* Title slide */}
            <section>
              <div className="beat-content" style={{ textAlign: 'center' }}>
                <h1 className="fragment fade-in" data-autoslide="0">Tyler Gohr</h1>
              </div>
            </section>

            {/* All V2 beats */}
            {beats.map((beat, beatIndex) => {
              const sectionClasses = [
                beat.centered ? 'centered-beat' : '',
                beat.ownSlide ? 'own-slide' : '',
              ].filter(Boolean).join(' ');

              return (
                <section key={beatIndex} className={sectionClasses || undefined}>
                  {/* Musical notes animation for Fox scale slide */}
                  {beat.hasMusicalNotes && (
                    <div className="musical-notes">
                      <span className="musical-note">🎵</span>
                      <span className="musical-note">🎶</span>
                      <span className="musical-note">🎵</span>
                      <span className="musical-note">🎶</span>
                      <span className="musical-note">🎵</span>
                      <span className="musical-note">🎶</span>
                    </div>
                  )}
                  <div className="beat-content" style={beat.centered ? { textAlign: 'center' } : undefined}>
                    {beat.lines.map((line, lineIndex) => {
                      const isLastLine = lineIndex === beat.lines.length - 1;
                      return (
                        <span key={lineIndex} className="beat-line">
                          {lineToFragments(line, isLastLine, beatIndex, lineIndex)}
                        </span>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* End slide */}
            <section>
              <div className="beat-content" style={{ textAlign: 'center' }}>
                <span className="fragment fade-in" data-autoslide="0">
                  <Link href="/" style={{ color: '#42affa', textDecoration: 'none' }}>
                    → tylergohr.com
                  </Link>
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
