# Animation Guide - Le Nguon Website

## Quick Start

To see all the animations in action:

```bash
npm install
npm run dev
```

Then open your browser and navigate through the website.

## Key Features

### 🎨 Visual Enhancements

1. **Scroll Progress Bar** - Gold gradient bar at the top showing scroll position
2. **Particle Background** - Animated particles in the hero section with connection lines
3. **Cursor Glow** - Subtle glow effect following the cursor
4. **Floating Action Buttons** - Quick access to contact and scroll-to-top

### ✨ Animation Highlights

#### Hero Section
- 3D text rotation on title
- Glowing "NGUON" text with blur effect
- Floating geometric shapes
- Particle system background
- Magnetic CTA button
- Animated countdown timer

#### Navigation
- Active section highlighting
- Smooth underline animations
- Mobile menu with stagger effects
- Logo hover animations

#### Stats Section
- Animated counters
- Icon rotation on hover
- Floating orb backgrounds
- Glow effects

#### About Section
- Text reveal animations
- Image scale on hover
- Staggered list items
- Decorative blur elements

#### Gallery
- Lightbox modal with navigation
- Shimmer effect on hover
- Smooth image transitions
- Keyboard navigation (← →)

#### Footer
- Social icon animations
- Link underline effects
- Staggered content reveal

### 🎯 Interactive Elements

1. **Magnetic Buttons** - Buttons that follow your cursor
2. **3D Cards** - Cards that tilt based on mouse position
3. **Image Hover Effects** - Scale, shimmer, and overlay effects
4. **Smooth Scrolling** - All anchor links scroll smoothly

### 📱 Mobile Optimizations

- Touch-friendly interactions
- Responsive animations
- Optimized performance
- Reduced motion for accessibility

## Animation Components

### ParticleBackground
Creates a canvas-based particle system with connecting lines.

```tsx
import ParticleBackground from "@/components/ParticleBackground";

<ParticleBackground />
```

### MagneticButton
Button that follows cursor movement with spring physics.

```tsx
import MagneticButton from "@/components/MagneticButton";

<MagneticButton onClick={handleClick}>
  Click Me
</MagneticButton>
```

### TextReveal
Reveals text word by word with smooth animations.

```tsx
import TextReveal from "@/components/TextReveal";

<TextReveal delay={0.2}>
  Your text here
</TextReveal>
```

### Card3D
Creates a 3D tilt effect on mouse movement.

```tsx
import Card3D from "@/components/Card3D";

<Card3D>
  <YourContent />
</Card3D>
```

### ScrollProgress
Shows scroll progress at the top of the page.

```tsx
import ScrollProgress from "@/components/ScrollProgress";

<ScrollProgress />
```

### FloatingActions
Floating action buttons for quick navigation.

```tsx
import FloatingActions from "@/components/FloatingActions";

<FloatingActions />
```

## CSS Animation Classes

### Utility Classes

```css
.animate-float          /* Floating motion */
.animate-pulse-glow     /* Pulsing glow */
.animate-shimmer        /* Shimmer effect */
.animate-rotate-slow    /* Slow rotation */
.animate-gradient-shift /* Animated gradient */
```

### Custom Classes

```css
.glass                  /* Glass morphism */
.gradient-text-animated /* Animated gradient text */
.btn-glow              /* Button with glow */
.card-cultural         /* Cultural card style */
.image-frame           /* Image with frame */
```

## Performance Tips

1. **Animations use GPU acceleration** - All animations use `transform` and `opacity`
2. **Viewport-based triggers** - Animations only run when elements are visible
3. **Once-only animations** - Most animations run only once to save resources
4. **Debounced scroll listeners** - Scroll events are optimized

## Customization

### Changing Animation Speed

Edit the duration in component files:

```tsx
transition={{ duration: 0.8 }} // Change to your preferred speed
```

### Changing Colors

Edit `src/index.css` CSS variables:

```css
--secondary: 46 92% 55%;  /* Gold color */
--primary: 217 71% 28%;   /* Royal blue */
```

### Disabling Animations

For accessibility or performance, you can disable animations by adding:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Animations not working?
1. Check if JavaScript is enabled
2. Clear browser cache
3. Check console for errors

### Performance issues?
1. Reduce particle count in ParticleBackground
2. Disable cursor glow on mobile
3. Use `prefers-reduced-motion`

### Images not loading?
1. Check image paths in assets folder
2. Verify imports in components
3. Check build output

## Credits

Built with:
- React 18
- Framer Motion
- Tailwind CSS
- Lucide Icons
- TypeScript

## License

Part of the Le Nguon cultural website project.
