import CalorieCounter from '@components/diary/CalorieCounter';
import { fireEvent, render } from '@utils/testHelper';

const mockProps = {
  caloriesConsumed: 1500,
  dailyCalorieGoal: 2000,
};

let wrapper;

beforeEach(() => {
  wrapper = render(<CalorieCounter {...mockProps} />);
});

describe('CalorieCounter Component', () => {
  it('should render component correctly', () => {
    const { getByTestId } = wrapper;

    const container = getByTestId('calorie-counter-container');
    expect(container).toBeInTheDocument();
  });

  it('should display consumed and goal calories on hover', () => {
    const { getByTestId, getByText } = wrapper;

    const container = getByTestId('calorie-counter-container');

    fireEvent.mouseEnter(container);
    expect(getByText(`${mockProps.caloriesConsumed}/${mockProps.dailyCalorieGoal}`)).toBeInTheDocument();

    fireEvent.mouseLeave(container);
    expect(getByText(`${mockProps.dailyCalorieGoal - mockProps.caloriesConsumed}`)).toBeInTheDocument(); // Adjust based on the actual expected content
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
