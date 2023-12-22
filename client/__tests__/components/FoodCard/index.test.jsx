import FoodCard from '@components/FoodCard';
import { fireEvent, render } from '@utils/testHelper';

let wrapper;

jest.mock('@static/images/protein.png', () => 'path/to/protein.png');
jest.mock('@static/images/carbs.png', () => 'path/to/carbs.png');
jest.mock('@static/images/fat.png', () => 'path/to/fat.png');

const mockFood = {
  foodName: 'Test Food',
  image: 'test-image.jpg',
  type: 'common',
  servingQty: 1,
  servingUnit: 'serving',
  servingWeight: 100,
  nutrients: {
    calories: { value: 200 },
    protein: { value: 10 },
    carbs: { value: 20 },
    fat: { value: 5 },
  },
};

const mockProps = {
  food: mockFood,
  onClick: jest.fn(),
  intl: {
    formatMessage: jest.fn(),
  },
  loading: false,
};

beforeEach(() => {
  wrapper = render(<FoodCard {...mockProps} />);
});

describe('FoodCard Component', () => {
  it('should render component correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('food-card')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const { getByTestId } = wrapper;
    const foodCard = getByTestId('food-card');

    fireEvent.click(foodCard);

    expect(mockProps.onClick).toHaveBeenCalled();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
