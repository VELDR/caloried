import CreateAccount from '@components/forms/CreateAccount';
import { fireEvent, render } from '@utils/testHelper';

let wrapper;

beforeEach(() => {
  wrapper = render(<CreateAccount />);
});

describe('CreateAccount Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('create-account')).toBeInTheDocument();
    expect(getByTestId('form-header')).toBeInTheDocument();
    expect(getByTestId('form-footer')).toBeInTheDocument();
  });

  it('should handle input change', () => {
    const { getByTestId } = wrapper;

    const usernameInput = getByTestId('form-input-text');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    expect(usernameInput.value).toBe('testuser');
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
