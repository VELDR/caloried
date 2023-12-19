import Sidebar from '@components/ui/Sidebar';
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
  wrapper = render(<Sidebar />);
  const { getByTestId } = wrapper;
  const toggleButton = getByTestId('toggle-sidebar');
  fireEvent.click(toggleButton);
});

describe('Sidebar Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('sidebar')).toBeInTheDocument();
  });
  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should call navigate to dashboard when dashboard button is clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('side-navigate-dashboard');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(`/dashboard`);
  });
  it('should call navigate to diary when diary button is clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('side-navigate-diary');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(`/diary`);
  });
  it('should call navigate to search when food button is clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('side-navigate-search');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(`/search`);
  });
  it('should call navigate to profile when profile button is clicked', () => {
    const { getByTestId } = wrapper;
    const button = getByTestId('side-navigate-profile');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(`/profile`);
  });
  it('should apply the correct classes for active and inactive buttons', () => {
    const { getByTestId } = wrapper;

    const dashboardButton = getByTestId('side-navigate-dashboard');
    expect(dashboardButton).toHaveClass('active');
    expect(dashboardButton).toHaveClass('sidebar__item');

    const diaryButton = getByTestId('side-navigate-diary');
    expect(diaryButton).not.toHaveClass('active');
    expect(diaryButton).toHaveClass('sidebar__item');

    mockLocation.pathname = '/diary';
    wrapper.rerender(<Sidebar />);

    expect(diaryButton).toHaveClass('active');
  });
});
