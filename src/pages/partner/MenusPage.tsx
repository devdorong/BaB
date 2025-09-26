import MenuCategory from '../../components/partner/MenuCategory';
import MenusList from '../../components/partner/MenusList';
import PartnerBoardHeader from '../../components/PartnerBoardHeader';

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
