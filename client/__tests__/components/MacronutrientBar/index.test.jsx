import MacronutrientBar from '@components/diary/MacronutrientBar';
import { fireEvent, render } from '@utils/testHelper';

let wrapper;

const mockProps = {
  type: 'Protein',
  value: 50,
  dailyGoal: 100,
};

beforeEach(() => {
  wrapper = render(<MacronutrientBar {...mockProps} />);
});

describe('MacronutrientBar Component', () => {
  const percentage = (mockProps.value / mockProps.dailyGoal) * 100;
  it('should render component correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('macronutrient-bar')).toBeInTheDocument();
  });

  it('should update percentage display on hover', () => {
    const { getByText, getByTestId } = wrapper;
    const percentageDisplay = getByText(`${percentage}%`);
    const macronutrientBar = getByTestId('macronutrient-bar');

    expect(percentageDisplay).toBeInTheDocument();

    fireEvent.mouseEnter(macronutrientBar);
    expect(getByText(`${mockProps.value}/${mockProps.dailyGoal} g`)).toBeInTheDocument();

    fireEvent.mouseLeave(macronutrientBar);
    expect(getByText(`${percentage}%`)).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
