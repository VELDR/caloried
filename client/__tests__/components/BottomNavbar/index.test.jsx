import BottomNavbar from '@components/ui/BottomNavbar';
import { fireEvent, render } from '@utils/testHelper';

const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/dashboard',
};

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

let wrapper;

beforeEach(() => {
  wrapper = render(<BottomNavbar />);
});

describe('BottomNavbar Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('bottom-navbar')).toBeInTheDocument();
  });
  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should call navigate to dashboard when dashboard button is clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('bottom-navigate-dashboard');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(`/dashboard`);
  });
  it('should call navigate to diary when diary button is clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('bottom-navigate-diary');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(`/diary`);
  });
  it('should call navigate to search when food button is clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('bottom-navigate-search');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(`/search`);
  });
  it('should call navigate to profile when profile button is clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('bottom-navigate-profile');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(`/profile`);
  });
  it('should apply the correct classes for active and inactive buttons', () => {
    const { getByTestId } = wrapper;

    const dashboardButton = getByTestId('bottom-navigate-dashboard');
    expect(dashboardButton).toHaveClass('active');
    expect(dashboardButton).toHaveClass('navbar__item');

    const diaryButton = getByTestId('bottom-navigate-diary');
    expect(diaryButton).not.toHaveClass('active');
    expect(diaryButton).toHaveClass('navbar__item');

    mockLocation.pathname = '/diary';
    wrapper.rerender(<BottomNavbar />);

    expect(diaryButton).toHaveClass('active');
  });
});
