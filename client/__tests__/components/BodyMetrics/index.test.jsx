import BodyMetrics from '@components/forms/BodyMetrics';
import { render, fireEvent } from '@utils/testHelper';

let wrapper;

const mockMetrics = {
  sex: 'male',
  dob: '1990-01-01',
  height: 180,
  weight: 75,
};

const mockProps = {
  metrics: mockMetrics,
  intl: { formatMessage: jest.fn() },
};

beforeEach(() => {
  wrapper = render(<BodyMetrics {...mockProps} />);
});

describe('BodyMetrics Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = wrapper;

    expect(getByTestId('body-metrics')).toBeInTheDocument();
  });

  it('should update metrics data on user interaction', () => {
    const { getByTestId } = wrapper;

    const dobInput = getByTestId('metrics-dob');
    const heightInput = getByTestId('metrics-height');
    const weightInput = getByTestId('metrics-weight');
    fireEvent.click(getByTestId('sex-option-female'));
    fireEvent.change(dobInput, { target: { value: '1995-05-05' } });
    fireEvent.change(heightInput, { target: { value: 170 } });
    fireEvent.change(weightInput, { target: { value: 65 } });

    expect(getByTestId('sex-option-female')).toHaveClass('activeFemale');
    expect(dobInput.value).toBe('1995-05-05');
    expect(heightInput.value).toBe('170');
    expect(weightInput.value).toBe('65');
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
