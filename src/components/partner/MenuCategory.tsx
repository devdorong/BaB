import { type CategoryTab } from './MenusList';

type MenuCategorysProps = {
  categories: readonly CategoryTab[];
  value: CategoryTab;
  onChange: (tag: CategoryTab) => void;
};

function MenuCategory({ categories, value, onChange }: MenuCategorysProps) {
  return (
    <>
     
      <div className={['w-full rounded-lg border border-gray-150 bg-white', 'p-5'].join(' ')}>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map(tag => {
            const active = tag === value;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onChange(tag)}
                className={[
                  'h-8 px-3 rounded-full text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#FF5722] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]/40',
                ].join(' ')}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MenuCategory;
