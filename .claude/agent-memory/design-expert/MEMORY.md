# Zim-REC Design System Notes

## Stack
- React 19, Tailwind CSS 4 (imported via `@import "tailwindcss"`), MUI 7, Framer Motion, Lucide icons
- Base font: IBM Plex Sans (set in index.css)
- No tailwind.config file; no MUI theme customization file found

## Established Design Language (Feb 2026 Polish Pass)
- **Navbar**: Glass effect (`bg-white/80 backdrop-blur-xl border-b border-gray-100`), slide-from-right mobile menu
- **Cards**: `rounded-xl shadow-sm border border-gray-100` (not `rounded-lg shadow`)
- **Primary CTA**: `bg-emerald-600 hover:bg-emerald-700 rounded-lg/xl shadow-sm` (solid, no gradients on buttons)
- **Secondary CTA**: `border-gray-200 text-gray-700 hover:border-emerald-500 rounded-lg`
- **Tables**: `bg-gray-50/80` headers, alternating rows via `idx % 2`, `hover:bg-emerald-50/40`
- **Footer**: Dark theme (`bg-gray-900 to gray-950`), not blue gradient
- **Section headings**: Uppercase overline label + bold heading + gray-500 body
- **Inputs**: `border-gray-200 rounded-lg/xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`
- **Auth modals**: Gradient top strip, `rounded-2xl`, custom spinner

## Color Palette (standardized)
- Primary: emerald-600 (buttons, CTAs, active states)
- Secondary: blue-600 (informational, overline labels)
- Gradients: `from-blue-900 via-blue-700 to-emerald-600` (hero only)
- Footer: `from-gray-900 to-gray-950`
- Text: gray-900 (headings), gray-500 (body), gray-400 (muted)
- Icon backgrounds: `bg-emerald-50 border border-emerald-100` pattern

## Key File Locations
- Footer: `frontend/src/components/footer/footer.jsx`
- Navbar + AuthModals: `frontend/src/components/nav/nav.jsx`
- Standalone AuthModals: `frontend/src/components/nav/authModals.jsx`
- Home: `frontend/src/components/home/home.jsx`
- About: `frontend/src/components/about/about.jsx`
- Contact: `frontend/src/components/contact/contact.jsx`
- Help Center: `frontend/src/components/helpcenter/helpcenter.jsx`
- Gallery: `frontend/src/components/about/gallery.jsx`
- Documentation: `frontend/src/components/about/documentation.jsx`
- Dashboards: `frontend/src/components/dashboard/{userDashboard,issueDashboard,adminDashboard}.jsx`
- Profile/Settings: `frontend/src/components/{profile/profile,settings/settings}.jsx`
- Global CSS: `frontend/src/index.css`, `frontend/src/App.css`

## Notes
- MUI+Tailwind requires `!` prefix for overrides
- Home page Statistics + Features sections restored (were commented out)
- SidebarLogo had placeholder `/api/placeholder/40/40`; fixed to `/logo.png`
- App.css was cleaned of Vite boilerplate (max-width/padding/text-align:center)
