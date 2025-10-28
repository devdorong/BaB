import { useEffect, useState } from 'react';
import { fetchRestaurantMenus, type RestaurantMenusProps } from '../../lib/restaurants';
import type { Database } from '../../types/bobType';
import { RiImage2Fill, RiImage2Line } from 'react-icons/ri';

type MenusTab = Database['public']['Enums']['menu_category_enum'];
const MENUSTAB: MenusTab[] = ['메인메뉴', '사이드', '음료 및 주류'];

const ReviewMenu = ({ restaurantId }: { restaurantId: number }) => {
  const [menus, setMenus] = useState<RestaurantMenusProps[]>([]);

  useEffect(() => {
    const loadMenus = async () => {
      const data = await fetchRestaurantMenus(restaurantId);
      setMenus(data);
    };
    loadMenus();
  }, [restaurantId]);

  return (
    <section className="mt-5 lg:mt-10">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {menus.length > 0 ? (
          <>
            {MENUSTAB.map(tab => (
              <div key={tab} className="mb-12">
                <h3 className="text-[22px] font-bold text-babgray-900 mb-5 border-l-4 border-bab-500 pl-3">
                  {tab}
                </h3>

                {/* 가로 확장 카드 영역 */}
                <div className="flex flex-wrap gap-6">
                  {menus
                    .filter(item => item.category === tab)
                    .map(item => (
                      <div key={item.id} className="flex w-[380px] p-4 rounded-2xl bg-babgray-50  ">
                        <div className="flex justify-center w-[110px] h-[110px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              onError={e => {
                                const el = e.currentTarget;
                                el.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex text-gray-500 text-sm justify-center items-center">
                              <RiImage2Line size={30} className="text-babgray-300" />
                              {/* 이미지 없음 */}
                            </div>
                          )}
                          {/* <img
                            className="w-full h-full object-cover object-center"
                            src={item.image_url || '/no-image.png'}
                            alt={item.name}
                          /> */}
                        </div>

                        <div className="ml-4 flex flex-col justify-center">
                          <div className="text-[17px] font-semibold text-babgray-900">
                            {item.name}
                          </div>
                          <p className="text-sm text-babgray-600 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="mt-1 text-[16px] font-bold text-bab-500">
                            {item.price.toLocaleString()}원
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex justify-center items-center h-64 text-babgray-500 text-lg">
            메뉴 정보가 없습니다
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewMenu;
