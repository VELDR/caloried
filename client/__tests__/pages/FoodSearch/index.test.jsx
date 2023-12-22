import FoodSearch from '@pages/FoodSearch';
import { fireEvent, render } from '@utils/testHelper';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams(), () => jest.fn()],
}));

let wrapper;

beforeEach(() => {
  wrapper = render(<FoodSearch />);
});

describe('FoodSearch Page', () => {
  it('should render the page correctly', () => {
    const { getByTestId, getByText } = wrapper;

    expect(getByTestId('food-search')).toBeInTheDocument();
    expect(getByText('All')).toBeInTheDocument();
    expect(getByText('Common')).toBeInTheDocument();
    expect(getByText('Branded')).toBeInTheDocument();
  });

  it('should change the category class to active when a category is clicked', () => {
    const { getByText } = wrapper;

    fireEvent.click(getByText('Common'));

    expect(getByText('Common')).toHaveClass('active');
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
