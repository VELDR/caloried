import FeatureCard from '@components/landing-page/FeatureCard';
import { render } from '@utils/testHelper';

let wrapper;

const mockProps = {
  icon: <div data-testid="mock-icon" />,
  title: 'Mock Title',
  subtitle: 'Mock Subtitle',
};

beforeEach(() => {
  wrapper = render(<FeatureCard {...mockProps} />);
});

describe('FeatureCard Component', () => {
  it('should render the component correctly', () => {
    const { getByText, getByTestId } = wrapper;
    expect(getByTestId('feature-card')).toBeInTheDocument();
    expect(getByText('Mock Title')).toBeInTheDocument();
    expect(getByText('Mock Subtitle')).toBeInTheDocument();
    expect(getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
