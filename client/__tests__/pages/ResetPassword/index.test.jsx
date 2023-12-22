import ResetPassword from '@pages/ResetPassword';
import { fireEvent, render } from '@utils/testHelper';

const mockNavigate = jest.fn();
const mockParams = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoZWdhbWluZ2Jhbm5lZEBnbWFpbC5jb20iLCJpYXQiOjE3MDI0NzY1NzYsImV4cCI6MTcwMjQ3NjYzNn0.ACQHc8Y_e5y-Nl3-FhbH2ph_Ecr78VwFA4NY8oZKk80',
};

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

let wrapper;

beforeEach(() => {
  wrapper = render(<ResetPassword />);
});

describe('ResetPassword Page', () => {
  it('should render the page correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('reset-password')).toBeInTheDocument();
  });

  it('should update password state on input change', () => {
    const { getByTestId } = wrapper;

    const passwordInput = getByTestId('form-input-password');

    fireEvent.change(passwordInput, { target: { value: 'newPassword123' } });

    expect(passwordInput.value).toBe('newPassword123');
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
