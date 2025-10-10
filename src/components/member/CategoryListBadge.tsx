import CategoryBadge from '../../ui/jy/CategoryBadge';

type Props = {
  categories?: string[];
  onClick?: (name: string) => void; // 선택/필터 등에 활용
};

export function CategoryListBadge({ categories = [], onClick }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(name => (
        <button
          key={name}
          type="button"
          className="focus:outline-none"
          onClick={() => onClick?.(name)}
        >
          <CategoryBadge name={name} />
        </button>
      ))}
    </div>
  );
}

export default CategoryListBadge;
