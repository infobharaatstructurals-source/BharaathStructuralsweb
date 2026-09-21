export type IconName =
  | 'ArrowDown' | 'ArrowRight' | 'ArrowUpRight' | 'Check' | 'ExternalLink'
  | 'Mail' | 'MapPin' | 'Menu' | 'Phone' | 'Play' | 'X'
  | 'Linkedin' | 'Youtube' | 'Instagram' | 'Facebook'

const paths: Record<IconName, string> = {
  ArrowDown: 'M5 12h14M13 6l6 6-6 6', ArrowRight: 'M5 12h14M13 6l6 6-6 6', ArrowUpRight: 'M5 19 19 5M9 5h10v10',
  Check: 'm5 12 4 4L19 6', ExternalLink: 'M14 5h5v5M19 5l-9 9', Mail: 'M4 5h16v14H4zM4 6l8 6 8-6',
  MapPin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  Menu: 'M4 7h16M4 12h16M4 17h16', Phone: 'M6 3l3 1-1 4a14 14 0 0 0 4 4l4-1 1 3-2 2c-7-1-11-5-12-12Z',
  Play: 'm8 5 11 7-11 7V5Z', X: 'M5 5l14 14M19 5 5 19', Linkedin: 'M6 8v10M6 5v.1M10 18v-6a3 3 0 0 1 6 0v6M10 12v6',
  Youtube: 'M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9ZM10 9l5 3-5 3V9Z',
  Instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5-2h.01',
  Facebook: 'M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9a1 1 0 0 1 1-1Z',
}

export default function Icon({ name, size = 18, className = '' }: { name: IconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
