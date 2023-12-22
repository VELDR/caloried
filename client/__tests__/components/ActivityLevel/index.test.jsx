import ActivityLevel from '@components/forms/ActivityLevel';
import { render } from '@utils/testHelper';

let wrapper;

beforeEach(() => {
  wrapper = render(<ActivityLevel />);
});

describe('ActivityLevel Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('activity-level')).toBeInTheDocument();
    expect(getByTestId('form-header')).toBeInTheDocument();
    expect(getByTestId('form-footer')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
