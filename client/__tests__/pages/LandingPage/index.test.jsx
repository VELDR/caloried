import LandingPage from '@pages/LandingPage';
import { render } from '@utils/testHelper';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

beforeEach(() => {
  wrapper = render(<LandingPage />);
});

describe('LandingPage page', () => {
  it('should render the page correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('landing-page')).toBeInTheDocument();
    expect(getByTestId('hero')).toBeInTheDocument();
    expect(getByTestId('features')).toBeInTheDocument();
    expect(getByTestId('footer')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
