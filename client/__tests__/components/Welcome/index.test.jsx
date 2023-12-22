import Welcome from '@components/forms/Welcome';
import { render } from '@utils/testHelper';

let wrapper;

beforeEach(() => {
  wrapper = render(<Welcome />);
});

describe('Welcome Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('welcome')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
