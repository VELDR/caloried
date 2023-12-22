import ProfileMenu from '@components/profile/ProfileMenu';
import { fireEvent, render } from '@utils/testHelper';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

const mockProps = {
  user: {
    username: 'testuser',
    email: 'test@example.com',
    avatar: '/path/to/avatar.jpg',
  },
};

beforeEach(() => {
  wrapper = render(<ProfileMenu {...mockProps} />);
});

describe('ProfileMenu Component', () => {
  it('should render component correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('menu-avatar-user')).toBeInTheDocument();
  });

  it('should open the menu when avatar is clicked', () => {
    const { getByTestId } = wrapper;
    const avatar = getByTestId('menu-avatar-user');

    fireEvent.click(avatar);

    expect(getByTestId('profile-menu')).toBeInTheDocument();
  });

  it('should call navigate to profile when profile menu item is clicked', () => {
    const { getByTestId } = wrapper;
    const avatar = getByTestId('menu-avatar-user');
    fireEvent.click(avatar);

    const profileMenuItem = getByTestId('profile-navigate-profile');
    fireEvent.click(profileMenuItem);

    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('should logout user when logout menu item is clicked', () => {
    const { getByTestId } = wrapper;
    const avatar = getByTestId('menu-avatar-user');
    fireEvent.click(avatar);

    const logoutMenuItem = getByTestId('profile-logout');
    fireEvent.click(logoutMenuItem);

    expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
