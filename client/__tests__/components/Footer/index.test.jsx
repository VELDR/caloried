import Footer from '@components/landing-page/Footer';
import { render } from '@utils/testHelper';

let wrapper;

beforeEach(() => {
  wrapper = render(<Footer />);
});

describe('Footer Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('footer')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
