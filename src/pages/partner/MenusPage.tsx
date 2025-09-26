import MenuCategory from '../../components/partner/MenuCategory';
import MenusList from '../../components/partner/MenusList';
import MenuCard from '../../ui/jy/menucard';

function MenusPage() {
  return (
    <div>
      <div>
        <MenuCategory />
      </div>
      <div>
        <MenusList />
      </div>
    </div>
  );
}

export default MenusPage;
