import NotFound from '@pages/NotFound';
import { fireEvent, render } from '@utils/testHelper';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

beforeEach(() => {
  wrapper = render(<NotFound />);
});

describe('NotFound page', () => {
  it('should render the page correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('not-found')).toBeInTheDocument();
  });

  it('should call navigate back when back button is clicked', () => {
    const { getByTestId } = wrapper;

    const backButton = getByTestId('not-found-back');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
