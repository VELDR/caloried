import Features from '@components/landing-page/Features';
import { render } from '@utils/testHelper';

let wrapper;

const mockProps = {
  formatMessage: jest.fn(),
};

beforeEach(() => {
  wrapper = render(<Features {...mockProps} />);
});

describe('Features Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('features')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
