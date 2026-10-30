import React from 'react';
import {
  ShoppingCart,
  Zap,
  Home,
  HeartPulse,
  GraduationCap,
  Fuel,
  Smartphone,
  Sparkles,
  Shirt,
  Utensils,
  UserCheck,
  MoreHorizontal,
  Briefcase,
  Store,
  Building2,
  PiggyBank,
  Gift,
  Coins,
  Droplet,
  Compass,
  Wallet,
  Calendar,
  Layers,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Salad':
      return <Utensils {...props} />;
    case 'ShoppingCart':
      return <ShoppingCart {...props} />;
    case 'Milk':
      return <Droplet {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Fuel':
      return <Fuel {...props} />;
    case 'Smartphone':
      return <Smartphone {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Shirt':
      return <Shirt {...props} />;
    case 'Utensils':
      return <Utensils {...props} />;
    case 'UserCheck':
      return <UserCheck {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'Store':
      return <Store {...props} />;
    case 'Building2':
      return <Building2 {...props} />;
    case 'PiggyBank':
      return <PiggyBank {...props} />;
    case 'Gift':
      return <Gift {...props} />;
    case 'Coins':
      return <Coins {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'Wallet':
      return <Wallet {...props} />;
    case 'Calendar':
      return <Calendar {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    default:
      return <MoreHorizontal {...props} />;
  }
};
