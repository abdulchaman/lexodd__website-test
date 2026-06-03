import React from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion';

const viewport = { once: true, margin: '-100px' };

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 }
  }
};

export const FadeUp = ({ children, className = '', delay = 0, as = 'div', ...props }) => {
  const reducedMotion = useReducedMotion();
  const MotionComponent = motion[as] || motion.div;

  if (reducedMotion) {
    const Component = as;
    return <Component className={className} {...props}>{children}</Component>;
  }

  return (
    <MotionComponent
      className={className}
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ delay }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export const ScaleIn = ({ children, className = '', as = 'div', ...props }) => {
  const reducedMotion = useReducedMotion();
  const MotionComponent = motion[as] || motion.div;

  if (reducedMotion) {
    const Component = as;
    return <Component className={className} {...props}>{children}</Component>;
  }

  return (
    <MotionComponent
      className={className}
      variants={scaleInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export const StaggerGrid = ({ children, className = '', as = 'div', ...props }) => {
  const reducedMotion = useReducedMotion();
  const MotionComponent = motion[as] || motion.div;

  if (reducedMotion) {
    const Component = as;
    return <Component className={className} {...props}>{children}</Component>;
  }

  return (
    <MotionComponent
      className={className}
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export const HoverCard = ({ children, className = '', as = 'div', ...props }) => {
  const reducedMotion = useReducedMotion();
  const MotionComponent = motion[as] || motion.div;

  if (reducedMotion) {
    const Component = as;
    return <Component className={className} {...props}>{children}</Component>;
  }

  return (
    <MotionComponent
      className={className}
      variants={fadeUpVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export const TextReveal = ({ text, className = '', as = 'span', ...props }) => {
  const reducedMotion = useReducedMotion();
  const MotionComponent = motion[as] || motion.span;
  const words = String(text || '').split(' ').filter(Boolean);

  if (reducedMotion || words.length === 0) {
    const Component = as;
    return <Component className={className} {...props}>{text}</Component>;
  }

  return (
    <MotionComponent
      className={className}
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      aria-label={text}
      {...props}
    >
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          className="text-reveal-word"
          variants={fadeUpVariants}
          key={`${word}-${index}`}
        >
          {word}
          {index < words.length - 1 ? '\u00a0' : ''}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

export const ParallaxSection = ({ children, className = '', amount = 36, ...props }) => {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [amount * -1, amount]);

  if (reducedMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div className={className} style={{ y }} {...props}>
      {children}
    </motion.div>
  );
};

export const ScrollProgress = () => {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });

  if (reducedMotion) return null;

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
};

export const AnimatedCounter = ({ value, className = '' }) => {
  const reducedMotion = useReducedMotion();
  const ref = React.useRef(null);
  const inView = useInView(ref, viewport);
  const [displayValue, setDisplayValue] = React.useState(String(value ?? ''));
  const rawValue = String(value ?? '');
  const parsed = React.useMemo(() => {
    const match = rawValue.match(/^([^0-9-]*)(-?\d+(?:\.\d+)?)(.*)$/);
    if (!match) return null;
    return {
      prefix: match[1],
      number: Number(match[2]),
      suffix: match[3],
      decimals: match[2].includes('.') ? 1 : 0
    };
  }, [rawValue]);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 90, damping: 20 });

  React.useEffect(() => {
    if (reducedMotion || !parsed) {
      setDisplayValue(rawValue);
      return undefined;
    }

    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(`${parsed.prefix}${latest.toFixed(parsed.decimals)}${parsed.suffix}`);
    });

    if (inView) motionValue.set(parsed.number);
    return unsubscribe;
  }, [inView, motionValue, parsed, rawValue, reducedMotion, springValue]);

  return <span ref={ref} className={className}>{displayValue}</span>;
};
