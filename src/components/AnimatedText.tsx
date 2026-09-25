import { useRef, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

type CharProps = {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
};

function Char({ children, progress, range }: CharProps) {
  const opacity = useTransform(progress, range, [0.3, 1]);

  return (
    <span className="relative inline-block whitespace-pre">
      <span className="invisible">{children}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {children}
      </motion.span>
    </span>
  );
}

export type AnimatedTextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Character-by-character scroll reveal. Every character fades from 0.2 to 1
 * opacity based on how far it sits within the scroll progress of the paragraph.
 */
export default function AnimatedText({ text, className = '', style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  const characters = text.replace(/\s/g, '').length;
  let cursor = 0;

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`} style={style}>
      {words.map((word, wordIndex) => {
        const wordChars = Array.from(word);

        const node = (
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {wordChars.map((char, charIndex) => {
              const start = cursor / characters;
              const end = (cursor + 1) / characters;
              cursor += 1;
              return (
                <Char key={`${char}-${charIndex}`} progress={scrollYProgress} range={[start, end]}>
                  {char}
                </Char>
              );
            })}
          </span>
        );

        return wordIndex === words.length - 1 ? (
          node
        ) : (
          <span key={`wrap-${word}-${wordIndex}`} className="inline-block">
            {node}
            {'\u00A0'}
          </span>
        );
      })}
    </p>
  );
}
