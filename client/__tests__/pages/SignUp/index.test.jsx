import SignUp from '@pages/SignUp';
import { render } from '@utils/testHelper';

let wrapper;

const mockProps = {
  currentStep: 2,
};

beforeEach(() => {
  wrapper = render(<SignUp {...mockProps} />);
});

describe('SignUp Page', () => {
  it('should render the page correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('sign-up')).toBeInTheDocument();
    expect(getByTestId('form-card')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
