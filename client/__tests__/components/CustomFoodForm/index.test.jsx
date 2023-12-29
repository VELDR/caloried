import CustomFoodForm from '@components/CustomFoodForm';
import { fireEvent, render } from '@utils/testHelper';

let wrapper;

jest.mock('@static/images/protein.png', () => 'path/to/protein.png');
jest.mock('@static/images/carbs.png', () => 'path/to/carbs.png');
jest.mock('@static/images/fat.png', () => 'path/to/fat.png');
jest.mock('@static/images/calories.png', () => 'path/to/calories.png');

const mockProps = {
  open: true,
  onClose: jest.fn(),
  token: 'token',
  intl: {
    formatMessage: jest.fn(),
  },
  query: 'test',
  page: 1,
  size: 5,
  selectedCategory: 'All',
};

beforeEach(() => {
  wrapper = render(<CustomFoodForm {...mockProps} />);
});

describe('CustomFoodForm Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('custom-food-modal')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should handle form cancellation', () => {
    const { getByText } = wrapper;

    fireEvent.click(getByText('Batal'));

    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
