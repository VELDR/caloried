import NutritionPopup from '@components/ui/NutritionPopup';
import { fireEvent, render } from '@utils/testHelper';

let isOpen = true;
let wrapper;

jest.mock('@static/images/protein.png', () => 'path/to/protein.png');
jest.mock('@static/images/carbs.png', () => 'path/to/carbs.png');
jest.mock('@static/images/fat.png', () => 'path/to/fat.png');

const mockProps = {
  open: isOpen,
  user: {
    username: 'dummy',
    goal: 'maintain',
    bmr: '1000',
    proteinIntake: '50',
    fatIntake: '50',
    carbsIntake: '50',
  },
  onClose: () => {
    isOpen = false;
  },
};

beforeEach(() => {
  wrapper = render(<NutritionPopup {...mockProps} />);
});

describe('NutritionPopup Component', () => {
  it('should render component correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('nutrition-popup')).toBeInTheDocument();
  });

  it('should close popup', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('nutrition-popup-button');
    fireEvent.click(button);
    expect(isOpen).toBe(false);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
