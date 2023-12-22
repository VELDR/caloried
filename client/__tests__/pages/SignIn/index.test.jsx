import SignIn from '@pages/SignIn';
import { fireEvent, render } from '@utils/testHelper';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  intl: {
    formatMessage: jest.fn(),
  },
};

beforeEach(() => {
  wrapper = render(<SignIn {...mockProps} />);
});

describe('SignIn Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('sign-in')).toBeInTheDocument();
  });

  it('should update input values', () => {
    const { getByTestId } = wrapper;
    const emailInput = getByTestId('form-input-email');
    const passwordInput = getByTestId('form-input-password');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should toggle between user and admin mode when the switch is clicked', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('option-role-user')).toHaveClass('option__selected');
    expect(getByTestId('option-role-admin')).not.toHaveClass('option__selected');

    fireEvent.click(getByTestId('role-option-switch'));

    expect(getByTestId('option-role-admin')).toHaveClass('option__selected');
    expect(getByTestId('option-role-user')).not.toHaveClass('option__selected');
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
