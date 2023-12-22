import ProfileCard from '@components/profile/ProfileCard';
import { fireEvent, render } from '@utils/testHelper';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockProps = {
  intl: {
    formatMessage: jest.fn(),
  },
};

const renderProfileCard = (user) => {
  const wrapper = render(<ProfileCard user={user} {...mockProps} />);
  return { wrapper, ...wrapper };
};

describe('ProfileCard Component', () => {
  const testUser = {
    avatar: 'avatar-url',
    username: 'testuser',
    email: 'test@example.com',
    bmr: 2000,
    proteinIntake: 100,
    carbsIntake: 150,
    fatIntake: 50,
  };

  const goals = [
    { goal: 'gain', expectedText: 'Menaikkan Berat Badan' },
    { goal: 'maintain', expectedText: 'Mempertahankan Berat Badan' },
    { goal: 'lose', expectedText: 'Menurunkan Berat Badan' },
  ];

  goals.forEach(({ goal, expectedText }) => {
    it(`should render component correctly for "${goal}" goal`, () => {
      const user = { ...testUser, goal };
      const { getByText, getByTestId } = renderProfileCard(user);

      expect(getByTestId('profile-card')).toBeInTheDocument();
      expect(getByText('testuser')).toBeInTheDocument();
      expect(getByText('test@example.com')).toBeInTheDocument();
      expect(getByText(expectedText)).toBeInTheDocument();
    });
  });

  it('should navigate to profile page on button click', () => {
    const user = { ...testUser, goal: 'lose' };
    const { getByTestId } = renderProfileCard(user);

    const viewProfileButton = getByTestId('view-profile-button');
    fireEvent.click(viewProfileButton);

    expect(mockNavigate).toHaveBeenCalledWith(`/profile`);
  });

  it('should match with snapshot', () => {
    const user = { ...testUser, goal: 'lose' };
    const { wrapper } = renderProfileCard(user);

    expect(wrapper).toMatchSnapshot();
  });
});
