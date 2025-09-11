import { Link } from 'react-router-dom';

function IndexPage() {
  return (
    <div>
      <Link to="/member">멤버</Link>
      <Link to="/partner">파트너</Link>
    </div>
  );
}

export default IndexPage;
