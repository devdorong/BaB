import { useNavigate } from 'react-router-dom';
import { RowCard } from '../../../ui/jy/ReviewCard';
import { BrandTag, GrayTag } from '../../../ui/tag';
import { useEffect, useState } from 'react';
import { fetchRestaurants, type RestaurantsType } from '../../../lib/restaurants';
import { fetchInterestsGrouped } from '../../../lib/interests';

const FOOD = '음식 종류';

function FavoritePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurants, setRestaurants] = useState<RestaurantsType[]>([]);
  const [interests, setInterests] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // 카테고리
  useEffect(() => {
    const restaurantLoad = async () => {
      setLoading(true);
      try {
        const [grouped, restaurantData] = await Promise.all([
          fetchInterestsGrouped(),
          fetchRestaurants(),
        ]);
        setInterests(grouped);
        setRestaurants(restaurantData);
      } catch (err) {
        // console.log(err);
      } finally {
        setLoading(false);
      }
    };
    restaurantLoad();
  }, []);

  // 카테고리 필터 적용
  const filtered =
    selectedCategory === '전체'
      ? restaurants
      : restaurants.filter(item => item.interests?.name === selectedCategory);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const grouped = await fetchInterestsGrouped();
        setInterests(grouped);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div id="root" className="flex flex-col min-h-screen">
      <div className="w-[1280px] mx-auto">
        {/* 프로필 헤더 링크 */}
        <div className="flex py-[15px]">
          <div
            onClick={() => navigate('/member/profile')}
            className=" cursor-pointer hover:text-babgray-900 text-babgray-600 text-[17px]"
          >
            프로필
          </div>
          <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
          <div className="text-bab-500 text-[17px]">즐겨찾는 식당</div>
        </div>
        <div className="w-[1280px] mx-auto flex flex-col gap-8 py-8">
          {/* 타이틀 */}
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold">즐겨찾는 식당</p>
          </div>
          {/* 검색폼,버튼 */}
          <div className="flex gap-[8px] justify-start pb-[30px]">
            <div className="flex gap-[8px] justify-start ">
              <button
                onClick={() => {
                  setSelectedCategory('전체');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === '전체'
                    ? 'bg-bab-500 text-white text-[13px]'
                    : 'bg-babgray-100 text-babgray-700 text-[13px]'
                }`}
              >
                전체
              </button>
            </div>

            <div className="flex gap-[8px] justify-start ">
              {(interests[FOOD] ?? []).map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === cat
                      ? 'bg-bab-500 text-white text-[13px]'
                      : 'bg-babgray-100 text-babgray-700 text-[13px]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[34px]">
            {[...Array(6)].map((_, index) => (
              <RowCard key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FavoritePage;
