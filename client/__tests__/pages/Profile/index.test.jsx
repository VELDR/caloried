import Profile from '@pages/Profile';
import { render, fireEvent } from '@utils/testHelper';

jest.mock('@static/images/protein.png', () => 'path/to/protein.png');
jest.mock('@static/images/carbs.png', () => 'path/to/carbs.png');
jest.mock('@static/images/fat.png', () => 'path/to/fat.png');

let wrapper;

beforeEach(() => {
  wrapper = render(<Profile />);
});

describe('Profile Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('profile')).toBeInTheDocument();
  });

  it('should open the change password modal when the Change Password button is clicked', () => {
    const { getByTestId } = wrapper;

    fireEvent.click(getByTestId('change-password-button'));

    expect(getByTestId('change-password-modal')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
