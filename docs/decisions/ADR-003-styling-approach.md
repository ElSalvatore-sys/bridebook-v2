# ADR-003: Styling Approach

## Status
Accepted

## Context
EA Platform needs a consistent, maintainable styling approach that enables rapid UI development while maintaining design consistency and accessibility. The chosen approach must work well with React and support dark mode as a primary theme.

## Decision
We will use **TailwindCSS** for utility-based styling combined with **shadcn/ui** for pre-built, accessible components.

## Rationale

### Why TailwindCSS?

1. **Rapid Development**: Utility classes enable fast prototyping without context-switching to CSS files.

2. **Consistency**: Design tokens (spacing, colors, typography) are enforced through configuration.

3. **Bundle Optimization**: PurgeCSS removes unused styles, resulting in tiny production bundles.

4. **Dark Mode Support**: Built-in dark mode variant (`dark:`) makes theming trivial.

5. **Responsive Design**: Mobile-first responsive utilities (`sm:`, `md:`, `lg:`) are intuitive.

### Why shadcn/ui?

1. **Copy-Paste Components**: Unlike traditional libraries, you own the code. Components are copied into your project, enabling full customization.

2. **Accessibility First**: Built on Radix UI primitives, ensuring WCAG compliance out of the box.

3. **TailwindCSS Native**: Components use Tailwind classes, integrating seamlessly with our styling approach.

4. **No Bundle Bloat**: Only import what you need - no massive component library dependency.

5. **Consistent Design Language**: Pre-designed components that look professional with minimal customization.

## Consequences

### Positive
- Rapid UI development with utility classes
- Consistent spacing, colors, and typography
- Accessible components by default (Radix UI foundation)
- Full control over component code
- Small production bundle sizes
- Easy dark mode implementation
- Strong TypeScript support

### Negative
- HTML can become verbose with many utility classes
- Learning curve for developers unfamiliar with utility-first CSS
- Need to manage shadcn/ui component updates manually
- Some complex animations may still require custom CSS

### Mitigations
- Use `@apply` directive sparingly for repeated patterns
- Create reusable component variants with `cva` (class-variance-authority)
- Document component customizations for team consistency
- Use Framer Motion for complex animations

## Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **TailwindCSS + shadcn/ui** | Utility-first, accessible, owns code | Verbose HTML | **Selected** |
| **CSS Modules** | Scoped styles, familiar CSS | More boilerplate, no design system | Rejected |
| **Styled Components** | CSS-in-JS, dynamic styling | Runtime overhead, bundle size | Rejected |
| **Chakra UI** | Great DX, accessible | Heavier bundle, less customizable | Rejected |
| **Material UI** | Comprehensive, well-documented | Heavy, opinionated design | Rejected |
| **Ant Design** | Enterprise-ready | Very opinionated, harder to customize | Rejected |

## Implementation Notes

### Tailwind Configuration
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // EA Platform brand colors
      }
    }
  }
}
```

### shadcn/ui Setup
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog form input
```

## References
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Class Variance Authority](https://cva.style/docs)
