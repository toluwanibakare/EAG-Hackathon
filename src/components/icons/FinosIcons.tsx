import {
  Home, PiggyBank, ShieldCheck, BookOpen, TrendingUp, Smile, Heart, Shuffle,
  ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Wallet, Receipt, Target,
  Bell, Settings, User, CreditCard, FileText, ChevronRight, ChevronLeft,
  ChevronDown, ChevronUp, Plus, Minus, Eye, EyeOff, Search, Filter,
  Check, X, AlertCircle, Clock, CheckCircle2, XCircle, Loader2,
  MoreHorizontal, LogOut, Download, Upload, Calendar, Tag, MapPin,
  Percent, GripVertical, Trash2, Copy, Edit3, Info,
  CircleDollarSign, Banknote, Coins, Landmark, Smartphone, Globe,
  Moon, Mail, Lock,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  home: Home,
  'piggy-bank': PiggyBank,
  shield: ShieldCheck,
  'book-open': BookOpen,
  'trending-up': TrendingUp,
  smile: Smile,
  heart: Heart,
  shuffle: Shuffle,
  'arrow-up-right': ArrowUpRight,
  'arrow-down-left': ArrowDownLeft,
  'arrow-left-right': ArrowLeftRight,
  wallet: Wallet,
  receipt: Receipt,
  target: Target,
  bell: Bell,
  settings: Settings,
  user: User,
  'credit-card': CreditCard,
  'file-text': FileText,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  plus: Plus,
  minus: Minus,
  eye: Eye,
  'eye-off': EyeOff,
  search: Search,
  filter: Filter,
  check: Check,
  x: X,
  'alert-circle': AlertCircle,
  clock: Clock,
  'check-circle': CheckCircle2,
  'x-circle': XCircle,
  loader: Loader2,
  'more-horizontal': MoreHorizontal,
  'log-out': LogOut,
  download: Download,
  upload: Upload,
  calendar: Calendar,
  tag: Tag,
  'map-pin': MapPin,
  dollar: CircleDollarSign,
  banknote: Banknote,
  coins: Coins,
  landmark: Landmark,
  smartphone: Smartphone,
  globe: Globe,
  percent: Percent,
  grip: GripVertical,
  trash: Trash2,
  copy: Copy,
  edit: Edit3,
  info: Info,
  moon: Moon,
  mail: Mail,
  lock: Lock,
}

interface FinosIconProps {
  name: string
  className?: string
  size?: number
}

export function FinosIcon({ name, className = '', size = 20 }: FinosIconProps) {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon className={className} size={size} />
}
