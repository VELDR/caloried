import FormHeader from '@components/forms/FormHeader';
import { render } from '@utils/testHelper';

let wrapper;

const mockProps = {
  title: 'Test Title',
  description: 'Test Description',
};

beforeEach(() => {
  wrapper = render(<FormHeader {...mockProps} />);
});

describe('FormHeader Component', () => {
  it('should render the component correctly', () => {
    const { getByTestId, getByText } = wrapper;

    const formHeader = getByTestId('form-header');

    expect(formHeader).toBeInTheDocument();

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
