import VerifyEmail from '@components/forms/VerifyEmail';
import { render } from '@utils/testHelper';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let wrapper;

beforeEach(() => {
  wrapper = render(<VerifyEmail />);
});

describe('VerifyEmail Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId('verify-email')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
