import {
  LayoutDashboard, Target, BookOpen, Wallet, GraduationCap, Clapperboard, Heart, Mail, Settings,
} from 'lucide-react'

// Satu sumber untuk sidebar desktop dan navigasi bawah di HP.
export const GRUP_NAV = [
  {
    label: 'Harian',
    items: [
      { to: '/dashboard', label: 'Home',     icon: LayoutDashboard },
      { to: '/life',      label: 'Activity', icon: Target          },
      { to: '/journal',   label: 'Journal',  icon: BookOpen        },
    ],
  },
  {
    label: 'Rencana',
    items: [
      { to: '/finance', label: 'Finance', icon: Wallet        },
      { to: '/toefl',   label: 'TOEFL',   icon: GraduationCap },
      { to: '/konten',  label: 'Konten',  icon: Clapperboard  },
    ],
  },
  {
    label: 'Pernikahan',
    items: [
      { to: '/wedding',  label: 'Wedding',  icon: Heart },
      { to: '/undangan', label: 'Undangan', icon: Mail  },
    ],
  },
]

export const NAV_SETTINGS = { to: '/settings', label: 'Settings', icon: Settings }

const SEMUA = [...GRUP_NAV.flatMap((g) => g.items), NAV_SETTINGS]
const byPath = (to) => SEMUA.find((i) => i.to === to)

// Di HP: empat menu tetap di bawah, sisanya di lembar "Lainnya".
export const NAV_BAWAH = ['/dashboard', '/life', '/journal', '/konten'].map(byPath)
export const NAV_LAINNYA = SEMUA.filter((i) => !NAV_BAWAH.includes(i))
