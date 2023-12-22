import GoalsForm from '@components/forms/GoalsForm';
import { fireEvent, render } from '@utils/testHelper';

let wrapper;

const mockProps = {
  goal: 'maintain',
  intl: { formatMessage: jest.fn() },
};

beforeEach(() => {
  wrapper = render(<GoalsForm {...mockProps} />);
});

describe('GoalsForm Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId, getByText } = wrapper;

    expect(getByTestId('goals-form')).toBeInTheDocument();
    expect(getByTestId('form-header')).toBeInTheDocument();

    expect(getByText('Turunkan Berat Badan')).toBeInTheDocument();
    expect(getByText('Pertahankan Berat Badan')).toBeInTheDocument();
    expect(getByText('Menambah Berat Badan')).toBeInTheDocument();
  });
  it('should handle goal selection', () => {
    const { getByText, getByTestId } = wrapper;

    fireEvent.click(getByText('Menambah Berat Badan'));
    expect(getByTestId('goal-item-gain')).toHaveClass('active');
    expect(getByTestId('goal-item-maintain')).not.toHaveClass('active');
  });
  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
