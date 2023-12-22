import Hero from '@components/landing-page/Hero';
import { fireEvent, render } from '@utils/testHelper';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

beforeEach(() => {
  wrapper = render(<Hero />);
});

describe('Hero Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('hero')).toBeInTheDocument();
  });

  it('should call navigate to sign up when hero button is clicked', () => {
    const { getByTestId } = wrapper;

    const heroButton = getByTestId('hero-button');
    fireEvent.click(heroButton);

    expect(mockNavigate).toHaveBeenCalledWith('/sign-up');
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
