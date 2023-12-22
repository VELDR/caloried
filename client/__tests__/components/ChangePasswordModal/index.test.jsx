import ChangePasswordModal from '@components/profile/ChangePasswordModal';
import { fireEvent, render } from '@utils/testHelper';

let wrapper;

const mockProps = {
  open: true,
  onClose: jest.fn(),
  token: 'mockToken',
  intl: {
    formatMessage: jest.fn(),
  },
};

beforeEach(() => {
  wrapper = render(<ChangePasswordModal {...mockProps} />);
});

describe('ChangePasswordModal Component', () => {
  it('should render component correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('change-password-modal')).toBeInTheDocument();
  });

  it('should toggle current password visibility', () => {
    const { getByLabelText, getByTestId } = wrapper;
    const currentPasswordInput = getByLabelText('Sandi sekarang');

    const toggleVisibilityCurrentPassword = getByTestId('toggle-visibility-current-password');

    expect(currentPasswordInput.getAttribute('type')).toBe('password');

    fireEvent.click(toggleVisibilityCurrentPassword);

    expect(currentPasswordInput.getAttribute('type')).toBe('text');
  });
  it('should toggle new password visibility', () => {
    const { getByLabelText, getByTestId } = wrapper;
    const newPasswordInput = getByLabelText('Sandi baru');

    const toggleVisibilityNewPassword = getByTestId('toggle-visibility-new-password');

    expect(newPasswordInput.getAttribute('type')).toBe('password');

    fireEvent.click(toggleVisibilityNewPassword);

    expect(newPasswordInput.getAttribute('type')).toBe('text');
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
