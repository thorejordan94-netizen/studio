"use client";

import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

interface ContentAreaProps {
  onMarkerAdd: (marker: { text: string; elementId: string }) => void;
}

export interface ContentAreaHandle {
  highlightElement: (elementId: string) => void;
}

export const ContentArea = forwardRef<ContentAreaHandle, ContentAreaProps>(({ onMarkerAdd }, ref) => {
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const heroImage = placeholderImages.find(p => p.id === "hero");

  useEffect(() => {
    const handleCtrlClick = (event: MouseEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;

      const target = event.target as HTMLElement;
      const markerElement = target.closest('[data-marker-id]');

      if (markerElement) {
        event.preventDefault();
        const text = (markerElement as HTMLElement).innerText;
        const elementId = markerElement.getAttribute('data-marker-id');
        if (text && elementId) {
          onMarkerAdd({ text, elementId });
          toast({
            title: "Marker Created",
            description: `Added: "${text.substring(0, 30)}..."`,
          });

          // Visual feedback for marker creation
          const markerIndicator = document.createElement('div');
          markerIndicator.className = 'absolute pointer-events-none w-8 h-8 rounded-full border-2 border-primary bg-primary/20 scale-50 opacity-0';
          markerIndicator.style.left = `${event.clientX}px`;
          markerIndicator.style.top = `${event.clientY}px`;
          markerIndicator.style.transform = 'translate(-50%, -50%)';
          markerIndicator.style.transition = 'all 300ms ease-out';
          document.body.appendChild(markerIndicator);

          requestAnimationFrame(() => {
            markerIndicator.style.transform = 'translate(-50%, -50%) scale(1)';
            markerIndicator.style.opacity = '1';
          });
          
          setTimeout(() => {
            markerIndicator.style.opacity = '0';
            setTimeout(() => document.body.removeChild(markerIndicator), 300);
          }, 300);
        }
      }
    };

    const container = contentRef.current;
    if (container) {
      container.addEventListener('click', handleCtrlClick);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handleCtrlClick);
      }
    };
  }, [onMarkerAdd, toast]);

  useImperativeHandle(ref, () => ({
    highlightElement(elementId: string) {
      const element = document.querySelector(`[data-marker-id="${elementId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlighted');
        setTimeout(() => {
          element.classList.remove('highlighted');
        }, 2000);
      }
    },
  }));
  
  const renderTextWithMarkers = (text: string, idPrefix: string) => {
    return text.split('\n\n').map((paragraph, pIndex) => (
      <p key={pIndex} data-marker-id={`${idPrefix}-${pIndex}`} className="mb-6 leading-relaxed cursor-pointer hover:bg-primary/5 transition-colors rounded-md p-2">
        {paragraph}
      </p>
    ));
  };


  return (
    <div ref={contentRef} className="container mx-auto px-4 py-12 md:px-8 lg:px-16">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground mb-4">The Digital Renaissance</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Exploring the frontiers of web technology and artificial intelligence.</p>
        <div className="mt-6 text-sm text-accent-foreground/80 bg-accent/20 rounded-full px-4 py-2 inline-block border border-accent/30">
          <span className="font-bold">Pro Tip:</span> Hold <kbd className="px-2 py-1.5 text-xs font-semibold text-foreground bg-background border rounded-md">CTRL</kbd> or <kbd className="px-2 py-1.5 text-xs font-semibold text-foreground bg-background border rounded-md">CMD</kbd> and click any paragraph to create a marker.
        </div>
      </header>

      <article className="prose prose-lg max-w-none text-foreground">
        <h2 className="font-headline text-3xl mb-4" data-marker-id="intro-heading">Introduction: A New Era of Interaction</h2>
        {renderTextWithMarkers(
          "We stand at the precipice of a significant transformation in how we interact with digital information. The static, read-only web of the past is rapidly evolving into a dynamic, intelligent, and personalized landscape. This shift is primarily driven by advancements in artificial intelligence and machine learning, which are no longer confined to research labs but are now integral components of the applications we use daily.",
          "intro"
        )}

        {heroImage && (
            <div className="my-12 rounded-lg overflow-hidden shadow-xl" data-marker-id="hero-image-container">
                <Image 
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    width={800}
                    height={400}
                    className="w-full h-auto object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
            </div>
        )}

        <h2 className="font-headline text-3xl mb-4" data-marker-id="semantic-heading">The Power of Semantic Understanding</h2>
        {renderTextWithMarkers(
          "At the core of this revolution is the concept of semantic understanding. AI models, particularly large language models (LLMs), are now capable of interpreting the context and meaning behind text, images, and data. This allows for more than just keyword matching; it enables applications to understand user intent, summarize complex topics, and even generate new, relevant content. For tools like Webmarker, this means we can move beyond simple bookmarking to create intelligent, contextual groupings of information that reflect a user's research journey.",
          "semantic"
        )}

        <h2 className="font-headline text-3xl mb-4" data-marker-id="future-heading">Building the Future, One Marker at a Time</h2>
        {renderTextWithMarkers(
          "The ability to place markers on any piece of text and have an AI assistant automatically categorize them is a simple yet profound concept. It transforms passive consumption of content into an active process of knowledge construction. Each marker becomes a building block in a larger structure of understanding, curated and organized by a personal AI. This is not just about finding information again; it's about discovering new connections and insights within the information you've already gathered.",
          "future"
        )}
        
        <blockquote data-marker-id="quote-1" className="border-l-4 border-primary pl-4 italic text-muted-foreground my-8">
          "The best way to predict the future is to invent it. By creating tools that enhance our cognitive abilities, we are actively shaping the future of human-computer interaction."
        </blockquote>

        {renderTextWithMarkers(
          "As we continue to develop these technologies, the line between the user and the application will blur. The software will become a true partner, anticipating needs and offering assistance in a way that feels natural and intuitive. The journey is just beginning, and with each marker placed, we take another step into this exciting future.",
          "conclusion"
        )}
      </article>
    </div>
  );
});
ContentArea.displayName = "ContentArea";
