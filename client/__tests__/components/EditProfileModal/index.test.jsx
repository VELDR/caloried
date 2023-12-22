import EditProfileModal from '@components/profile/EditProfileModal';
import { fireEvent, render } from '@utils/testHelper';

let wrapper;

const mockProps = {
  user: {
    username: 'testuser',
    email: 'test@example.com',
    avatar: '/path/to/avatar.jpg',
    sex: 'male',
    dob: '1990-01-01',
    height: 175,
    weight: 70,
    activityLevel: 3,
    goal: 'maintain',
  },
  open: true,
  onClose: jest.fn(),
  token: 'token',
  intl: {
    formatMessage: jest.fn(),
  },
};

beforeEach(() => {
  wrapper = render(<EditProfileModal {...mockProps} />);
});

describe('EditProfileModal Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('edit-profile-modal')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should handle form cancellation', () => {
    const { getByText } = wrapper;

    fireEvent.click(getByText('Batal'));

    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
