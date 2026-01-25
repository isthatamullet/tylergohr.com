'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';

// Beat data - all 49 beats from the script
const beats = [
  // CHAPTER 1: FUEL TV (2008-2011)
  // Beat 1: The Setup
  ["It's 2008.", "I'm staring at 47 browser tabs.", "MySpace. Facebook. YouTube. iTunes.", "All with different specs. Different formats. Different rules."],
  // Beat 2: Flash Joke
  ["We delivered in Flash.", "Yep."],
  // Beat 3: New Media
  ["My department was called \"New Media.\"", "Now it's just called media.", "No playbook. No training. Just \"figure it out.\""],
  // Beat 4: The Turn
  ["So I did."],
  // Beat 5: Proof
  ["Built 7 podcast channels from scratch.", "Discovered a timing trick no one knew existed.", "We could publish live sports clips within minutes.", "Management was impressed."],
  // Beat 6: Mandatory Forever
  ["Now it's mandatory forever."],
  // Beat 7: Skills Earned
  ["I learned to speak every platform's language.", "Got really good at figuring out things nobody taught me.", "Turns out, that's a skill people pay for."],
  // Beat 8: Transition
  ["📞", "Hey, it's Warner Bros."],

  // CHAPTER 2: WARNER BROS (2012-2014)
  // Beat 9: The Problem
  ["Warner Bros had a problem.", "iTunes was rejecting 68% of their film deliveries."],
  // Beat 10: The Chaos
  ["Castilian Spanish audio for Corpse Bride got sent to Watchmen.", "That kind of chaos."],
  // Beat 11: The Cause
  ["Wrong title casing for any of 25+ languages? You're out.", "I learned every spec. Every format. Every edge case."],
  // Beat 12: iTunes Whisperer
  ["Within a month, I became the iTunes Whisperer.", "32% acceptance became 96%. While tripling the volume.", "The rejection emails stopped."],
  // Beat 13: Peter Jackson
  ["📧", "Peter Jackson's team needs chapter updates.", "All three extended editions. Due tonight."],
  // Beat 14: The Challenge
  ["194 chapters. Multiple languages. Frame-specific timecodes.", "Personally approved by Pete.", "It landed on my desk."],
  // Beat 15: Sorcery
  ["I went \"hmmm... alright, here's my plan.\"", "Then I began my sorcery."],
  // Beat 16: Delivered
  ["They got it on time."],
  // Beat 17: Recognition
  ["Got an award.", "Apple's head of content partnerships had me on speed dial.", "When iTunes launched eBooks, I built that operation too. From scratch. Again."],
  // Beat 18: Transition
  ["📞", "SDI Media came looking for the iTunes guy.", "They found me."],

  // CHAPTER 3: SDI MEDIA (2016)
  // Beat 19: Different Scale
  ["SDI wanted the iTunes guy. But this was different.", "20+ languages. Global distribution.", "Hundreds of files a day, dragged and dropped by hand."],
  // Beat 20: Netflix API
  ["Until Netflix opened their API.", "I helped build the platform that replaced the drag-and-drop.", "Then automated our Apple deliveries too."],
  // Beat 21: The Template
  ["And somewhere in there, I designed a simple template.", "The foreign language dub credits.", "Those screens at the very end listing every voice actor."],
  // Beat 22: Language List
  ["French. German. Italian. Spanish. Portuguese. Dutch. Danish. Finnish. Norwegian. Swedish. Polish. Romanian. Russian. Turkish. Mandarin. Japanese. Korean. Arabic. Persian...", "You get the idea."],
  // Beat 23: Still Used Today
  ["I built that layout in 2016.", "It's still being used on new releases today."],
  // Beat 24: Outlast
  ["Some things outlast the job."],
  // Beat 25: Transition
  ["📞", "Fox came calling."],

  // CHAPTER 4: FOX CORPORATION (2017-2022)
  // Beat 26: Scale
  ["Fox was a different scale.", "70,000 titles. 250,000 assets."],
  // Beat 27: Library Project
  ["First up: the library project.", "15,000 titles. Every movie. Every episode Fox owned.", "I trained the team. Led the QC."],
  // Beat 28: Caption Fix
  ["Along the way, noticed we were bleeding money on captions.", "Bought some software, trained some pros, brought it in-house."],
  // Beat 29: Savings
  ["Saved $1.5 million in six months."],
  // Beat 30: Ad Breaks
  ["Built a tool to detect ad breaks automatically.", "10,000 episodes. Hours of work per file became five minutes."],
  // Beat 31: Ready to Launch
  ["We had 15,000 titles ready to launch."],
  // Beat 32: Disney
  ["Then Disney happened."],
  // Beat 33: Pivot to Live
  ["Fox pivoted to live content.", "Good thing I knew how to build for live."],
  // Beat 34: World Cup
  ["2018 FIFA World Cup.", "Over a billion minutes streamed.", "I built the CMS from scratch. Live. VOD. Every device. Every app."],
  // Beat 35: It Worked
  ["It worked."],
  // Beat 36: Emmy
  ["We won an Emmy.", "My name's on my trophy."],
  // Beat 37: Not Done
  ["But I wasn't done."],
  // Beat 38: Fox Nation + Weather
  ["Fox Nation needed a CMS. Built it.", "100 episodes ready on launch day.", "Then the new Fox content distribution platform.", "Team across 10 countries.", "Launched Fox Weather."],
  // Beat 39: Building How We Build
  ["I wasn't just building platforms anymore.", "I was building how we build."],
  // Beat 40: The Pattern
  ["Every company had the same problem.", "Content operations that couldn't scale.", "I knew how to fix it."],

  // CHAPTER 5: THE FUTURE
  // Beat 41: New Media Redux
  ["In 2008, they called it \"New Media.\"", "Nobody knew the rules yet.", "I figured them out anyway."],
  // Beat 42: Happening Again
  ["Now it's happening again."],
  // Beat 43: AI
  ["AI is changing everything about content.", "How we create it. How we scale it. How we deliver it."],
  // Beat 44: Watching vs Building
  ["Most people are watching."],
  // Beat 45: I'm Building
  ["I'm building.", "Built a content intelligence platform from scratch.", "AI-powered. Serving traffic."],
  // Beat 46: Same Pattern
  ["16 years ago, I was the person who figured out the new platforms.", "Now I'm the person who figures out AI.", "Same pattern. Bigger tools."],
  // Beat 47: Been Here Before
  ["Content operations is changing.", "I've been here before."],

  // CLOSING
  // Beat 48: Browser Tabs
  ["A million browser tabs later...", "Half those platforms are dead."],
  // Beat 49: The Best Part
  ["Figuring things out is still mandatory.", "That's the best part."],
];

// Helper to convert a line into word fragments
function lineToFragments(line: string, isLastLine: boolean): React.ReactNode[] {
  const words = line.split(' ');
  return words.map((word, wordIndex) => {
    const isLastWord = isLastLine && wordIndex === words.length - 1;
    return (
      <span
        key={wordIndex}
        className="fragment fade-in"
        data-autoslide={isLastWord ? "0" : undefined}
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

          // Auto-Slide (225ms per word fragment - balanced reading pace)
          autoSlide: 225,
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
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #000;
        }

        .reveal-viewport {
          height: 100vh;
          height: 100dvh;
          width: 100vw;
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

            {/* All 49 beats */}
            {beats.map((beat, beatIndex) => (
              <section key={beatIndex}>
                <div className="beat-content">
                  {beat.map((line, lineIndex) => {
                    const isLastLine = lineIndex === beat.length - 1;
                    return (
                      <span key={lineIndex} className="beat-line">
                        {lineToFragments(line, isLastLine)}
                      </span>
                    );
                  })}
                </div>
              </section>
            ))}

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
