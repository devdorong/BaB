import { InterestBadge } from '../tag';
import TagBadge from '../TagBadge';
import {
  beverageDessertColors,
  categoryColors,
  defaultCategoryColor,
  spaceEnvColors,
} from './categoryColors';

type Props = {
  name: string;
  className?: string;
};

export function CategoryBadge({ name, className }: Props) {
  const color =
    categoryColors[name] ??
    beverageDessertColors[name] ??
    spaceEnvColors[name] ??
    defaultCategoryColor;
  return (
    <span className={className}>
      <InterestBadge bgColor={color.bg} textColor={color.text}>
        {name}
      </InterestBadge>
    </span>
  );
}

export default CategoryBadge;
